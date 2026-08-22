import { CAPABILITIES } from "@/lib/capabilities";
import { LOCALES } from "@/lib/i18n";
import { PRODUCT_DETAIL_SLUGS, type ProductDetailSlug } from "@/lib/product-detail-translations";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site";

const PRODUCT_IMAGES: Record<ProductDetailSlug, string> = {
  "pipes-tubes": "/images/products/pipes-tubes-realistic-v1.webp",
  "fittings-flanges": "/images/products/fittings-flanges-realistic-v1.webp",
  "valves-instrumentation": "/images/products/valves-instrumentation-realistic-v1.webp",
  "fasteners-anchor-bolts": "/images/products/fasteners-anchor-bolts-real-v1.webp",
  "electrical-equipment": "/images/products/electrical-equipment.webp",
  "construction-materials": "/images/products/construction-materials.webp",
};

const PRODUCT_REFERENCE_IMAGES = [
  "/images/projects/industrial-site.jpeg",
  "/images/projects/rolled-metal-products.jpeg",
  "/images/projects/steel-structures.png",
  "/images/projects/tco-manufacturing.png",
  "/images/projects/tengiz-karabatan-project.jpeg",
] as const;

interface ImageSitemapEntry {
  pagePath: string;
  imagePaths: string[];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function absoluteUrl(path: string) {
  return `${SITE.url}${path}`;
}

function imageSitemapEntries(): ImageSitemapEntry[] {
  const projectCoverImages = PROJECTS.flatMap((project) => project.image ? [project.image] : []);
  const homeImages = [
    ...Object.values(PRODUCT_IMAGES),
    ...PRODUCT_REFERENCE_IMAGES,
    ...projectCoverImages,
  ];

  return LOCALES.flatMap((locale) => {
    const homeEntry = {
      pagePath: `/${locale}`,
      imagePaths: homeImages,
    };
    const projectEntries = PROJECTS.flatMap((project) => {
      const imagePaths = [
        ...(project.image ? [project.image] : []),
        ...(project.gallery ?? []),
      ];

      return imagePaths.length > 0
        ? [{ pagePath: `/${locale}/projects/${project.slug}`, imagePaths }]
        : [];
    });
    const capabilityEntries = CAPABILITIES.flatMap((capability) => {
      const imagePaths = capability.relatedProjectSlugs.flatMap((slug) => {
        const project = PROJECTS.find((item) => item.slug === slug);
        return project?.image ? [project.image] : [];
      });

      return imagePaths.length > 0
        ? [{ pagePath: `/${locale}/capabilities/${capability.slug}`, imagePaths }]
        : [];
    });
    const productEntries = PRODUCT_DETAIL_SLUGS.map((slug) => ({
      pagePath: `/${locale}/products/${slug}`,
      imagePaths: [PRODUCT_IMAGES[slug]],
    }));

    return [homeEntry, ...projectEntries, ...capabilityEntries, ...productEntries];
  });
}

function imageSitemapXml() {
  const entries = imageSitemapEntries();
  const seenPages = new Set<string>();
  const urlElements = entries.map(({ pagePath, imagePaths }) => {
    const pageUrl = absoluteUrl(pagePath);
    if (seenPages.has(pageUrl)) throw new Error(`Duplicate image sitemap page: ${pageUrl}`);
    seenPages.add(pageUrl);

    const uniqueImageUrls = [...new Set(imagePaths.map(absoluteUrl))];
    const images = uniqueImageUrls
      .map((imageUrl) => `    <image:image>\n      <image:loc>${escapeXml(imageUrl)}</image:loc>\n    </image:image>`)
      .join("\n");

    return `  <url>\n    <loc>${escapeXml(pageUrl)}</loc>\n${images}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlElements.join("\n")}\n</urlset>\n`;
}

export function GET() {
  return new Response(imageSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
