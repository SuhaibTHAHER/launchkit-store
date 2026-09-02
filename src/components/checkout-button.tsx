"use client";

import { useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { demoPurchaseAction } from "@/lib/actions/demo-purchase";

let paddleInstance: Paddle | undefined;

async function getPaddle(): Promise<Paddle | undefined> {
  if (paddleInstance) return paddleInstance;

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) return undefined;

  paddleInstance = await initializePaddle({
    token,
    environment:
      (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ??
      "sandbox",
  });

  return paddleInstance;
}

export function CheckoutButton({
  priceId,
  productSlug,
  userId,
  label = "Buy now",
  className = "",
}: {
  priceId: string;
  /** Used to send the buyer back to this exact product after signing in. */
  productSlug: string;
  /** null when signed out — checkout requires an account so ownership has
   *  somewhere to attach once the Paddle webhook confirms payment. */
  userId: string | null;
  label?: string;
  className?: string;
}) {
  const t = useTranslations("productDetail");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!userId) {
      router.push(`/login?next=/products/${productSlug}`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const paddle = await getPaddle();
      if (paddle) {
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customData: { user_id: userId },
        });
        return;
      }

      // Paddle isn't connected yet — fall back to a demo purchase so the
      // buy flow is genuinely clickable. Still writes a real order and
      // real ownership row for this account, just with no money moving.
      const result = await demoPurchaseAction(productSlug);
      if (result && "error" in result) {
        setError(result.error);
        return;
      }
      router.push("/account/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4 rtl:rotate-180" />
        )}
        {label}
      </button>
      {error && <p className="mt-2 text-xs text-negative">{error}</p>}
      {!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && (
        <p className="mt-2 text-xs text-muted-foreground">{t("demoCheckoutNote")}</p>
      )}
    </div>
  );
}
