"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/auth/password-input";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    setStatus("loading");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/account"), 1500);
  }

  if (status === "done") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-6">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-positive" />
        <div>
          <p className="font-medium text-foreground">{t("passwordUpdatedTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("passwordUpdatedDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PasswordInput name="password" label={t("newPassword")} required minLength={6} autoComplete="new-password" />

      {status === "error" && <p className="text-sm text-negative">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {t("updatePassword")}
      </button>
    </form>
  );
}
