"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function markMessageReadAction(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("launchkit_contact_messages").update({ read }).eq("id", id);
  revalidatePath("/[locale]/admin/messages", "page");
}
