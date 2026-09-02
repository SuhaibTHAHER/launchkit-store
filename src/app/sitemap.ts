import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { posts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

const staticPaths = [
  "",
  "/products",
  "/about",
  "/faq",
  "/contact",
  "/docs",
  "/blog",
  "/license",
  "/privacy",
  "/terms",
];

/** English (the default locale) has no prefix; Arabic is served under /ar. */
function localizedUrl(path: string, locale: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteUrl}${prefix}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // A DB hiccup here should degrade the sitemap, not fail the whole build/route.
  const products = await getProducts().catch(() => []);

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({ url: localizedUrl(path, locale), lastModified: new Date() });
    }
    for (const p of products) {
      entries.push({
        url: localizedUrl(`/products/${p.slug}`, locale),
        lastModified: new Date(p.createdAt),
      });
    }
    for (const p of posts) {
      entries.push({
        url: localizedUrl(`/blog/${p.slug}`, locale),
        lastModified: new Date(p.publishedAt),
      });
    }
  }

  return entries;
}
