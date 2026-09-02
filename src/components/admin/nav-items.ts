import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Package, Receipt, Users } from "lucide-react";

export type AdminNavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", labelKey: "overview", icon: LayoutGrid },
  { href: "/admin/products", labelKey: "products", icon: Package },
  { href: "/admin/orders", labelKey: "orders", icon: Receipt },
  { href: "/admin/users", labelKey: "users", icon: Users },
];
