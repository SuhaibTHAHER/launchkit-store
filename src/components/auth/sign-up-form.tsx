"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { signUpAction, type SignUpState } from "@/lib/actions/auth";

export function SignUpForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<SignUpState, FormData>(
    signUpAction,
    null
  );

  if (state && "confirmEmail" in state) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-6">
        <MailCheck className="mt-0.5 size-5 shrink-0 text-accent" />
        <div>
          <p className="font-medium text-foreground">{t("confirmEmailTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("confirmEmailDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {next && <input type="hidden" name="next" value={next} />}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("fullName")}
        </span>
        <input
          name="fullName"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("email")}
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("password")}
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </label>

      {state?.error && <p className="text-sm text-negative">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("signUp")}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {t.rich("haveAccount", {
          link: (chunks) => (
            <Link
              href={next ? { pathname: "/login", query: { next } } : "/login"}
              className="text-accent underline underline-offset-2"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
