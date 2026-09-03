import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { FileUpload } from "@/components/admin/file-upload";
import { createClient } from "@/lib/supabase/server";
import { noIndex } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit product — Admin", robots: noIndex };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getAllProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const supabase = await createClient();
  const { data: files } = await supabase.storage.from("launchkit-downloads").list();
  const hasFile = (files ?? []).some((f) => f.name === `${slug}.zip`);

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit {product.name.en}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.slug}</p>
      </div>

      <div className="mt-8 border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">Downloadable file</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The .zip a buyer downloads from My Downloads once they own this product.
        </p>
        <div className="mt-4">
          <FileUpload slug={product.slug} hasFile={hasFile} />
        </div>
      </div>

      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
