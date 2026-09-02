import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), alternates: buildAlternates(locale, "/about") };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tBreadcrumb = await getTranslations("breadcrumb");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Breadcrumbs items={[{ label: tBreadcrumb("home"), href: "/" }, { label: t("title") }]} />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>

        <div className="prose-sm mt-8 space-y-6 text-base leading-relaxed text-foreground/90">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </Container>
    </section>
  );
}
