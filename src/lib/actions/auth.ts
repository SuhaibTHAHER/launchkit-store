"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { safeNextPath } from "@/lib/safe-redirect";

export type AuthState = { error: string } | null;
export type SignUpState = { error: string } | { confirmEmail: true } | null;
export type ProfileState = { error: string } | { success: true } | null;
export type PasswordState = { error: string } | { success: true } | null;
export type DeleteAccountState = { error: string } | null;

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const locale = String(formData.get("locale") ?? "en") as Locale;
  const next = safeNextPath(formData.get("next")?.toString());

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { error: error.message };

  // No session yet means the project requires email confirmation before
  // sign-in — there's nothing more this request can do until they click
  // the link Supabase just emailed them.
  if (!data.session) return { confirmEmail: true };

  redirect({ href: next ?? "/account", locale });
  return null;
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? "en") as Locale;
  const next = safeNextPath(formData.get("next")?.toString());

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect({ href: next ?? "/account", locale });
  return null;
}

export async function signOutAction(locale: Locale) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: "/", locale });
}

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const fullName = String(formData.get("fullName") ?? "");
  const locale = String(formData.get("locale") ?? "en");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("launchkit_profiles")
    .update({ full_name: fullName, locale, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}

export async function changePasswordAction(
  _prevState: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { error: "Passwords don't match." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { success: true };
}

export async function updateNotificationPrefAction(notifyOrderUpdates: boolean): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("launchkit_profiles")
    .update({ notify_order_updates: notifyOrderUpdates, updated_at: new Date().toISOString() })
    .eq("id", user.id);
}

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const locale = String(formData.get("locale") ?? "en") as Locale;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.rpc("launchkit_delete_own_account");
  if (error) return { error: error.message };

  await supabase.auth.signOut();
  redirect({ href: "/", locale });
  return null;
}
