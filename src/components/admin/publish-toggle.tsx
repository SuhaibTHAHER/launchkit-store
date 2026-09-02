"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { togglePublishedAction } from "@/lib/actions/admin-products";

export function PublishToggle({ slug, published }: { slug: string; published: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await togglePublishedAction(slug, !published);
          router.refresh();
        })
      }
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-60 ${
        published
          ? "border-positive/40 text-positive hover:bg-positive/10"
          : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      {published ? "Published" : "Draft"}
    </button>
  );
}
