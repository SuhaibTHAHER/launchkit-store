import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("forgotPasswordTitle") };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("forgotPasswordTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("forgotPasswordSubtitle")}</p>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </Container>
    </section>
  );
}
