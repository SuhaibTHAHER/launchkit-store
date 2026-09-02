"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { getCategory } from "@/lib/categories";
import { pick } from "@/lib/localized";
import { ProductScreenshot } from "@/components/product-screenshot";
import { WishlistButton } from "@/components/wishlist-button";

function sku(product: Product) {
  return `LK-${product.id.replace("launchkit-", "").slice(0, 4).toUpperCase()}`;
}

export function ProductCard({
  product,
  wishlisted = false,
  signedIn = false,
}: {
  product: Product;
  wishlisted?: boolean;
  signedIn?: boolean;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("products");
  const category = getCategory(product.categorySlug);
  const cover = product.gallery[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col border border-border bg-surface p-4 transition-colors hover:border-accent"
    >
      <div className="relative">
        <ProductScreenshot
          src={cover.src}
          alt={pick(cover.alt, locale)}
          width={cover.width}
          height={cover.height}
        />
        <WishlistButton
          productSlug={product.slug}
          initialWishlisted={wishlisted}
          signedIn={signedIn}
          className="absolute end-2 top-2 bg-surface/90 backdrop-blur"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="label text-[11px] text-muted-foreground">{sku(product)}</span>
        {category && (
          <span className="label text-[11px] text-muted-foreground">
            {pick(category.name, locale)}
          </span>
        )}
      </div>

      <h3 className="mt-2 text-lg font-semibold text-foreground">
        {pick(product.name, locale)}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {pick(product.tagline, locale)}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
          {t("viewTemplate")}
          <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </span>
        <span className="flex items-baseline gap-1.5">
          {product.originalPrice && (
            <span className="font-mono text-xs text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
          <span className="bg-accent px-2 py-1 font-mono text-sm font-semibold tabular text-accent-foreground">
            ${product.price}
          </span>
        </span>
      </div>
    </Link>
  );
}
