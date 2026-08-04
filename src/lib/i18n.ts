export const LOCALES = ["en", "ru", "tr", "kz"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  tr: "Türkçe",
  kz: "Қазақша",
};

export const NAVIGATION: Record<Locale, Record<string, string>> = {
  en: { about: "About", capabilities: "Capabilities", products: "Products", industries: "Industries", projects: "Projects", clients: "Clients", certificates: "Certificates", contact: "Contact", home: "KAZENCO Home", navigation: "Main navigation" },
  ru: { about: "О компании", capabilities: "Возможности", products: "Продукция", industries: "Отрасли", projects: "Проекты", clients: "Клиенты", certificates: "Сертификаты", contact: "Контакты", home: "Главная KAZENCO", navigation: "Основная навигация" },
  tr: { about: "Hakkımızda", capabilities: "Yetkinlikler", products: "Ürünler", industries: "Sektörler", projects: "Projeler", clients: "Müşteriler", certificates: "Sertifikalar", contact: "İletişim", home: "KAZENCO Ana Sayfa", navigation: "Ana navigasyon" },
  kz: { about: "Біз туралы", capabilities: "Мүмкіндіктер", products: "Өнімдер", industries: "Салалар", projects: "Жобалар", clients: "Клиенттер", certificates: "Сертификаттар", contact: "Байланыс", home: "KAZENCO басты беті", navigation: "Негізгі навигация" },
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeFromPathname(pathname: string): Locale {
  const candidate = pathname.split("/")[1];
  return isLocale(candidate) ? candidate : DEFAULT_LOCALE;
}

export function localizePath(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  if (isLocale(segments[1] ?? "")) segments[1] = locale;
  else segments.splice(1, 0, locale);
  const localized = segments.join("/");
  return localized === `/${locale}/` ? `/${locale}` : localized;
}
