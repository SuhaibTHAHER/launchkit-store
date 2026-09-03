"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateNotificationPrefAction } from "@/lib/actions/auth";

export function NotificationToggle({
  initialValue,
  label,
}: {
  initialValue: boolean;
  label: string;
}) {
  const [checked, setChecked] = useState(initialValue);
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{label}</span>
      <span className="flex items-center gap-2">
        {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
        <input
          type="checkbox"
          checked={checked}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.checked;
            setChecked(next);
            startTransition(async () => {
              await updateNotificationPrefAction(next);
            });
          }}
          className="size-4"
        />
      </span>
    </label>
  );
}
