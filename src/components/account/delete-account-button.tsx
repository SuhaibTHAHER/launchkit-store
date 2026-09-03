"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { deleteAccountAction, type DeleteAccountState } from "@/lib/actions/auth";

export function DeleteAccountButton() {
  const t = useTranslations("settingsPage");
  const locale = useLocale() as Locale;
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [state, formAction, pending] = useActionState<DeleteAccountState, FormData>(
    deleteAccountAction,
    null
  );

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-4 inline-flex items-center gap-2 border border-negative/40 px-4 py-2 text-sm font-semibold text-negative hover:bg-negative/10"
      >
        {t("deleteAccount")}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-4 max-w-sm space-y-3 border border-negative/40 bg-negative/5 p-4">
      <input type="hidden" name="locale" value={locale} />
      <p className="text-sm text-foreground">{t("deleteConfirmPrompt")}</p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        className="w-full border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      {state && "error" in state && <p className="text-sm text-negative">{state.error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={confirmText !== "DELETE" || pending}
          className="inline-flex items-center gap-2 bg-negative px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("deleteConfirmButton")}
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            setConfirmText("");
          }}
          disabled={pending}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
