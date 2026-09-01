"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type WishlistState = { error: string } | null;

export async function toggleWishlistAction(
  productSlug: string,
  currentlyWishlisted: boolean
): Promise<WishlistState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sign in to save products." };

  if (currentlyWishlisted) {
    const { error } = await supabase
      .from("launchkit_wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_slug", productSlug);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("launchkit_wishlist")
      .insert({ user_id: user.id, product_slug: productSlug });
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return null;
}
