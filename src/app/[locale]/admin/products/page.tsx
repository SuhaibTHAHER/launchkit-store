import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getAllProducts } from "@/lib/products";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { noIndex } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Products — Admin", robots: noIndex };
}

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the storefront catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          New product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Product</th>
              <th className="px-4 py-3 text-start font-medium">Category</th>
              <th className="px-4 py-3 text-start font-medium">Price</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.slug}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{product.name.en}</p>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.categorySlug}</td>
                <td className="px-4 py-3 tabular-nums text-foreground">${product.price}</td>
                <td className="px-4 py-3">
                  <PublishToggle slug={product.slug} published={product.published} />
                </td>
                <td className="px-4 py-3 text-end">
                  <Link
                    href={`/admin/products/${product.slug}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
