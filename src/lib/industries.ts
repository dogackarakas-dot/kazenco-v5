export interface Industry {
  slug: string;
  number: string;
  title: string;
  description: string;
  relatedProjectSlugs: string[];
}

const OIL_GAS_PROJECT_SLUGS = [
  "sarens-tco-tengiz",
  "tco-industrial-access-platforms-tengiz",
  "isker-industrial-infrastructure-tengiz",
];

export const INDUSTRIES: Industry[] = [
  { slug: "oil-gas", number: "01", title: "Oil & Gas", description: "Supply and project support for upstream, midstream and downstream requirements.", relatedProjectSlugs: OIL_GAS_PROJECT_SLUGS },
  { slug: "petrochemical", number: "02", title: "Petrochemical", description: "Materials and coordinated delivery for process plants and industrial facilities.", relatedProjectSlugs: OIL_GAS_PROJECT_SLUGS },
  { slug: "energy", number: "03", title: "Energy", description: "Project supply packages for power generation and supporting infrastructure.", relatedProjectSlugs: [] },
  { slug: "industrial-facilities", number: "04", title: "Industrial Facilities", description: "Construction, fit-out, furnishing and technical materials for operational sites.", relatedProjectSlugs: ["mmk-head-office-atyrau"] },
  { slug: "infrastructure", number: "05", title: "Infrastructure", description: "Coordinated material supply and site support for regional development projects.", relatedProjectSlugs: [] },
  { slug: "commercial-hospitality", number: "06", title: "Commercial & Hospitality", description: "Turnkey furnishing, fit-out and material supply for offices and hotels.", relatedProjectSlugs: ["marriott-hotel-atyrau", "akzhayik-hotel-atyrau"] },
];

export function getIndustry(slug: string) {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}
