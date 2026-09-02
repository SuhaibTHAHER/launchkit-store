"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Check } from "lucide-react";
import { updateProfileAction, type ProfileState } from "@/lib/actions/auth";

export function ProfileForm({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const t = useTranslations("account");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateProfileAction,
    null
  );

  return (
    <form action={formAction} className="grid max-w-lg gap-4">
      <input type="hidden" name="locale" value={locale} />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("fullName")}
        </span>
        <input
          name="fullName"
          type="text"
          defaultValue={fullName}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("email")}
        </span>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-dashed border-border bg-surface px-3 py-2 text-sm text-muted-foreground opacity-70"
        />
      </label>

      {state && "error" in state && <p className="text-sm text-negative">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("save")}
        </button>
        {!pending && state && "success" in state && (
          <span className="inline-flex items-center gap-1 text-sm text-positive">
            <Check className="size-4" />
            {t("saved")}
          </span>
        )}
      </div>
    </form>
  );
}
