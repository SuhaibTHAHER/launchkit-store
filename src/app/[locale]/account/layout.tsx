import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountShell } from "@/components/account/account-shell";
import type { Locale } from "@/i18n/routing";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = (await getLocale()) as Locale;

  if (!user) {
    redirect({ href: "/login?next=/account", locale });
    return null;
  }

  const { data: profile } = await supabase
    .from("launchkit_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <AccountShell fullName={profile?.full_name ?? ""} email={user.email ?? ""}>
      {children}
    </AccountShell>
  );
}
