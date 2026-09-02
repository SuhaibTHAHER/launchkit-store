import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";

/**
 * Canonical + hreflang alternates for a route.
 * `path` is locale-agnostic — e.g. "/products", "/products/launchkit-ai", or "" for home.
 */
export function buildAlternates(locale: string, path: string = ""): Metadata["alternates"] {
  const normalizedPath = path === "/" ? "" : path;

  const urlFor = (l: string) => {
    const prefix = l === routing.defaultLocale ? "" : `/${l}`;
    return `${siteUrl}${prefix}${normalizedPath}`;
  };

  const languages: Record<string, string> = { "x-default": urlFor(routing.defaultLocale) };
  for (const l of routing.locales) {
    languages[l] = urlFor(l);
  }

  return {
    canonical: urlFor(locale),
    languages,
  };
}

/** For authenticated-only or auth-flow pages that shouldn't appear in search results. */
export const noIndex: Metadata["robots"] = {
  index: false,
  follow: false,
};
