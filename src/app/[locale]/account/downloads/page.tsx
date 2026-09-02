import type { Metadata } from "next";
import { Download, Info } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnedProducts } from "@/lib/commerce";
import { getAllProducts } from "@/lib/products";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import { noIndex } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "downloadsPage" });
  return { title: t("title"), robots: noIndex };
}

export default async function DownloadsPage() {
  const locale = (await getLocale()) as Locale;
  const owned = await getOwnedProducts();
  const products = await getAllProducts();
  const t = await getTranslations("downloadsPage");

  const ownedWithDetails = owned
    .map((row) => products.find((p) => p.slug === row.product_slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

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
        <>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>{t("notConnectedNote")}</p>
          </div>

          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface">
            {ownedWithDetails.map((product) => (
              <li key={product.slug} className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-foreground">
                  {pick(product.name, locale)}
                </span>
                <button
                  type="button"
                  disabled
                  title={t("notConnectedNote")}
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground opacity-60"
                >
                  <Download className="size-4" />
                  {t("downloadButton")}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
