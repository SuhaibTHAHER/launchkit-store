import type { Metadata } from "next";
import { Package, Heart, Receipt, ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnedProducts, getOrders, getWishlistSlugs } from "@/lib/commerce";
import { getAllProducts } from "@/lib/products";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import { noIndex } from "@/lib/seo";
import { StatusStamp } from "@/components/account/status-stamp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("title"), robots: noIndex };
}

export default async function AccountDashboardPage() {
  const locale = (await getLocale()) as Locale;

  const [owned, wishlistSlugs, orders, products] = await Promise.all([
    getOwnedProducts(),
    getWishlistSlugs(),
    getOrders(),
    getAllProducts(),
  ]);

  const t = await getTranslations("dashboard");
  const tOrders = await getTranslations("ordersPage");

  const ownedWithDetails = owned
    .map((row) => ({ row, product: products.find((p) => p.slug === row.product_slug) }))
    .filter((x): x is { row: (typeof owned)[number]; product: NonNullable<typeof x.product> } => !!x.product);

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const statusLabel = (status: string) =>
    status === "completed"
      ? tOrders("statusCompleted")
      : status === "refunded"
        ? tOrders("statusRefunded")
        : tOrders("statusPending");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="size-4" />
            <span className="label text-[11px]">{t("productsOwned")}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{owned.length}</p>
        </div>
        <div className="border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="size-4" />
            <span className="label text-[11px]">{t("wishlistItems")}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{wishlistSlugs.size}</p>
        </div>
        <div className="border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="size-4" />
            <span className="label text-[11px]">{t("totalOrders")}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{orders.length}</p>
        </div>
      </div>

      <div className="mt-6 border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="label text-xs text-foreground">{t("myProductsTitle")}</h2>
          {ownedWithDetails.length > 0 && (
            <Link
              href="/account/products"
              className="label inline-flex items-center gap-1 text-[11px] font-medium text-accent"
            >
              {t("viewAll")}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          )}
        </div>

        {ownedWithDetails.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {ownedWithDetails.slice(0, 3).map(({ row, product }) => (
              <li key={row.product_slug} className="flex items-center justify-between py-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-sm font-medium text-foreground hover:text-accent"
                >
                  {pick(product.name, locale)}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(row.granted_at))}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{t("emptyStateTitle")}</p>
              <p className="text-sm text-muted-foreground">{t("emptyStateDesc")}</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              {t("browseProducts")}
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="label text-xs text-foreground">{t("recentOrdersTitle")}</h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="label inline-flex items-center gap-1 text-[11px] font-medium text-accent"
            >
              {t("viewAll")}
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          )}
        </div>

        {orders.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {orders.slice(0, 3).map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-foreground">{order.product_slug}</span>
                <span className="flex items-center gap-3">
                  <span className="tabular-nums text-muted-foreground">
                    {order.currency} {order.amount}
                  </span>
                  <StatusStamp status={order.status}>{statusLabel(order.status)}</StatusStamp>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">{tOrders("empty")}</p>
        )}
      </div>
    </div>
  );
}
