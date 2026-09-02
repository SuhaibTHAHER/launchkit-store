import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
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

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit {product.name.en}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.slug}</p>
      </div>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
