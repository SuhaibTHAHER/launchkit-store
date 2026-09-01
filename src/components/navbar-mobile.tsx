"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";

type NavLink = { href: string; label: string };

export function NavbarMobile({
  links,
  authHref,
  authLabel,
}: {
  links: NavLink[];
  authHref: string;
  authLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav
          className="absolute inset-x-0 top-16 border-t border-border bg-background md:hidden"
          aria-label="Mobile"
        >
          <Container className="flex flex-col gap-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={authHref}
              onClick={() => setOpen(false)}
              className="rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground"
            >
              {authLabel}
            </Link>
          </Container>
        </nav>
      )}
    </>
  );
}
