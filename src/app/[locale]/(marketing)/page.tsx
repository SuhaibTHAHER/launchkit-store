import { ArrowRight, Check, Code2, Palette, ShieldCheck } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";
import { categories } from "@/lib/categories";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import { getWishlistSlugs } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as Locale;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const wishlistSlugs = await getWishlistSlugs();

  const reasons = [
    { icon: Code2, title: t("reason1Title"), description: t("reason1Desc") },
    { icon: Palette, title: t("reason2Title"), description: t("reason2Desc") },
    { icon: ShieldCheck, title: t("reason3Title"), description: t("reason3Desc") },
  ];

  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 flex justify-center blur-3xl"
        >
          <div className="aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-accent/40 to-accent/5 opacity-30 dark:opacity-20" />
        </div>

        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" />
              {t("eyebrow")}
            </p>
            <h1 className="balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t("browseTemplates")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/products/launchkit-complete"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {t("seeBundle")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/40 py-12">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {reasons.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("categoriesHeading")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("categoriesSub")}</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={{ pathname: "/products", query: { category: category.slug } }}
                className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <category.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground">
                  {pick(category.name, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pick(category.description, locale)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {t("browse")}
                  <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("featuredHeading")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("featuredSub")}</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.featured)
              .map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  wishlisted={wishlistSlugs.has(product.slug)}
                  signedIn={!!user}
                />
              ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-16 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center blur-3xl"
            >
              <div className="aspect-[1155/678] w-[40rem] bg-gradient-to-tr from-accent/30 to-accent/5 opacity-40 dark:opacity-25" />
            </div>
            <h2 className="balance mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("bundleHeading")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("bundleSub")}</p>
            <Link
              href="/products/launchkit-complete"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Check className="size-4" />
              {t("viewBundle")}
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              {t.rich("stillHaveQuestions", {
                faqLink: (chunks) => (
                  <Link href="/faq" className="text-accent underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
