export interface ProductStatic {
  slug: string;
  number: string;
  referenceSpecs: string[];
  image: string;
}

export const PRODUCTS: ProductStatic[] = [
  {
    slug: "pipes-tubes",
    number: "01",
    referenceSpecs: ["ASTM", "ASME", "API"],
    image: "/images/products/pipes-tubes-realistic-v1.webp",
  },
  {
    slug: "fittings-flanges",
    number: "02",
    referenceSpecs: ["ASME B16.5", "ASME B16.9", "ASME B16.11"],
    image: "/images/products/fittings-flanges-realistic-v1.webp",
  },
  {
    slug: "valves-instrumentation",
    number: "03",
    referenceSpecs: ["API", "ASME", "NACE"],
    image: "/images/products/valves-instrumentation-realistic-v1.webp",
  },
  {
    slug: "fasteners-anchor-bolts",
    number: "04",
    referenceSpecs: ["ASTM A193", "ASTM A320", "ASTM A194"],
    image: "/images/products/fasteners-anchor-bolts-real-v1.webp",
  },
  {
    slug: "electrical-equipment",
    number: "05",
    referenceSpecs: ["IEC", "ATEX", "IP ratings"],
    image: "/images/products/electrical-equipment.webp",
  },
  {
    slug: "construction-materials",
    number: "06",
    referenceSpecs: ["QA/QC", "MTC", "CoC"],
    image: "/images/products/construction-materials.webp",
  },
];
