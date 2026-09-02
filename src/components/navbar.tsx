import { Boxes } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavbarMobile } from "@/components/navbar-mobile";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const t = await getTranslations("nav");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const links = [
    { href: "/products", label: t("products") },
    { href: "/blog", label: t("blog") },
    { href: "/docs", label: t("docs") },
    { href: "/about", label: t("about") },
  ];

  const authHref = user ? "/account" : "/login";
  const authLabel = user ? t("account") : t("signIn");

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center bg-accent text-accent-foreground">
            <Boxes className="size-4" />
          </span>
          Launchkit
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href={authHref}
            className="label bg-accent px-4 py-2 text-xs text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {authLabel}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <ThemeToggle />
          <NavbarMobile links={links} authHref={authHref} authLabel={authLabel} />
        </div>
      </Container>
    </header>
  );
}
