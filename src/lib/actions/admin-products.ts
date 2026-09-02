"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export type ProductFormState =
  | { error: string; fieldErrors: Record<string, string> }
  | { success: true }
  | null;

function localized(formData: FormData, prefix: string) {
  return {
    en: String(formData.get(`${prefix}En`) ?? "").trim(),
    ar: String(formData.get(`${prefix}Ar`) ?? "").trim(),
  };
}

function commaList(formData: FormData, name: string): string[] {
  return String(formData.get(name) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parses one JSON textarea. On failure, records a field-specific error and
 *  keeps the previous/fallback value rather than wiping the row. */
function jsonField<T>(
  formData: FormData,
  name: string,
  fallback: T,
  fieldErrors: Record<string, string>
): T {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    fieldErrors[name] = e instanceof Error ? `Invalid JSON — ${e.message}` : "Invalid JSON";
    return fallback;
  }
}

function validateGallery(gallery: unknown, fieldErrors: Record<string, string>) {
  if (!Array.isArray(gallery)) {
    fieldErrors.gallery = "Must be a JSON array.";
    return;
  }
  for (const [i, item] of gallery.entries()) {
    if (typeof item !== "object" || item === null || !("src" in item)) {
      fieldErrors.gallery = `Item ${i + 1} is missing "src".`;
      return;
    }
  }
}

function validateLocalizedArray(value: unknown, name: string, fieldErrors: Record<string, string>) {
  if (typeof value !== "object" || value === null || !("en" in value) || !("ar" in value)) {
    fieldErrors[name] = 'Must be an object with "en" and "ar" arrays.';
  }
}

type BuiltFields = {
  fields: Record<string, unknown>;
  fieldErrors: Record<string, string>;
};

function buildFields(formData: FormData): BuiltFields {
  const fieldErrors: Record<string, string> = {};

  const price = Number(formData.get("price"));
  const originalPriceRaw = String(formData.get("originalPrice") ?? "").trim();
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;

  const name = localized(formData, "name");
  if (!name.en || !name.ar) fieldErrors.name = "Name is required in both languages.";
  if (Number.isNaN(price) || price < 0) fieldErrors.price = "Price must be a positive number.";
  if (originalPriceRaw && (originalPrice === null || Number.isNaN(originalPrice) || originalPrice < 0)) {
    fieldErrors.originalPrice = "Must be a positive number, or left blank.";
  }

  const gallery = jsonField(formData, "gallery", [], fieldErrors);
  if (!fieldErrors.gallery) validateGallery(gallery, fieldErrors);
  const features = jsonField(formData, "features", { en: [], ar: [] }, fieldErrors);
  if (!fieldErrors.features) validateLocalizedArray(features, "features", fieldErrors);
  const includes = jsonField(formData, "includes", { en: [], ar: [] }, fieldErrors);
  if (!fieldErrors.includes) validateLocalizedArray(includes, "includes", fieldErrors);
  const notIncluded = jsonField(formData, "notIncluded", { en: [], ar: [] }, fieldErrors);
  if (!fieldErrors.notIncluded) validateLocalizedArray(notIncluded, "notIncluded", fieldErrors);
  const requirements = jsonField(formData, "requirements", { en: [], ar: [] }, fieldErrors);
  if (!fieldErrors.requirements) validateLocalizedArray(requirements, "requirements", fieldErrors);
  const howItWorks = jsonField(formData, "howItWorks", [], fieldErrors);
  const changelog = jsonField(formData, "changelog", [], fieldErrors);
  const faq = jsonField(formData, "faq", [], fieldErrors);

  const today = new Date().toISOString().slice(0, 10);

  const fields: Record<string, unknown> = {
    name,
    tagline: localized(formData, "tagline"),
    description: localized(formData, "description"),
    who_its_for: localized(formData, "whoItsFor"),
    who_its_not_for: localized(formData, "whoItsNotFor"),
    category_slug: String(formData.get("categorySlug") ?? "marketing-sites"),
    price: Number.isNaN(price) ? 0 : price,
    original_price: originalPrice,
    demo_url: String(formData.get("demoUrl") ?? "").trim(),
    tags: commaList(formData, "tags"),
    tech_stack: commaList(formData, "techStack"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    released_at: String(formData.get("releasedAt") ?? "").trim() || today,
    version: String(formData.get("version") ?? "").trim() || "1.0.0",
    last_updated: String(formData.get("lastUpdated") ?? "").trim() || today,
    paddle_price_id: String(formData.get("paddlePriceId") ?? "").trim() || null,
    file_tree: String(formData.get("fileTree") ?? ""),
    pages_included: commaList(formData, "pagesIncluded"),
    components_included: commaList(formData, "componentsIncluded"),
    gallery,
    features,
    includes,
    not_included: notIncluded,
    requirements,
    how_it_works: howItWorks,
    changelog,
    faq,
    updated_at: new Date().toISOString(),
  };

  return { fields, fieldErrors };
}

function revalidateStorefront(slug: string) {
  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/products", "page");
  revalidatePath(`/[locale]/products/${slug}`, "page");
  revalidatePath("/[locale]", "page");
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const { fields, fieldErrors } = buildFields(formData);

  if (!slug) fieldErrors.slug = "Slug is required.";
  else if (!/^[a-z0-9-]+$/.test(slug)) {
    fieldErrors.slug = "Lowercase letters, numbers, and hyphens only.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Fix the highlighted fields before saving.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("launchkit_products").insert({ slug, ...fields });
  if (error) {
    return {
      error: error.code === "23505" ? "A product with this slug already exists." : error.message,
      fieldErrors: {},
    };
  }

  revalidateStorefront(slug);
  return { success: true };
}

export async function updateProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const slug = String(formData.get("productSlug") ?? "").trim();
  if (!slug) return { error: "Missing product slug.", fieldErrors: {} };

  const { fields, fieldErrors } = buildFields(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Fix the highlighted fields before saving.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("launchkit_products").update(fields).eq("slug", slug);
  if (error) return { error: error.message, fieldErrors: {} };

  revalidateStorefront(slug);
  return { success: true };
}

export async function togglePublishedAction(slug: string, nextPublished: boolean): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("launchkit_products")
    .update({ published: nextPublished, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  revalidateStorefront(slug);
}
