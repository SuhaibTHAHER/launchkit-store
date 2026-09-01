import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";
import { ProductBrowser } from "@/components/product-browser";
import { products } from "@/lib/products";
import { getCategory } from "@/lib/categories";
import { getWishlistSlugs } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = category && getCategory(category) ? category : "all";
  const t = await getTranslations("products");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistSlugs = await getWishlistSlugs();

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12">
          <ProductBrowser
            products={products}
            initialCategory={initialCategory}
            wishlistedSlugs={[...wishlistSlugs]}
            signedIn={!!user}
          />
        </div>
      </Container>
    </section>
  );
}
