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
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), alternates: buildAlternates(locale, "/privacy") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
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
            <h2 className="text-base font-semibold text-foreground">{t("checkoutTitle")}</h2>
            <p className="mt-3">{t("checkoutP")}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("accountTitle")}</h2>
            <p className="mt-3">{t("accountP")}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              {t("contactFormTitle")}
            </h2>
            <p className="mt-3">{t("contactFormP")}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("analyticsTitle")}</h2>
            <p className="mt-3">{t("analyticsP")}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("contactTitle")}</h2>
            <p className="mt-3">
              {t.rich("contactP", {
                contactLink: (chunks) => (
                  <Link href="/contact" className="text-accent underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
