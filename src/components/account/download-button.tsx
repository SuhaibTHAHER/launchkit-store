"use client";

import { useState, useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { getDownloadUrlAction } from "@/lib/actions/downloads";

export function DownloadButton({ productSlug, label }: { productSlug: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await getDownloadUrlAction(productSlug);
            if ("url" in result) {
              window.location.href = result.url;
            } else {
              setError(result.error);
            }
          })
        }
        className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {label}
      </button>
      {error && <span className="text-xs text-negative">{error}</span>}
    </div>
  );
}
