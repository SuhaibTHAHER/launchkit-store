"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Check } from "lucide-react";
import { changePasswordAction, type PasswordState } from "@/lib/actions/auth";
import { PasswordInput } from "@/components/auth/password-input";

export function ChangePasswordForm() {
  const t = useTranslations("settingsPage");
  const tAuth = useTranslations("auth");
  const [state, formAction, pending] = useActionState<PasswordState, FormData>(
    changePasswordAction,
    null
  );

  return (
    <form action={formAction} className="grid max-w-sm gap-4">
      <PasswordInput
        name="newPassword"
        label={tAuth("newPassword")}
        required
        minLength={8}
        autoComplete="new-password"
      />
      <PasswordInput
        name="confirmPassword"
        label={t("confirmNewPassword")}
        required
        minLength={8}
        autoComplete="new-password"
      />

      {state && "error" in state && <p className="text-sm text-negative">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("updatePassword")}
        </button>
        {!pending && state && "success" in state && (
          <span className="inline-flex items-center gap-1 text-sm text-positive">
            <Check className="size-4" />
            {t("passwordUpdated")}
          </span>
        )}
      </div>
    </form>
  );
}
