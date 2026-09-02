import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnedProducts } from "@/lib/commerce";
import { products } from "@/lib/products";
import { pick } from "@/lib/localized";
import { ProductScreenshot } from "@/components/product-screenshot";
import type { Locale } from "@/i18n/routing";
import { noIndex } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "myProducts" });
  return { title: t("title"), robots: noIndex };
}

export default async function MyProductsPage() {
  const locale = (await getLocale()) as Locale;
  const owned = await getOwnedProducts();
  const t = await getTranslations("myProducts");
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const ownedWithDetails = owned
    .map((row) => ({ row, product: products.find((p) => p.slug === row.product_slug) }))
    .filter((x): x is { row: (typeof owned)[number]; product: NonNullable<typeof x.product> } => !!x.product);

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {ownedWithDetails.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6">
          <div>
            <p className="text-sm font-medium text-foreground">{t("empty")}</p>
            <p className="text-sm text-muted-foreground">{t("emptyDesc")}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ownedWithDetails.map(({ row, product }) => {
            const cover = product.gallery[0];
            return (
              <div key={row.product_slug} className="rounded-2xl border border-border bg-surface p-4">
                <ProductScreenshot
                  src={cover.src}
                  alt={pick(cover.alt, locale)}
                  width={cover.width}
                  height={cover.height}
                />
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {pick(product.name, locale)}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("purchasedOn", { date: dateFormatter.format(new Date(row.granted_at)) })}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    <ExternalLink className="size-3.5" />
                    {t("viewProduct")}
                  </Link>
                  <Link
                    href="/account/downloads"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    <Download className="size-3.5" />
                    {t("goToDownloads")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
