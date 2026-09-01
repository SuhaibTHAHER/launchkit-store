"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { Moon, Sun } from "lucide-react";

const labels = {
  en: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
  ar: { toLight: "التبديل للوضع الفاتح", toDark: "التبديل للوضع الداكن" },
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const locale = useLocale() as keyof typeof labels;
  const [mounted, setMounted] = useState(false);

  // Flips once after hydration so the button matches the client theme, not the SSR guess.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-9 rounded-full" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={isDark ? labels[locale].toLight : labels[locale].toDark}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
