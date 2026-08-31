import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";
import { getIndustry, INDUSTRIES, type Industry } from "@/lib/industries";

export function getLocalizedIndustry(slug: string, locale: Locale): Industry | undefined {
  const industry = getIndustry(slug);
  if (!industry) return undefined;
  if (locale === "en") return industry;
  const index = INDUSTRIES.findIndex((item) => item.slug === slug);
  const [title, description] = HOME_COPY[locale].industries.items[index];
  return { ...industry, title, description };
}

export function getLocalizedIndustries(locale: Locale): Industry[] {
  return INDUSTRIES.map((industry, index) => {
    if (locale === "en") return industry;
    const [title, description] = HOME_COPY[locale].industries.items[index];
    return { ...industry, title, description };
  });
}
