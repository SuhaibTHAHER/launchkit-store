import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("launchkit_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <AdminShell fullName={profile?.full_name ?? ""} email={user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
