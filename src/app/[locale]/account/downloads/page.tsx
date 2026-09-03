import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnedProducts } from "@/lib/commerce";
import { getAllProducts, productSku } from "@/lib/products";
import { pick } from "@/lib/localized";
import { createClient } from "@/lib/supabase/server";
import { DownloadButton } from "@/components/account/download-button";
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

  // RLS on storage.objects only returns files the signed-in user owns, so
  // this list is already scoped correctly — no extra filtering needed.
  const supabase = await createClient();
  const { data: files } = await supabase.storage.from("launchkit-downloads").list();
  const availableSlugs = new Set((files ?? []).map((f) => f.name.replace(/\.zip$/, "")));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {ownedWithDetails.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 border border-border bg-surface p-6">
          <div>
            <p className="text-sm font-medium text-foreground">{t("empty")}</p>
            <p className="text-sm text-muted-foreground">{t("emptyDesc")}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border border border-border bg-surface">
          {ownedWithDetails.map((product) => (
            <li key={product.slug} className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="label text-[11px] text-muted-foreground">
                    {productSku(product.slug)}
                  </span>
                  <span className="label text-[11px] text-muted-foreground">
                    v{product.version}
                  </span>
                </div>
                <span className="mt-1 block text-sm font-medium text-foreground">
                  {pick(product.name, locale)}
                </span>
              </div>
              {availableSlugs.has(product.slug) ? (
                <DownloadButton productSlug={product.slug} label={t("downloadButton")} />
              ) : (
                <span
                  className="label border border-border px-2.5 py-1 text-[10px] text-muted-foreground"
                  title={t("notUploadedYet")}
                >
                  {t("notUploadedYet")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
