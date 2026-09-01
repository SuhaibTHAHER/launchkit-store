"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function PasswordInput({
  name,
  label,
  required,
  minLength,
  autoComplete,
  forgotPasswordHref,
}: {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  forgotPasswordHref?: string;
}) {
  const t = useTranslations("auth");
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {forgotPasswordHref && (
          <Link href={forgotPasswordHref} className="text-xs text-accent hover:underline">
            {t("forgotPassword")}
          </Link>
        )}
      </span>
      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 pe-10 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}
