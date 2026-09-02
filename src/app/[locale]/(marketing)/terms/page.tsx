import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return { title: t("title"), alternates: buildAlternates(locale, "/terms") };
}

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const tBreadcrumb = await getTranslations("breadcrumb");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Breadcrumbs items={[{ label: tBreadcrumb("home"), href: "/" }, { label: t("title") }]} />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>

        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <p>{t("intro")}</p>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("purchasesTitle")}</h2>
            <p className="mt-3">
              {t.rich("purchasesP", {
                licenseLink: (chunks) => (
                  <Link href="/license" className="text-accent underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("refundsTitle")}</h2>
            <p className="mt-3">
              {t.rich("refundsP", {
                faqLink: (chunks) => (
                  <Link href="/faq" className="text-accent underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("warrantyTitle")}</h2>
            <p className="mt-3">{t("warrantyP")}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("changesTitle")}</h2>
            <p className="mt-3">{t("changesP")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
