import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { CAPABILITIES } from "@/lib/capabilities";
import { LOCALES } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    ...CAPABILITIES.map((capability) => `/capabilities/${capability.slug}`),
    ...PROJECTS.map((p) => `/projects/${p.slug}`),
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
