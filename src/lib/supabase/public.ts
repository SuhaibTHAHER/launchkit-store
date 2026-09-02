import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * A cookie-free anon-key client for reading public product data. Product
 * SELECT is open to everyone via RLS, so this doesn't need a session —
 * used by sitemap.ts (statically generated, no request context) and the
 * Paddle webhook (a separate route with no user cookies to read).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
