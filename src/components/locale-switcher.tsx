"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Languages } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const nextLocale = locale === "en" ? "ar" : "en";

  return (
    <button
      type="button"
      onClick={() =>
        router.replace(
          // @ts-expect-error -- params comes from useParams and matches the current route
          { pathname, params },
          { locale: nextLocale }
        )
      }
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={nextLocale === "ar" ? "التبديل للعربية" : "Switch to English"}
    >
      <Languages className="size-4" />
      {nextLocale === "ar" ? "عربي" : "EN"}
    </button>
  );
}
