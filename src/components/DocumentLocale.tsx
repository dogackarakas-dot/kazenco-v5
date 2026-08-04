"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";

export function DocumentLocale() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = localeFromPathname(pathname);
    document.documentElement.lang = locale === "kz" ? "kk" : locale;
  }, [pathname]);

  return null;
}
