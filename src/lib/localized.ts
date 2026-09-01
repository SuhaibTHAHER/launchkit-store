import type { Locale } from "@/i18n/routing";

export type Localized<T> = Record<Locale, T>;

export function pick<T>(field: Localized<T>, locale: Locale): T {
  return field[locale];
}
