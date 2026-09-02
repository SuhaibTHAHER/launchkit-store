import { Boxes, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="flex min-h-screen items-center py-16">
      <Container className="max-w-lg text-center">
        <Link
          href="/"
          className="font-display mx-auto mb-10 flex w-fit items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center bg-accent text-accent-foreground">
            <Boxes className="size-4" />
          </span>
          Launchkit
        </Link>

        <p className="label text-sm text-accent">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("description")}</p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {t("backHome")}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </Container>
    </section>
  );
}
