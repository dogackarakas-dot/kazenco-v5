import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { CAPABILITIES } from "@/lib/capabilities";
import { INDUSTRIES } from "@/lib/industries";
import { LOCALES } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { PRODUCT_DETAIL_SLUGS } from "@/lib/product-detail-translations";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    ...PRODUCT_DETAIL_SLUGS.map((slug) => `/products/${slug}`),
    ...CAPABILITIES.map((capability) => `/capabilities/${capability.slug}`),
    ...PROJECTS.map((p) => `/projects/${p.slug}`),
    "/certificates",
    "/industries",
    ...INDUSTRIES.map((industry) => `/industries/${industry.slug}`),
  ];

  return LOCALES.flatMap((locale) => routes.map((route) => ({
      url: `${SITE.url}/${locale}${route}`,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(localizedAlternates(route)).map(([language, path]) => [language, `${SITE.url}${path}`]),
        ),
      },
    })));
}
