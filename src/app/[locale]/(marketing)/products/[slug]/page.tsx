import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ExternalLink, X, Camera, PackageCheck } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { CheckoutButton } from "@/components/checkout-button";
import { ProductGallery } from "@/components/product-gallery";
import { RelatedProducts } from "@/components/related-products";
import { FAQ } from "@/components/faq";
import { WishlistButton } from "@/components/wishlist-button";
import { getProduct, getRelatedProducts, getProducts } from "@/lib/products";
import { getCategory } from "@/lib/categories";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import { getOwnedProductSlugs, getWishlistSlugs } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";
import { buildAlternates } from "@/lib/seo";

// No generateStaticParams: every page under [locale] is already
// request-rendered (the Navbar reads the session on every request), so a
// build-time DB dependency here would only add fragility for zero benefit —
// and dynamic rendering is what lets an admin edit show up immediately.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.published) return {};
  const name = pick(product.name, locale as Locale);
  const tagline = pick(product.tagline, locale as Locale);
  return {
    title: `${name} — Launchkit`,
    description: tagline,
    alternates: buildAlternates(locale, `/products/${product.slug}`),
    openGraph: {
      title: `${name} — Launchkit`,
      description: tagline,
      type: "website",
      images: [{ url: product.gallery[0].src }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.published) notFound();

  const t = await getTranslations("productDetail");
  const locale = (await getLocale()) as Locale;
  const category = getCategory(product.categorySlug);
  const related = getRelatedProducts(product, await getProducts());
  const latestChangelog = product.changelog[0];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [ownedSlugs, wishlistSlugs] = await Promise.all([
    getOwnedProductSlugs(),
    getWishlistSlugs(),
  ]);
  const owned = ownedSlugs.has(product.slug);
  const wishlisted = wishlistSlugs.has(product.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pick(product.name, locale),
    description: pick(product.description, locale),
    image: product.gallery.map((g) => g.src),
    category: category ? pick(category.name, locale) : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const faqJsonLd =
    product.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faq.map((item) => ({
            "@type": "Question",
            name: pick(item.question, locale),
            acceptedAnswer: {
              "@type": "Answer",
              text: pick(item.answer, locale),
            },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <section className="py-16 sm:py-24">
        <Container>
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/products" className="hover:text-foreground">
              {t("templates")}
            </Link>
            {category && (
              <>
                {" / "}
                <span>{pick(category.name, locale)}</span>
              </>
            )}
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="min-w-0">
              {/* SECTION 1 — Hero */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-2.5 py-1">
                  {t("version", { version: product.version })}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1">
                  {t("lastUpdated", {
                    date: new Date(product.lastUpdated).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  })}
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {pick(product.name, locale)}
                </h1>
                <WishlistButton
                  productSlug={product.slug}
                  initialWishlisted={wishlisted}
                  signedIn={!!user}
                  className="shrink-0"
                />
              </div>
              <p className="mt-3 text-lg text-muted-foreground">{pick(product.tagline, locale)}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {product.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Mobile-only quick actions — desktop uses the sticky aside */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:hidden">
                {owned ? (
                  <Link
                    href="/account/products"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-positive px-6 py-3 text-sm font-semibold text-white sm:flex-1"
                  >
                    <PackageCheck className="size-4" />
                    {t("goToMyProducts")}
                  </Link>
                ) : (
                  <CheckoutButton
                    priceId={product.paddlePriceId}
                    productSlug={product.slug}
                    userId={user?.id ?? null}
                    label={t("buy", { name: pick(product.name, locale) })}
                    className="sm:flex-1"
                  />
                )}
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {t("liveDemo")}
                  <ExternalLink className="size-3.5" />
                </a>
              </div>

              {/* SECTION 2 — Gallery */}
              <div className="mt-8">
                <ProductGallery gallery={product.gallery} />
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Camera className="size-3.5" />
                  {t("realScreenshotNote")}
                </p>
              </div>

              {/* SECTION 3 — What is this product */}
              <p className="mt-10 max-w-2xl text-base leading-relaxed text-foreground/90">
                {pick(product.description, locale)}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-positive/30 bg-positive/5 p-4">
                  <h2 className="text-sm font-semibold text-foreground">{t("whoItsForTitle")}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {pick(product.whoItsFor, locale)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <h2 className="text-sm font-semibold text-foreground">{t("whoItsNotForTitle")}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {pick(product.whoItsNotFor, locale)}
                  </p>
                </div>
              </div>

              {/* SECTION 4 — What's included / not included */}
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t("whatsIncluded")}</h2>
                  <ul className="mt-4 space-y-3">
                    {pick(product.includes, locale).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-positive" />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t("notIncludedTitle")}</h2>
                  <ul className="mt-4 space-y-3">
                    {pick(product.notIncluded, locale).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-semibold text-foreground">{t("whatsInTheBox")}</h2>
                <pre
                  dir="ltr"
                  className="mt-4 overflow-x-auto border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-foreground/90"
                >
                  <code>{product.fileTree}</code>
                </pre>
              </div>

              {/* SECTION 5 — Features */}
              <div className="mt-10">
                <h2 className="text-sm font-semibold text-foreground">{t("features")}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {pick(product.features, locale).map((f) => (
                    <div key={f.title} className="rounded-xl border border-border bg-surface p-4">
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {f.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6 — Pages / Components included */}
              {(product.pagesIncluded || product.componentsIncluded) && (
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  {product.pagesIncluded && (
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">{t("pagesIncludedTitle")}</h2>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {product.pagesIncluded.map((p) => (
                          <li
                            key={p}
                            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.componentsIncluded && (
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {t("componentsIncludedTitle")}
                      </h2>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {product.componentsIncluded.map((c) => (
                          <li
                            key={c}
                            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 7 — Technologies & requirements */}
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t("technologies")}</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {product.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t("requirements")}</h2>
                  <ul className="mt-4 space-y-2">
                    {pick(product.requirements, locale).map((r) => (
                      <li key={r} className="text-sm text-muted-foreground">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SECTION 9 — How it works */}
              <div className="mt-10">
                <h2 className="text-sm font-semibold text-foreground">{t("howItWorksTitle")}</h2>
                <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {product.howItWorks.map((step, i) => (
                    <li key={step.title.en}>
                      <span className="font-mono text-sm text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {pick(step.title, locale)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {pick(step.description, locale)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* SECTION 15 — Changelog */}
              {latestChangelog && (
                <div className="mt-10">
                  <h2 className="text-sm font-semibold text-foreground">{t("changelogTitle")}</h2>
                  <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                    <p className="text-sm font-semibold text-foreground">
                      v{latestChangelog.version} — {latestChangelog.date}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {pick(latestChangelog.notes, locale).map((note) => (
                        <li key={note} className="text-sm text-muted-foreground">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky purchase card — desktop */}
            <aside className="hidden h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24 lg:block">
              <p className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-4xl font-semibold tracking-tight tabular text-foreground">
                  ${product.price}
                </span>
                <span className="text-sm text-muted-foreground">{t("oneTime")}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.rich("singleProjectLicense", {
                  licenseLink: (chunks) => (
                    <Link
                      href="/license"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>

              {owned ? (
                <Link
                  href="/account/products"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-positive px-6 py-3 text-sm font-semibold text-white"
                >
                  <PackageCheck className="size-4" />
                  {t("goToMyProducts")}
                </Link>
              ) : (
                <CheckoutButton
                  priceId={product.paddlePriceId}
                  productSlug={product.slug}
                  userId={user?.id ?? null}
                  label={t("buy", { name: pick(product.name, locale) })}
                  className="mt-6 w-full"
                />
              )}

              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {t("liveDemo")}
                <ExternalLink className="size-3.5" />
              </a>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {t("refundAndSecure")}
              </p>
            </aside>
          </div>
        </Container>
      </section>

      {product.faq.length > 0 && (
        <FAQ
          items={product.faq}
          title={t("productFaq", { name: pick(product.name, locale) })}
          id="product-faq"
        />
      )}

      <RelatedProducts products={related} />
    </>
  );
}
