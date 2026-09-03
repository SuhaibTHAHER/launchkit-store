import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Transactional email, structured the same way Paddle is: fully wired up
 * in code, inert until a real provider key exists.
 *
 * NOT YET LIVE. To connect it for real:
 *   1. Create a Resend account and verify a sending domain (resend.com).
 *   2. Set RESEND_API_KEY in your environment.
 *   3. Set EMAIL_FROM to an address on your verified domain
 *      (e.g. "Launchkit <orders@yourdomain.com>").
 * Until RESEND_API_KEY is set, every call here just logs and returns —
 * it never throws, so nothing in the purchase flow depends on email
 * actually sending.
 */

type OrderConfirmationInput = {
  userId: string;
  email: string;
  productName: string;
  amount: number;
  currency: string;
};

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info(`Email not sent (RESEND_API_KEY/EMAIL_FROM not configured) — would send "${subject}" to ${to}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`Failed to send email "${subject}" to ${to}:`, await res.text());
    }
  } catch (err) {
    console.error(`Failed to send email "${subject}" to ${to}:`, err);
  }
}

/**
 * Fires on both the demo-purchase action and the (currently inactive)
 * Paddle webhook, so it's already wired to the real purchase flow once
 * Paddle is connected — nothing else needs to change here.
 *
 * Takes the caller's own Supabase client rather than creating one, since
 * the two call sites need different clients: demo-purchase.ts runs in a
 * user's own request (cookie-based client, RLS self-read is enough), while
 * the Paddle webhook has no user session at all (needs the service-role
 * client to read an arbitrary user's profile).
 */
export async function sendOrderConfirmationEmail(
  supabase: SupabaseClient,
  input: OrderConfirmationInput
): Promise<void> {
  const { data: profile } = await supabase
    .from("launchkit_profiles")
    .select("notify_order_updates")
    .eq("id", input.userId)
    .maybeSingle();

  if (profile?.notify_order_updates === false) return;
  if (!input.email) return;

  const amountLabel = `${input.currency} ${input.amount}`;
  await sendEmail(
    input.email,
    `Your Launchkit order — ${input.productName}`,
    `<p>Thanks for your order.</p><p><strong>${input.productName}</strong> — ${amountLabel}</p><p>You can access it any time from <a href="https://launchkit-store.vercel.app/account/products">My Products</a>.</p>`
  );
}
