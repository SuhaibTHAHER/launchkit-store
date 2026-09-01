import { createClient } from "@/lib/supabase/server";

export type Order = {
  id: string;
  product_slug: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "refunded";
  created_at: string;
};

export type OwnedProduct = {
  product_slug: string;
  granted_at: string;
};

/** The signed-in user's owned product slugs, or an empty set if signed out. */
export async function getOwnedProductSlugs(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("launchkit_product_ownership")
    .select("product_slug")
    .eq("user_id", user.id);

  return new Set((data ?? []).map((row) => row.product_slug));
}

export async function getOwnedProducts(): Promise<OwnedProduct[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("launchkit_product_ownership")
    .select("product_slug, granted_at")
    .eq("user_id", user.id)
    .order("granted_at", { ascending: false });

  return data ?? [];
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("launchkit_orders")
    .select("id, product_slug, amount, currency, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getWishlistSlugs(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("launchkit_wishlist")
    .select("product_slug")
    .eq("user_id", user.id);

  return new Set((data ?? []).map((row) => row.product_slug));
}
