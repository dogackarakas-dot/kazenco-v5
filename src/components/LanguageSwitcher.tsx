"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_NAMES, localeFromPathname, localizePath } from "@/lib/i18n";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const activeLocale = localeFromPathname(pathname);

  return (
    <div className="kazenco-language-switcher" aria-label="Language selector">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={localizePath(pathname, locale)}
          hrefLang={locale === "kz" ? "kk" : locale}
          lang={locale === "kz" ? "kk" : locale}
          aria-label={`${locale.toUpperCase()} — ${LOCALE_NAMES[locale]}`}
          aria-current={locale === activeLocale ? "page" : undefined}
          className={locale === activeLocale ? "is-active" : undefined}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
