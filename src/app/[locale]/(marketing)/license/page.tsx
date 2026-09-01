import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "license" });
  return { title: t("title") };
}

export default async function LicensePage() {
  const t = await getTranslations("license");

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>

        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <p>
            {t.rich("intro", {
              singleProject: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
            })}
          </p>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("youMayTitle")}</h2>
            <ul className="mt-3 list-disc space-y-2 ps-5">
              <li>{t("youMay1")}</li>
              <li>{t("youMay2")}</li>
              <li>{t("youMay3")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("youMayNotTitle")}</h2>
            <ul className="mt-3 list-disc space-y-2 ps-5">
              <li>{t("youMayNot1")}</li>
              <li>{t("youMayNot2")}</li>
              <li>{t("youMayNot3")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("extendedTitle")}</h2>
            <p className="mt-3">{t("extendedP")}</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">{t("refundsTitle")}</h2>
            <p className="mt-3">{t("refundsP")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
