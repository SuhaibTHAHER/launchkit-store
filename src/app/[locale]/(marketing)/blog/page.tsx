import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { posts } from "@/lib/blog";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("subtitle"), alternates: buildAlternates(locale, "/blog") };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-12 divide-y divide-border border-t border-border">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-8">
              <p className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {pick(post.readingTime, locale)}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {pick(post.title, locale)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pick(post.excerpt, locale)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                {t("readPost")}
                <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
