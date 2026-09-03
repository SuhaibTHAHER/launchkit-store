import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOrder } from "@/lib/commerce";
import { getAllProducts, productSku } from "@/lib/products";
import { pick } from "@/lib/localized";
import { StatusStamp } from "@/components/account/status-stamp";
import { noIndex } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orderDetail" });
  return { title: t("title"), robots: noIndex };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("orderDetail");
  const tOrders = await getTranslations("ordersPage");
  const products = await getAllProducts();
  const product = products.find((p) => p.slug === order.product_slug);

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" });
  const statusLabel =
    order.status === "completed"
      ? tOrders("statusCompleted")
      : order.status === "refunded"
        ? tOrders("statusRefunded")
        : tOrders("statusPending");

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
        {t("backToOrders")}
      </Link>

      <div className="mt-6 border-b border-border pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("title")}
            </h1>
            <p className="label mt-2 text-xs text-muted-foreground">{order.id}</p>
          </div>
          <StatusStamp status={order.status}>{statusLabel}</StatusStamp>
        </div>
      </div>

      <div className="mt-6 border border-border bg-surface p-6">
        <div className="flex items-start gap-4">
          {product && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="label text-[11px] text-muted-foreground">
                  {productSku(product.slug)}
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {pick(product.name, locale)}
              </p>
              <Link
                href={`/products/${product.slug}`}
                className="mt-1 inline-block text-sm text-accent hover:underline"
              >
                {t("viewProduct")}
              </Link>
            </div>
          )}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
          <div>
            <dt className="label text-[11px] text-muted-foreground">{tOrders("date")}</dt>
            <dd className="mt-1 text-foreground">{dateFormatter.format(new Date(order.created_at))}</dd>
          </div>
          <div>
            <dt className="label text-[11px] text-muted-foreground">{tOrders("amount")}</dt>
            <dd className="mt-1 tabular-nums text-foreground">
              {order.currency} {order.amount}
            </dd>
          </div>
        </dl>

        {order.status === "completed" && product && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
            <Link
              href="/account/downloads"
              className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              {t("goToDownloads")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
