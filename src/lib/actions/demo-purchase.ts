"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProduct } from "@/lib/products";

export type DemoPurchaseState = { error: string } | { success: true } | null;

/**
 * Records a real order + grants real ownership for the signed-in user —
 * no fake data, no client-trusted price. The only thing "demo" about this
 * is that no money moves, because Paddle isn't connected yet. Once it is,
 * src/app/api/webhooks/paddle/route.ts takes over this exact same job and
 * this action (and the RLS policies it relies on) should be removed.
 */
export async function demoPurchaseAction(productSlug: string): Promise<DemoPurchaseState> {
  const product = await getProduct(productSlug);
  if (!product) return { error: "Unknown product." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const { data: order, error: orderError } = await supabase
    .from("launchkit_orders")
    .insert({
      user_id: user.id,
      product_slug: product.slug,
      amount: product.price,
      currency: "USD",
      status: "completed",
    })
    .select("id")
    .single();

  if (orderError) return { error: orderError.message };

  const { error: ownershipError } = await supabase.from("launchkit_product_ownership").upsert(
    { user_id: user.id, product_slug: product.slug, order_id: order.id },
    { onConflict: "user_id,product_slug" }
  );

  if (ownershipError) return { error: ownershipError.message };

  revalidatePath("/", "layout");
  return { success: true };
}
