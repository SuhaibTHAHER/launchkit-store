"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactAction, type ContactState } from "@/lib/actions/contact";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContactAction,
    null
  );

  const reasons = [
    t("reasonPreSale"),
    t("reasonSupport"),
    t("reasonRefund"),
    t("reasonOther"),
  ];

  if (state && "success" in state) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-6">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-positive" />
        <div>
          <p className="font-medium text-foreground">{t("sent")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("sentDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            {t("name")}
          </span>
          <input
            name="name"
            type="text"
            required
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
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("reason")}
        </span>
        <select
          name="reason"
          defaultValue={reasons[0]}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {t("message")}
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </label>

      {state && "error" in state && <p className="text-sm text-negative">{t("error")}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("send")}
      </button>
    </form>
  );
}
