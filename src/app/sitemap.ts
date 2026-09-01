import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { posts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

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
