import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllOrders, getAllProfiles } from "@/lib/admin-data";
import { noIndex } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "adminOrders" });
  return { title: t("title"), robots: noIndex };
}

export default async function AdminOrdersPage() {
  const t = await getTranslations("adminOrders");
  const locale = (await getLocale()) as Locale;
  const [orders, profiles] = await Promise.all([getAllOrders(), getAllProfiles()]);
  const emailByUserId = new Map(profiles.map((p) => [p.id, p.email]));
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });

  const statusLabel = (status: string) =>
    status === "completed"
      ? t("statusCompleted")
      : status === "refunded"
        ? t("statusRefunded")
        : t("statusPending");

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-4 py-3 text-start font-medium">{t("customer")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("product")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("amount")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("status")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("source")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-foreground">
                    {emailByUserId.get(order.user_id) ?? order.user_id}
                  </td>
                  <td className="px-4 py-3 text-foreground">{order.product_slug}</td>
                  <td className="px-4 py-3 tabular-nums text-foreground">
                    {order.currency} {order.amount}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{statusLabel(order.status)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.paddle_transaction_id ? t("sourcePaddle") : t("sourceDemo")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dateFormatter.format(new Date(order.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
