"use client";

import { Boxes } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { accountNavItems } from "@/components/account/nav-items";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function SidebarContent({
  fullName,
  email,
  onNavigate,
}: {
  fullName: string;
  email: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("accountNav");
  const pathname = usePathname();

  const initials = (fullName || email)
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2 px-5 font-semibold tracking-tight">
        <span className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Boxes className="size-4" />
        </span>
        Launchkit
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Account">
        {accountNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
            {initials || "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{fullName || email}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="mt-2 px-1">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ fullName, email }: { fullName: string; email: string }) {
  return (
    <aside className="hidden w-64 shrink-0 border-e border-border lg:block">
      <div className="sticky top-0 h-screen">
        <SidebarContent fullName={fullName} email={email} />
      </div>
    </aside>
  );
}
