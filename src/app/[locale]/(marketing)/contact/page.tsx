import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), alternates: buildAlternates(locale, "/contact") };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
