"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactState = { error: string } | { success: true } | null;

export async function submitContactAction(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !reason || !message) {
    return { error: "Please fill in every field." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("launchkit_contact_messages").insert({
    name,
    email,
    reason,
    message,
    user_id: user?.id ?? null,
  });

  if (error) return { error: error.message };
  return { success: true };
}
