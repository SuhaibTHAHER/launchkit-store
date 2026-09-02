import { cache } from "react";
import type { Localized } from "./localized";
import { createPublicClient } from "@/lib/supabase/public";

export type ProductFaqItem = {
  question: Localized<string>;
  answer: Localized<string>;
};

export type GalleryImage = {
  src: string;
  alt: Localized<string>;
  label: Localized<string>;
  width: number;
  height: number;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  notes: Localized<string[]>;
};

export type HowItWorksStep = {
  title: Localized<string>;
  description: Localized<string>;
};

export type Product = {
  slug: string;
  name: Localized<string>;
  tagline: Localized<string>;
  description: Localized<string>;
  whoItsFor: Localized<string>;
  whoItsNotFor: Localized<string>;
  categorySlug: "marketing-sites" | "dashboard-ui-kits" | "ui-kits" | "bundles";
  price: number;
  originalPrice?: number;
  /** Live URL of the running demo. Points at local dev ports for now —
   *  swap for real deployed URLs before launch (see README). */
  demoUrl: string;
  gallery: GalleryImage[];
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  version: string;
  lastUpdated: string;
  /** Paddle Price ID for checkout — replace with real IDs from your Paddle
   *  dashboard (Catalog → Products → Prices) before going live. */
  paddlePriceId: string;
  features: Localized<{ title: string; description: string }[]>;
  includes: Localized<string[]>;
  notIncluded: Localized<string[]>;
  pagesIncluded?: string[];
  componentsIncluded?: string[];
  fileTree: string;
  techStack: string[];
  requirements: Localized<string[]>;
  howItWorks: HowItWorksStep[];
  changelog: ChangelogEntry[];
  faq: ProductFaqItem[];
};

const PRODUCT_COLUMNS =
  "slug, name, tagline, description, who_its_for, who_its_not_for, category_slug, price, original_price, demo_url, gallery, tags, tech_stack, featured, published, released_at, version, last_updated, paddle_price_id, features, includes, not_included, requirements, pages_included, components_included, file_tree, how_it_works, changelog, faq";

type ProductRow = {
  slug: string;
  name: Localized<string>;
  tagline: Localized<string>;
  description: Localized<string>;
  who_its_for: Localized<string>;
  who_its_not_for: Localized<string>;
  category_slug: Product["categorySlug"];
  price: string | number;
  original_price: string | number | null;
  demo_url: string;
  gallery: GalleryImage[];
  tags: string[];
  tech_stack: string[];
  featured: boolean;
  published: boolean;
  released_at: string;
  version: string;
  last_updated: string;
  paddle_price_id: string | null;
  features: Product["features"];
  includes: Product["includes"];
  not_included: Product["notIncluded"];
  requirements: Product["requirements"];
  pages_included: string[] | null;
  components_included: string[] | null;
  file_tree: string;
  how_it_works: HowItWorksStep[];
  changelog: ChangelogEntry[];
  faq: ProductFaqItem[];
};

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    whoItsFor: row.who_its_for,
    whoItsNotFor: row.who_its_not_for,
    categorySlug: row.category_slug,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    demoUrl: row.demo_url,
    gallery: row.gallery,
    tags: row.tags,
    featured: row.featured,
    published: row.published,
    createdAt: row.released_at,
    version: row.version,
    lastUpdated: row.last_updated,
    paddlePriceId: row.paddle_price_id ?? "",
    features: row.features,
    includes: row.includes,
    notIncluded: row.not_included,
    pagesIncluded: row.pages_included ?? undefined,
    componentsIncluded: row.components_included ?? undefined,
    fileTree: row.file_tree,
    techStack: row.tech_stack,
    requirements: row.requirements,
    howItWorks: row.how_it_works,
    changelog: row.changelog,
    faq: row.faq,
  };
}

/** Published products only — what the public storefront shows. */
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("launchkit_products")
    .select(PRODUCT_COLUMNS)
    .eq("published", true)
    .order("released_at", { ascending: false });
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map((row) => rowToProduct(row as unknown as ProductRow));
});

/** Every product, published or not — for admin, and for account pages
 *  resolving a slug a user already owns (which may have been unpublished
 *  since they bought it). */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("launchkit_products")
    .select(PRODUCT_COLUMNS)
    .order("released_at", { ascending: false });
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []).map((row) => rowToProduct(row as unknown as ProductRow));
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("launchkit_products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load product ${slug}: ${error.message}`);
  return data ? rowToProduct(data as unknown as ProductRow) : null;
});

/** Derived catalog-style SKU code, e.g. "launchkit-ai" -> "LK-AI". */
export function productSku(slug: string): string {
  return `LK-${slug.replace("launchkit-", "").slice(0, 4).toUpperCase()}`;
}

export function getRelatedProducts(
  product: Product,
  allProducts: Product[],
  limit = 2
): Product[] {
  return allProducts.filter((p) => p.slug !== product.slug).slice(0, limit);
}
