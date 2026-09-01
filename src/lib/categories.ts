import type { LucideIcon } from "lucide-react";
import { LayoutTemplate, PanelsTopLeft, Blocks, Component } from "lucide-react";
import type { Localized } from "./localized";

export type Category = {
  slug: string;
  name: Localized<string>;
  description: Localized<string>;
  icon: LucideIcon;
};

export const categories: Category[] = [
  {
    slug: "marketing-sites",
    name: { en: "Marketing Sites", ar: "مواقع تسويقية" },
    description: {
      en: "Landing pages and full marketing sites for launching a product.",
      ar: "صفحات هبوط ومواقع تسويقية كاملة لإطلاق منتج.",
    },
    icon: LayoutTemplate,
  },
  {
    slug: "dashboard-ui-kits",
    name: { en: "Dashboard UI Kits", ar: "أطقم واجهات لوحات تحكم" },
    description: {
      en: "The app shell your product needs once someone signs up.",
      ar: "هيكل التطبيق الذي يحتاجه منتجك بعد أن يسجّل أحدهم حسابًا.",
    },
    icon: PanelsTopLeft,
  },
  {
    slug: "ui-kits",
    name: { en: "UI Kits", ar: "أطقم واجهات (UI Kits)" },
    description: {
      en: "Reusable interface components — buttons, forms, cards, tables — for building your own screens fast.",
      ar: "مكوّنات واجهة قابلة لإعادة الاستخدام — أزرار، نماذج، بطاقات، جداول — لبناء شاشاتك الخاصة بسرعة.",
    },
    icon: Component,
  },
  {
    slug: "bundles",
    name: { en: "Bundles", ar: "باقات" },
    description: {
      en: "Multiple templates packaged together at a discount.",
      ar: "عدة قوالب مجمّعة معًا بسعر مخفّض.",
    },
    icon: Blocks,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
