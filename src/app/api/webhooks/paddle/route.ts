import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { products } from "@/lib/products";

/**
 * Paddle Billing webhook — grants product ownership after a *server-verified*
 * payment. This is the only code path allowed to write to
 * launchkit_orders / launchkit_product_ownership.
 *
 * NOT YET LIVE. To connect it for real:
 *   1. Set PADDLE_WEBHOOK_SECRET (Paddle Dashboard → Developer Tools → Notifications
 *      → your webhook destination → the signing secret, starts with "pdl_ntfset_").
 *   2. Set SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Project Settings → API).
 *   3. In Paddle Dashboard, add a webhook destination pointing at
 *      https://<your-domain>/api/webhooks/paddle, subscribed to "transaction.completed".
 *   4. In CheckoutButton, Paddle.Checkout.open() must pass
 *      customData: { user_id: <signed-in user's id> } — already wired up
 *      (see src/components/checkout-button.tsx) — so this handler knows
 *      which account to grant ownership to.
 * Until all four are done, this endpoint will reject every request rather
 * than silently pretending a payment succeeded.
 */

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(";").map((part) => part.split("=") as [string, string])
  );
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const expected = createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(h1, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  const admin = createAdminClient();

  if (!webhookSecret || !admin) {
    console.error(
      "Paddle webhook received but not configured — set PADDLE_WEBHOOK_SECRET and SUPABASE_SERVICE_ROLE_KEY."
    );
    return NextResponse.json(
      { error: "Webhook not configured on this deployment yet." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!verifySignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event_type !== "transaction.completed") {
    // Acknowledge everything else so Paddle doesn't retry — we just don't act on it.
    return NextResponse.json({ received: true });
  }

  const transaction = event.data;
  const userId: string | undefined = transaction.custom_data?.user_id;
  const transactionId: string = transaction.id;
  const currency: string = transaction.currency_code ?? "USD";

  if (!userId) {
    console.error(`Paddle transaction ${transactionId} has no custom_data.user_id — cannot grant ownership.`);
    return NextResponse.json({ error: "Missing user reference." }, { status: 400 });
  }

  const items: Array<{ price: { id: string; unit_price: { amount: string } } }> = transaction.items ?? [];

  for (const item of items) {
    const product = products.find((p) => p.paddlePriceId === item.price.id);
    if (!product) {
      console.error(`No product matches Paddle price ${item.price.id} — skipping line item.`);
      continue;
    }

    const amount = Number(item.price.unit_price.amount) / 100;

    const { data: order, error: orderError } = await admin
      .from("launchkit_orders")
      .insert({
        user_id: userId,
        product_slug: product.slug,
        amount,
        currency,
        status: "completed",
        paddle_transaction_id: transactionId,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error(`Failed to record order for ${product.slug}:`, orderError.message);
      continue;
    }

    const { error: ownershipError } = await admin.from("launchkit_product_ownership").upsert(
      {
        user_id: userId,
        product_slug: product.slug,
        order_id: order.id,
      },
      { onConflict: "user_id,product_slug" }
    );

    if (ownershipError) {
      console.error(`Failed to grant ownership of ${product.slug}:`, ownershipError.message);
    }
  }

  return NextResponse.json({ received: true });
}
