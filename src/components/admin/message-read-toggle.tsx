"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { markMessageReadAction } from "@/lib/actions/admin-messages";

export function MessageReadToggle({ id, read }: { id: string; read: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markMessageReadAction(id, !read);
          router.refresh();
        })
      }
      className={`label border px-2.5 py-1 text-[10px] transition-colors disabled:opacity-60 ${
        read
          ? "border-border text-muted-foreground hover:bg-muted"
          : "border-accent bg-accent text-accent-foreground"
      }`}
    >
      {read ? "Read" : "Mark read"}
    </button>
  );
}
