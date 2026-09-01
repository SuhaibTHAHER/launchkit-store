"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/categories";
import { pick } from "@/lib/localized";
import type { Product } from "@/lib/products";
import type { Locale } from "@/i18n/routing";

type SortKey = "newest" | "popular" | "price-asc" | "price-desc";

export function ProductBrowser({
  products,
  initialCategory = "all",
  wishlistedSlugs = [],
  signedIn = false,
}: {
  products: Product[];
  initialCategory?: string;
  wishlistedSlugs?: string[];
  signedIn?: boolean;
}) {
  const t = useTranslations("products");
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<SortKey>("popular");

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "newest", label: t("sortNewest") },
    { value: "popular", label: t("sortPopular") },
    { value: "price-asc", label: t("sortPriceAsc") },
    { value: "price-desc", label: t("sortPriceDesc") },
  ];

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const haystack = [
        pick(p.name, locale),
        pick(p.tagline, locale),
        ...p.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        query.trim() === "" || haystack.includes(query.trim().toLowerCase());
      const matchesCategory = category === "all" || p.categorySlug === category;
      return matchesQuery && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.createdAt.localeCompare(a.createdAt);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "popular":
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });

    return list;
  }, [products, query, category, sort, locale]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">{t("searchPlaceholder")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border border-border bg-surface py-2.5 ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("sortBy")}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            category === "all"
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("all")}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              category === c.slug
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {pick(c.name, locale)}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length === 1
          ? t("templateCountOne", { count: filtered.length })
          : t("templateCountOther", { count: filtered.length })}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              wishlisted={wishlistedSlugs.includes(product.slug)}
              signedIn={signedIn}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          {t("noResults", { query })}
        </div>
      )}
    </div>
  );
}
