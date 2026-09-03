"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export type UploadFileState = { error: string } | { success: true } | null;

export async function uploadProductFileAction(
  _prev: UploadFileState,
  formData: FormData
): Promise<UploadFileState> {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim();
  const file = formData.get("file") as File | null;
  if (!slug) return { error: "Missing product slug." };
  if (!file || file.size === 0) return { error: "Choose a .zip file first." };
  if (!file.name.toLowerCase().endsWith(".zip")) return { error: "Only .zip files are accepted." };

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("launchkit-downloads")
    .upload(`${slug}.zip`, file, { upsert: true, contentType: "application/zip" });

  if (error) return { error: error.message };

  revalidatePath("/[locale]/account/downloads", "page");
  return { success: true };
}
