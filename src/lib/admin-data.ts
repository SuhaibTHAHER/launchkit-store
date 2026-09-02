import { createClient } from "@/lib/supabase/server";

export type AdminOrder = {
  id: string;
  user_id: string;
  product_slug: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "refunded";
  paddle_transaction_id: string | null;
  created_at: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export type AdminOverview = {
  totalUsers: number;
  totalOrders: number;
  realRevenue: number;
  demoRevenue: number;
  ordersByStatus: Record<"pending" | "completed" | "refunded", number>;
  topProducts: { slug: string; orders: number }[];
};

/**
 * These rely on the "admins can view all X" RLS policies added alongside
 * launchkit_is_admin() — the caller must already be confirmed as an admin
 * (via requireAdmin()) before these are called, since RLS is the actual
 * enforcement boundary, not this function.
 */
export async function getAllOrders(): Promise<AdminOrder[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("launchkit_orders")
    .select("id, user_id, product_slug, amount, currency, status, paddle_transaction_id, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllProfiles(): Promise<AdminProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("launchkit_profiles")
    .select("id, email, full_name, is_admin, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [orders, profiles] = await Promise.all([getAllOrders(), getAllProfiles()]);

  const ordersByStatus: AdminOverview["ordersByStatus"] = { pending: 0, completed: 0, refunded: 0 };
  let realRevenue = 0;
  let demoRevenue = 0;
  const countBySlug = new Map<string, number>();

  for (const order of orders) {
    ordersByStatus[order.status] += 1;
    countBySlug.set(order.product_slug, (countBySlug.get(order.product_slug) ?? 0) + 1);
    if (order.status === "completed") {
      // demo-purchase orders have no Paddle transaction — see demo-purchase.ts.
      if (order.paddle_transaction_id) realRevenue += order.amount;
      else demoRevenue += order.amount;
    }
  }

  const topProducts = [...countBySlug.entries()]
    .map(([slug, count]) => ({ slug, orders: count }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  return {
    totalUsers: profiles.length,
    totalOrders: orders.length,
    realRevenue,
    demoRevenue,
    ordersByStatus,
    topProducts,
  };
}
