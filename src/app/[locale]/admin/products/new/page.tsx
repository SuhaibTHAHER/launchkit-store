import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { noIndex } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "New product — Admin", robots: noIndex };
}

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">New product</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new template to the catalog.</p>
      </div>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
