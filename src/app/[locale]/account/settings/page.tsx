import type { Metadata } from "next";
import { CreditCard, KeyRound, Bell, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProfileForm } from "@/components/auth/profile-form";
import { createClient } from "@/lib/supabase/server";
import { noIndex } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settingsPage" });
  return { title: t("title"), robots: noIndex };
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("launchkit_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const t = await getTranslations("settingsPage");
  const tAccount = await getTranslations("account");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-8 border border-border bg-surface p-6">
        <h2 className="label text-xs text-foreground">{tAccount("profileTitle")}</h2>
        <div className="mt-4">
          <ProfileForm email={user.email ?? ""} fullName={profile?.full_name ?? ""} />
        </div>
      </div>

      <div className="mt-6 border border-border bg-surface p-6">
        <h2 className="label text-xs text-foreground">{tAccount("billingTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{tAccount("billingDesc")}</p>
        <button
          type="button"
          disabled
          title={tAccount("billingNotReady")}
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 border border-border px-4 py-2 text-sm font-semibold text-muted-foreground opacity-60"
        >
          <CreditCard className="size-4" />
          {tAccount("managePayment")}
        </button>
        <p className="mt-2 text-xs text-muted-foreground">{tAccount("billingNotReady")}</p>
      </div>

      <div className="mt-6 border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          <h2 className="label text-xs text-foreground">{t("securityTitle")}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{t("securityDesc")}</p>
      </div>

      <div className="mt-6 border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-muted-foreground" />
          <h2 className="label text-xs text-foreground">{t("notificationsTitle")}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{t("notificationsDesc")}</p>
      </div>

      <div className="mt-6 border border-negative/30 bg-negative/5 p-6">
        <div className="flex items-center gap-2">
          <TriangleAlert className="size-4 text-negative" />
          <h2 className="label text-xs text-negative">{t("dangerZoneTitle")}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{t("dangerZoneDesc")}</p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 border border-negative/40 px-4 py-2 text-sm font-semibold text-negative hover:bg-negative/10"
        >
          {t("contactSupport")}
        </Link>
      </div>
    </div>
  );
}
