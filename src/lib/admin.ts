import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { User } from "@supabase/supabase-js";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

/**
 * Gates access to the admin area. Signed-out visitors are redirected to
 * login; a signed-in non-admin gets a 404 (not a visible "access denied")
 * so /admin's existence isn't revealed to random authenticated users.
 *
 * Called from the admin layout AND independently inside every admin Server
 * Action — never trust the layout gate alone, since Server Actions can be
 * invoked directly.
 */
export async function requireAdmin(): Promise<{ user: User }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = (await getLocale()) as Locale;
    redirect({ href: "/login?next=/admin", locale });
  }

  // redirect() above always throws before this point when user is null —
  // TypeScript's control-flow analysis just can't see across it.
  const { data: profile } = await supabase
    .from("launchkit_profiles")
    .select("is_admin")
    .eq("id", user!.id)
    .single();

  if (!profile?.is_admin) {
    notFound();
  }

  return { user: user! };
}
