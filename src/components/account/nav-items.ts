import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Package, Download, Heart, Receipt, Settings } from "lucide-react";

export type AccountNavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

export const accountNavItems: AccountNavItem[] = [
  { href: "/account", labelKey: "dashboard", icon: LayoutGrid },
  { href: "/account/products", labelKey: "myProducts", icon: Package },
  { href: "/account/downloads", labelKey: "downloads", icon: Download },
  { href: "/account/wishlist", labelKey: "wishlist", icon: Heart },
  { href: "/account/orders", labelKey: "orders", icon: Receipt },
  { href: "/account/settings", labelKey: "settings", icon: Settings },
];
