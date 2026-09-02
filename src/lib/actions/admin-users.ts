"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export type SetAdminState = { error: string } | { success: true } | null;

/**
 * Grants or revokes admin on another account. The actual authorization and
 * self-demotion lockout both live in the launchkit_set_admin() SQL function
 * (SECURITY DEFINER) — this action re-checks requireAdmin() too, but the
 * database is the real enforcement boundary, not this function.
 */
export async function setAdminAction(
  _prevState: SetAdminState,
  formData: FormData
): Promise<SetAdminState> {
  await requireAdmin();

  const targetUserId = String(formData.get("userId") ?? "");
  const makeAdmin = formData.get("makeAdmin") === "true";
  if (!targetUserId) return { error: "Missing user id." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("launchkit_set_admin", {
    target_user: targetUserId,
    make_admin: makeAdmin,
  });

  if (error) return { error: error.message };

  revalidatePath("/[locale]/admin/users", "page");
  return { success: true };
}
