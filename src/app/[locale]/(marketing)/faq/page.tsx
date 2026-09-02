import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FAQ } from "@/components/faq";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return { title: t("title"), alternates: buildAlternates(locale, "/faq") };
}

export default async function FaqPage() {
  const t = await getTranslations("faqPage");
  const tBreadcrumb = await getTranslations("breadcrumb");
  return (
    <>
      <Container className="max-w-3xl pt-16 sm:pt-24">
        <Breadcrumbs items={[{ label: tBreadcrumb("home"), href: "/" }, { label: t("title") }]} className="mb-0" />
      </Container>
      <FAQ title={t("title")} id="faq" />
    </>
  );
}
