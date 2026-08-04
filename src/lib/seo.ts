import type { Locale } from "@/lib/i18n";

export const SEO_COPY: Record<Locale, { title: string; description: string; project: string }> = {
  en: {
    title: "KAZENCO | Engineering, Construction and Industrial Solutions",
    description: "Engineering, construction, environmental works, turnkey fit-out and industrial material supply across Kazakhstan since 2004.",
    project: "Project",
  },
  ru: {
    title: "KAZENCO | Инжиниринг, строительство и промышленные решения",
    description: "Инжиниринг, строительство, экологические работы, отделка под ключ и поставка промышленных материалов по Казахстану с 2004 года.",
    project: "Проект",
  },
  tr: {
    title: "KAZENCO | Mühendislik, İnşaat ve Endüstriyel Çözümler",
    description: "2004’ten beri Kazakistan genelinde mühendislik, inşaat, çevre uygulamaları, anahtar teslim ince işler ve endüstriyel malzeme tedariki.",
    project: "Projesi",
  },
  kz: {
    title: "KAZENCO | Инжиниринг, құрылыс және өнеркәсіптік шешімдер",
    description: "2004 жылдан бері Қазақстан бойынша инжиниринг, құрылыс, экологиялық жұмыстар, кілтпен әрлеу және өнеркәсіптік материал жеткізу.",
    project: "Жобасы",
  },
};

export function localizedAlternates(path = "") {
  return {
    en: `/en${path}`,
    ru: `/ru${path}`,
    tr: `/tr${path}`,
    kk: `/kz${path}`,
    "x-default": `/en${path}`,
  };
}
