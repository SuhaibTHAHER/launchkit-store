"use server";

import { createClient } from "@/lib/supabase/server";

export type DownloadUrlResult = { url: string } | { error: string };

/**
 * Generates a short-lived signed URL for a product's uploaded zip. RLS on
 * storage.objects (see the launchkit_real_account_features migration)
 * already restricts this to files the signed-in user actually owns, so
 * there's no separate ownership check here — a wrong/missing file just
 * comes back as an error either way.
 */
export async function getDownloadUrlAction(productSlug: string): Promise<DownloadUrlResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const { data, error } = await supabase.storage
    .from("launchkit-downloads")
    .createSignedUrl(`${productSlug}.zip`, 60);

  if (error || !data) return { error: "not_available" };
  return { url: data.signedUrl };
}
