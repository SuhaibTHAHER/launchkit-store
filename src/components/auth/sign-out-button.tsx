"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LogOut, Loader2 } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton() {
  const t = useTranslations("account");
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOutAction(locale))}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
      {t("signOut")}
    </button>
  );
}
