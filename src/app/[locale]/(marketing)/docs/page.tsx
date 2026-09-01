import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function DocsPage() {
  const t = await getTranslations("docs");

  const sections = [
    { id: "getting-started", label: t("gettingStarted") },
    { id: "installation", label: t("installation") },
    { id: "customization", label: t("customization") },
    { id: "faq", label: t("faq") },
    { id: "license", label: t("license") },
    { id: "support", label: t("support") },
  ];

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav className="h-fit lg:sticky lg:top-24" aria-label="Documentation sections">
            <p className="text-sm font-semibold text-foreground">{t("nav")}</p>
            <ul className="mt-4 space-y-1 border-s border-border">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block border-s-2 border-transparent py-1.5 ps-4 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl space-y-16">
            <header>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
            </header>

            <section id="getting-started" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">
                {t("gettingStarted")}
              </h2>
              <div className="prose-sm mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
                <p>{t("gettingStartedP1")}</p>
                <p>{t("gettingStartedP2")}</p>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">
                {t("installation")}
              </h2>
              <div className="prose-sm mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
                <p>{t("installationP1")}</p>
                <pre dir="ltr" className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
                  <code>{`npm install\nnpm run dev`}</code>
                </pre>
                <p>{t("installationP2")}</p>
                <pre dir="ltr" className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
                  <code>{`npm run build\nnpm start`}</code>
                </pre>
              </div>
            </section>

            <section id="customization" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">
                {t("customization")}
              </h2>
              <div className="prose-sm mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
                <p>{t("customizationP1")}</p>
                <p>{t("customizationP2")}</p>
              </div>
            </section>

            <section id="faq" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">{t("faq")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                {t.rich("faqP1", {
                  faqLink: (chunks) => (
                    <Link href="/faq" className="text-accent underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </section>

            <section id="license" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">{t("license")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                {t.rich("licenseP1", {
                  licenseLink: (chunks) => (
                    <Link href="/license" className="text-accent underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </section>

            <section id="support" className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">{t("support")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                {t.rich("supportP1", {
                  contactLink: (chunks) => (
                    <Link href="/contact" className="text-accent underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
