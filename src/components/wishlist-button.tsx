"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toggleWishlistAction } from "@/lib/actions/wishlist";

export function WishlistButton({
  productSlug,
  initialWishlisted,
  signedIn,
  className = "",
}: {
  productSlug: string;
  initialWishlisted: boolean;
  signedIn: boolean;
  className?: string;
}) {
  const t = useTranslations("wishlist");
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!signedIn) {
      router.push(`/login?next=/products/${productSlug}`);
      return;
    }

    const next = !wishlisted;
    setWishlisted(next);
    startTransition(async () => {
      const result = await toggleWishlistAction(productSlug, wishlisted);
      if (result?.error) setWishlisted(!next);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? t("remove") : t("add")}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 transition-colors hover:bg-muted disabled:opacity-60 ${className}`}
    >
      <Heart className={`size-4 ${wishlisted ? "fill-negative text-negative" : ""}`} />
    </button>
  );
}
