import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (process.env.KAZENCO_PREVIEW === "1") {
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
