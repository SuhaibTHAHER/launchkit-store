"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { setAdminAction, type SetAdminState } from "@/lib/actions/admin-users";

export function AdminToggle({
  userId,
  isAdmin,
  disabled,
}: {
  userId: string;
  isAdmin: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations("adminUsers");
  const [state, formAction, pending] = useActionState<SetAdminState, FormData>(setAdminAction, null);

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="makeAdmin" value={(!isAdmin).toString()} />
      <button
        type="submit"
        disabled={disabled || pending}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isAdmin
            ? "border-negative/40 text-negative hover:bg-negative/10"
            : "border-border text-foreground hover:bg-muted"
        }`}
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : isAdmin ? (
          <ShieldOff className="size-3.5" />
        ) : (
          <ShieldCheck className="size-3.5" />
        )}
        {isAdmin ? t("revokeAdmin") : t("grantAdmin")}
      </button>
      {state && "error" in state && <span className="text-xs text-negative">{state.error}</span>}
    </form>
  );
}
