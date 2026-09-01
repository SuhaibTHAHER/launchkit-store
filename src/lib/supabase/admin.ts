import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server contexts only (webhooks, background
 * jobs) — bypasses Row Level Security entirely. Never import this from a
 * page, a Client Component, or anything reachable from the browser.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Project Settings
 * → API → service_role secret). Returns null if it isn't configured yet,
 * so callers can fail loudly instead of silently pretending to succeed.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
