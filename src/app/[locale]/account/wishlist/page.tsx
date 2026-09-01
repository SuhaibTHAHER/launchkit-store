import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getWishlistSlugs } from "@/lib/commerce";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wishlist" });
  return { title: t("title") };
}

export default async function WishlistPage() {
  const wishlistSlugs = await getWishlistSlugs();
  const t = await getTranslations("wishlist");

  const wishlistedProducts = products.filter((p) => wishlistSlugs.has(p.slug));

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} wishlisted signedIn />
          ))}
        </div>
      )}
    </div>
  );
}
