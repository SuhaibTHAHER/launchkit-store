import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOrders } from "@/lib/commerce";
import type { Locale } from "@/i18n/routing";
import { noIndex } from "@/lib/seo";
import { StatusStamp } from "@/components/account/status-stamp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ordersPage" });
  return { title: t("title"), robots: noIndex };
}

export default async function OrdersPage() {
  const locale = (await getLocale()) as Locale;
  const orders = await getOrders();
  const t = await getTranslations("ordersPage");
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const statusLabel = (status: string) =>
    status === "completed" ? t("statusCompleted") : status === "refunded" ? t("statusRefunded") : t("statusPending");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {orders.length === 0 ? (
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
        <div className="mt-8 overflow-x-auto border border-border bg-surface">
          <table className="w-full min-w-[560px] text-start text-sm">
            <thead>
              <tr className="label border-b border-border text-start text-[11px] text-muted-foreground">
                <th className="px-4 py-3 text-start">{t("product")}</th>
                <th className="px-4 py-3 text-start">{t("date")}</th>
                <th className="px-4 py-3 text-start">{t("amount")}</th>
                <th className="px-4 py-3 text-start">{t("status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{order.product_slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dateFormatter.format(new Date(order.created_at))}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {order.currency} {order.amount}
                  </td>
                  <td className="px-4 py-3">
                    <StatusStamp status={order.status}>{statusLabel(order.status)}</StatusStamp>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
