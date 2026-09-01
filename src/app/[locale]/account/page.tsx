import type { Metadata } from "next";
import { Package, Heart, Receipt, ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOwnedProducts, getOrders, getWishlistSlugs } from "@/lib/commerce";
import { products } from "@/lib/products";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { title: t("title") };
}

export default async function AccountDashboardPage() {
  const locale = (await getLocale()) as Locale;

  const [owned, wishlistSlugs, orders] = await Promise.all([
    getOwnedProducts(),
    getWishlistSlugs(),
    getOrders(),
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="size-4" />
            <span className="text-sm font-medium">{t("productsOwned")}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{owned.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="size-4" />
            <span className="text-sm font-medium">{t("wishlistItems")}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{wishlistSlugs.size}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="size-4" />
            <span className="text-sm font-medium">{t("totalOrders")}</span>
          </div>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">{orders.length}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">{t("myProductsTitle")}</h2>
          {ownedWithDetails.length > 0 && (
            <Link
              href="/account/products"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              {t("viewAll")}
              <ArrowRight className="size-4 rtl:rotate-180" />
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
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              {t("browseProducts")}
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">{t("recentOrdersTitle")}</h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              {t("viewAll")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          )}
        </div>

        {orders.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {orders.slice(0, 3).map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-foreground">{order.product_slug}</span>
                <span className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {order.currency} {order.amount}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {statusLabel(order.status)}
                  </span>
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
