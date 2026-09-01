"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const t = useTranslations("accountNav");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
        aria-label={t("openMenu")}
      >
        <Menu className="size-4" />
      </button>
      <div className="ml-auto flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
