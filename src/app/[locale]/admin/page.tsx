import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Users, Receipt, DollarSign, FlaskConical } from "lucide-react";
import { getAdminOverview } from "@/lib/admin-data";
import { noIndex } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("title"), robots: noIndex };
}

export default async function AdminOverviewPage() {
  const t = await getTranslations("admin");
  const overview = await getAdminOverview();

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="size-4" />
            <span className="text-sm font-medium">{t("realRevenue")}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">
            {currencyFormatter.format(overview.realRevenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FlaskConical className="size-4" />
            <span className="text-sm font-medium">{t("demoRevenue")}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">
            {currencyFormatter.format(overview.demoRevenue)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t("demoRevenueNote")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="size-4" />
            <span className="text-sm font-medium">{t("totalOrders")}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">
            {overview.totalOrders}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            <span className="text-sm font-medium">{t("totalUsers")}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">
            {overview.totalUsers}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-semibold text-foreground">{t("ordersByStatusTitle")}</h2>
          <ul className="mt-4 divide-y divide-border">
            <li className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">{t("statusCompleted")}</span>
              <span className="font-medium tabular-nums text-foreground">
                {overview.ordersByStatus.completed}
              </span>
            </li>
            <li className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">{t("statusPending")}</span>
              <span className="font-medium tabular-nums text-foreground">
                {overview.ordersByStatus.pending}
              </span>
            </li>
            <li className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">{t("statusRefunded")}</span>
              <span className="font-medium tabular-nums text-foreground">
                {overview.ordersByStatus.refunded}
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-semibold text-foreground">{t("topProductsTitle")}</h2>
          {overview.topProducts.length > 0 ? (
            <ul className="mt-4 divide-y divide-border">
              {overview.topProducts.map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-foreground">{p.slug}</span>
                  <span className="font-medium tabular-nums text-muted-foreground">
                    {t("ordersCount", { count: p.orders })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("noOrdersYet")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
