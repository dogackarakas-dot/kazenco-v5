import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isPreviewSite =
    process.env.KAZENCO_PREVIEW === "1" && process.env.VERCEL_ENV !== "production";

  if (isPreviewSite) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: SITE.url,
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
