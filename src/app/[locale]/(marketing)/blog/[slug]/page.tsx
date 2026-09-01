import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { getPost, posts } from "@/lib/blog";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = pick(post.title, locale as Locale);
  const description = pick(post.excerpt, locale as Locale);
  return {
    title: `${title} — Launchkit Blog`,
    description,
    openGraph: { title, description, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
          {t("backToBlog")}
        </Link>

        <p className="mt-6 text-xs text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {pick(post.readingTime, locale)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {pick(post.title, locale)}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose-sm mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
          {pick(post.content, locale).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </article>
  );
}
