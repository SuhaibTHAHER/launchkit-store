import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";
import { getWishlistSlugs } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";

export async function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const t = await getTranslations("productDetail");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistSlugs = await getWishlistSlugs();

  return (
    <section className="border-t border-border py-16 sm:py-24">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("youMightAlsoLike")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              wishlisted={wishlistSlugs.has(product.slug)}
              signedIn={!!user}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
