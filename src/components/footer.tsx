import { Boxes } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { getProducts } from "@/lib/products";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const products = await getProducts();

  const columns = [
    {
      title: t("products"),
      links: [
        { href: "/products", label: t("allTemplates") },
        ...products.map((p) => ({
          href: `/products/${p.slug}`,
          label: pick(p.name, locale),
        })),
      ],
    },
    {
      title: t("resources"),
      links: [
        { href: "/docs", label: t("documentation") },
        { href: "/blog", label: t("blog") },
        { href: "/faq", label: t("faq") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/about", label: t("about") },
        { href: "/contact", label: t("contact") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/license", label: t("license") },
        { href: "/privacy", label: t("privacyPolicy") },
        { href: "/terms", label: t("terms") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center bg-accent text-accent-foreground">
                <Boxes className="size-4" />
              </span>
              Launchkit
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="label text-xs text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="label text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("builtWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
