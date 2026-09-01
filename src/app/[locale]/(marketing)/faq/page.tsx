import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FAQ } from "@/components/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return { title: t("title") };
}

export default async function FaqPage() {
  const t = await getTranslations("faqPage");
  return <FAQ title={t("title")} id="faq" />;
}
