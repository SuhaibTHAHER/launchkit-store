import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllProfiles } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/server";
import { AdminToggle } from "@/components/admin/admin-toggle";
import { noIndex } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "adminUsers" });
  return { title: t("title"), robots: noIndex };
}

export default async function AdminUsersPage() {
  const t = await getTranslations("adminUsers");
  const locale = (await getLocale()) as Locale;
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const profiles = await getAllProfiles();
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">{t("user")}</th>
              <th className="px-4 py-3 text-start font-medium">{t("joined")}</th>
              <th className="px-4 py-3 text-end font-medium">{t("access")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{profile.full_name || profile.email}</p>
                  {profile.full_name && (
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {dateFormatter.format(new Date(profile.created_at))}
                </td>
                <td className="px-4 py-3 text-end">
                  <AdminToggle
                    userId={profile.id}
                    isAdmin={profile.is_admin}
                    disabled={profile.id === currentUser?.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
