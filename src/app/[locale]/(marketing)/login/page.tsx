import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { SignInForm } from "@/components/auth/sign-in-form";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";
import { safeNextPath } from "@/lib/safe-redirect";
import { noIndex } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signInTitle"), robots: noIndex };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = (await getLocale()) as Locale;
  if (user) redirect({ href: nextPath ?? "/account", locale });

  const t = await getTranslations("auth");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("signInTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("signInSubtitle")}</p>

        <div className="mt-8">
          <SignInForm next={nextPath} />
        </div>
      </Container>
    </section>
  );
}
