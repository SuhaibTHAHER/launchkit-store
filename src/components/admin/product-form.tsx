"use client";

import { useActionState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import type { Product } from "@/lib/products";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/lib/actions/admin-products";
import { JsonField } from "@/components/admin/json-field";
import { ProductScreenshot } from "@/components/product-screenshot";

const CATEGORIES = [
  { value: "marketing-sites", label: "Marketing sites" },
  { value: "dashboard-ui-kits", label: "Dashboard UI kits" },
  { value: "ui-kits", label: "UI kits" },
  { value: "bundles", label: "Bundles" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-negative">{error}</p>}
    </label>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const isEdit = !!product;
  const action = isEdit ? updateProductAction : createProductAction;
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state && "success" in state) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [state, router]);

  const fieldErrors = state && "fieldErrors" in state ? state.fieldErrors : {};

  return (
    <form action={formAction} className="max-w-3xl space-y-10">
      {isEdit && <input type="hidden" name="productSlug" value={product.slug} />}

      {state && "error" in state && (
        <p className="rounded-lg border border-negative/40 bg-negative/5 p-3 text-sm text-negative">
          {state.error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Basics</h2>

        <Field label="Slug" error={fieldErrors.slug}>
          <input
            name="slug"
            defaultValue={product?.slug}
            disabled={isEdit}
            required
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name (EN)" error={fieldErrors.name}>
            <input name="nameEn" defaultValue={product?.name.en} required className={inputClass} />
          </Field>
          <Field label="Name (AR)">
            <input name="nameAr" defaultValue={product?.name.ar} dir="rtl" required className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tagline (EN)">
            <input name="taglineEn" defaultValue={product?.tagline.en} className={inputClass} />
          </Field>
          <Field label="Tagline (AR)">
            <input name="taglineAr" defaultValue={product?.tagline.ar} dir="rtl" className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Description (EN)">
            <textarea name="descriptionEn" defaultValue={product?.description.en} rows={3} className={inputClass} />
          </Field>
          <Field label="Description (AR)">
            <textarea
              name="descriptionAr"
              defaultValue={product?.description.ar}
              dir="rtl"
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Who it&apos;s for (EN)">
            <textarea name="whoItsForEn" defaultValue={product?.whoItsFor.en} rows={2} className={inputClass} />
          </Field>
          <Field label="Who it&apos;s for (AR)">
            <textarea
              name="whoItsForAr"
              defaultValue={product?.whoItsFor.ar}
              dir="rtl"
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Who it&apos;s not for (EN)">
            <textarea name="whoItsNotForEn" defaultValue={product?.whoItsNotFor.en} rows={2} className={inputClass} />
          </Field>
          <Field label="Who it&apos;s not for (AR)">
            <textarea
              name="whoItsNotForAr"
              defaultValue={product?.whoItsNotFor.ar}
              dir="rtl"
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Pricing &amp; category</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (USD)" error={fieldErrors.price}>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Original price (optional)" error={fieldErrors.originalPrice}>
            <input
              name="originalPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.originalPrice}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select name="categorySlug" defaultValue={product?.categorySlug ?? "marketing-sites"} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Demo URL">
            <input name="demoUrl" defaultValue={product?.demoUrl} className={inputClass} />
          </Field>
          <Field label="Paddle price ID">
            <input
              name="paddlePriceId"
              defaultValue={product?.paddlePriceId}
              placeholder="pri_..."
              className={inputClass}
            />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          Changing the Paddle price ID rewires which product a future real payment grants — leave it alone unless
          you know the matching price in Paddle&apos;s dashboard.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4" />
            Featured on homepage
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product?.published ?? true}
              className="size-4"
            />
            Published (visible on the storefront)
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Metadata</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Version">
            <input name="version" defaultValue={product?.version} className={inputClass} />
          </Field>
          <Field label="Released">
            <input name="releasedAt" type="date" defaultValue={product?.createdAt} className={inputClass} />
          </Field>
          <Field label="Last updated">
            <input name="lastUpdated" type="date" defaultValue={product?.lastUpdated} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tags (comma-separated)">
            <input name="tags" defaultValue={product?.tags.join(", ")} className={inputClass} />
          </Field>
          <Field label="Tech stack (comma-separated)">
            <input name="techStack" defaultValue={product?.techStack.join(", ")} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pages included (comma-separated, optional)">
            <input name="pagesIncluded" defaultValue={product?.pagesIncluded?.join(", ")} className={inputClass} />
          </Field>
          <Field label="Components included (comma-separated, optional)">
            <input
              name="componentsIncluded"
              defaultValue={product?.componentsIncluded?.join(", ")}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="File tree">
          <textarea
            name="fileTree"
            defaultValue={product?.fileTree}
            rows={5}
            dir="ltr"
            className={`${inputClass} font-mono text-xs`}
          />
        </Field>
      </section>

      {product && product.gallery.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Current gallery</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.gallery.map((g) => (
              <div key={g.src} className="w-28 shrink-0">
                <ProductScreenshot src={g.src} alt={g.alt.en} width={g.width} height={g.height} />
                <p className="mt-1 truncate text-[10px] text-muted-foreground">{g.src}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Rich content (advanced — raw JSON)</h2>
        <p className="text-xs text-muted-foreground">
          Gallery images are files under /public/products — adding a new image still needs a code deploy; this only
          edits which existing files are referenced, in what order, with what captions.
        </p>
        <JsonField name="gallery" label="Gallery" defaultValue={product?.gallery} error={fieldErrors.gallery} rows={6} />
        <JsonField name="features" label="Features" defaultValue={product?.features} error={fieldErrors.features} rows={6} />
        <JsonField name="includes" label="Includes" defaultValue={product?.includes} error={fieldErrors.includes} rows={4} />
        <JsonField
          name="notIncluded"
          label="Not included"
          defaultValue={product?.notIncluded}
          error={fieldErrors.notIncluded}
          rows={4}
        />
        <JsonField
          name="requirements"
          label="Requirements"
          defaultValue={product?.requirements}
          error={fieldErrors.requirements}
          rows={3}
        />
        <JsonField
          name="howItWorks"
          label="How it works"
          defaultValue={product?.howItWorks}
          error={fieldErrors.howItWorks}
          rows={6}
        />
        <JsonField
          name="changelog"
          label="Changelog"
          defaultValue={product?.changelog}
          error={fieldErrors.changelog}
          rows={4}
        />
        <JsonField name="faq" label="FAQ" defaultValue={product?.faq} error={fieldErrors.faq} rows={6} />
      </section>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
