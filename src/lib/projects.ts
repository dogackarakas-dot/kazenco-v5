import type { Project } from "@/types/project";

export const FEATURED_PROJECT_SLUGS = [
  "worley-parsons-atyrau",
  "4-batyr-houses-atyrau",
  "sarens-tco-tengiz",
  "tco-industrial-access-platforms-tengiz",
  "isker-industrial-infrastructure-tengiz",
  "bonatti-office-tengiz",
  "marriott-hotel-atyrau",
] as const;

export const PROJECTS: Project[] = [
  {
    slug: "worley-parsons-atyrau",
    title: "Worley Parsons",
    gradient: "linear-gradient(135deg,#1a8a1a,#0b3d0b)",
    image: "/images/projects/worley-parsons-atyrau.jpeg",
    category: "Fit-out & Furnishing",
    location: "Atyrau",
    client: "Worley Parsons",
    role: "Turnkey fit-out & furnishing",
    summary:
      "Complete turnkey fit-out and furnishing for the Worley Parsons offices in Atyrau — interior construction, furniture and final installation delivered end to end.",
  },
  {
    slug: "4-batyr-houses-atyrau",
    title: "4 Batyr Houses",
    gradient: "linear-gradient(135deg,#166534,#052e16)",
    image: "/images/projects/4-batyr-houses-atyrau/cover-clean.jpg",
    category: "Construction",
    location: "Atyrau",
    client: "4 Batyr Houses",
    year: "2004",
    role: "Construction & fit-out",
    summary:
      "Construction and fit-out works for 4 Batyr Houses in Atyrau, delivered with coordinated site execution and interior completion.",
    gallery: [
      "/images/projects/4-batyr-houses-atyrau/construction-01-clean.jpg",
      "/images/projects/4-batyr-houses-atyrau/construction-02-clean.jpg",
      "/images/projects/4-batyr-houses-atyrau/construction-03-clean.jpg",
      "/images/projects/4-batyr-houses-atyrau/construction-04-clean.jpg",
    ],
  },
  {
    slug: "sarens-tco-tengiz",
    title: "Sarens / Tengizchevroil (TCO)",
    gradient: "linear-gradient(135deg,#0b5fa5,#082f49)",
    image: "/images/projects/sarens-tco-tengiz/cover.jpg",
    category: "Fit-out & Furnishing",
    location: "Tengiz",
    client: "Sarens / Tengizchevroil (TCO)",
    role: "Turnkey Fit-Out & Furnishing (Industrial Site Mobilization)",
    summary:
      "Turnkey fit-out and furnishing delivered for Sarens / Tengizchevroil (TCO) in Tengiz, supporting industrial site mobilization from material handling and modular building installation through completed office interiors.",
    gallery: [
      "/images/projects/sarens-tco-tengiz/gallery-01.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-02.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-03.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-04.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-05.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-06.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-07.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-08.jpg",
      "/images/projects/sarens-tco-tengiz/gallery-09.jpg",
    ],
  },
  {
    slug: "tco-industrial-access-platforms-tengiz",
    title: "TCO Industrial Access Platforms",
    gradient: "linear-gradient(135deg,#6b5f27,#243b2d)",
    image: "/images/projects/sarens-tco-tengiz/platform-installation-02.jpg",
    category: "Construction",
    location: "Tengiz, Atyrau",
    client: "Sarens / Tengizchevroil (TCO)",
    role: "Turnkey Fit-Out & Furnishing (Industrial Site Mobilization) & On-Site Utilities",
    summary:
      "Successfully delivered industrial access platform manufacturing and on-site utility support for the TCO project in Tengiz, coordinating workshop fabrication, site installation and final operational access.",
    gallery: [
      "/images/projects/sarens-tco-tengiz/platform-manufacturing-01.jpg",
      "/images/projects/sarens-tco-tengiz/platform-installation-01.jpg",
    ],
  },
  {
    slug: "isker-industrial-infrastructure-tengiz",
    title: "ISKER Industrial Infrastructure",
    gradient: "linear-gradient(135deg,#166534,#1e293b)",
    image: "/images/projects/isker-industrial-infrastructure-tengiz/cover.jpeg",
    category: "Construction",
    location: "Tengiz",
    client: "ISKER Group",
    role: "Structural Steel Erection, Ground Lining & Pipeline Infrastructure Support",
    summary:
      "Industrial construction works delivered for ISKER Group in Tengiz, encompassing structural steel frame erection on concrete foundations, protective ground-lining and insulation systems, and civil support for CaTRo pipeline infrastructure and loading racks—all executed in accordance with stringent oil and gas HSE requirements.",
    gallery: [
      "/images/projects/isker-industrial-infrastructure-tengiz/gallery-01.jpeg",
      "/images/projects/isker-industrial-infrastructure-tengiz/gallery-02.jpeg",
      "/images/projects/isker-industrial-infrastructure-tengiz/gallery-03.jpeg",
      "/images/projects/isker-industrial-infrastructure-tengiz/gallery-04.jpeg",
    ],
  },
  {
    slug: "worley-parsons-almaty",
    title: "Worley Parsons",
    gradient: "linear-gradient(135deg,#15803d,#14532d)",
    image: "/images/projects/worley-parsons-almaty.jpeg",
    category: "Fit-out & Furnishing",
    location: "Almaty",
    client: "Worley Parsons",
    role: "Turnkey fit-out & furnishing",
    summary:
      "Turnkey fit-out and furnishing for Worley Parsons in Almaty, covering interior works, furniture supply and final installation.",
  },
  {
    slug: "marriott-hotel-atyrau",
    title: "Marriott Hotel",
    gradient: "linear-gradient(135deg,#166534,#052e16)",
    image: "/images/projects/marriott-hotel-atyrau.jpeg",
    category: "Material Supply",
    location: "Atyrau",
    client: "Marriott Hotel",
    role: "Equipment & material supply",
    summary:
      "Supply of equipment and materials for the Marriott Hotel in Atyrau, coordinated to hospitality specifications and delivery schedules.",
  },
  {
    slug: "akzhayik-hotel-atyrau",
    title: "Akzhayik Hotel",
    gradient: "linear-gradient(135deg,#3f6212,#1a2e05)",
    image: "/images/projects/akzhayik-hotel-atyrau.jpeg",
    category: "Material Supply",
    location: "Atyrau",
    client: "Akzhayik Hotel",
    role: "Equipment & material supply",
    summary:
      "Equipment and material supply for the Akzhayik Hotel in Atyrau, coordinated to hospitality fit-out requirements.",
  },
  {
    slug: "kis-orion-atyrau",
    title: "KIS Orion",
    gradient: "linear-gradient(135deg,#166534,#0b3d0b)",
    image: "/images/projects/kis-orion-atyrau.jpeg",
    category: "Fit-out & Furnishing",
    location: "Atyrau",
    client: "KIS Orion",
    role: "Turnkey furnishing",
    summary:
      "Turnkey furnishing of the KIS Orion project in Atyrau — furniture production, supply and installation delivered as a complete package.",
  },
  {
    slug: "gate-agip-camp-karabatan",
    title: "GATE AGIP Camp",
    gradient: "linear-gradient(135deg,#15803d,#14532d)",
    category: "Construction",
    location: "Karabatan",
    client: "GATE Construction",
    role: "Construction, fit-out & furnishing",
    summary:
      "Construction, fit-out and furnishing works for the GATE Construction AGIP camp in Karabatan, supporting large-scale industrial accommodation needs.",
  },
  {
    slug: "isker-construction-atyrau",
    title: "ISKER Construction",
    gradient: "linear-gradient(135deg,#0f766e,#052e2b)",
    category: "Fit-out & Furnishing",
    location: "Atyrau",
    client: "ISKER Group",
    role: "Turnkey furnishing",
    summary:
      "Turnkey furnishing works for ISKER Construction in Atyrau, covering coordinated supply, delivery and installation.",
  },
  {
    slug: "isker-institute-aktau",
    title: "ISKER Institute",
    gradient: "linear-gradient(135deg,#334155,#0f172a)",
    category: "Fit-out & Furnishing",
    location: "Aktau",
    client: "ISKER Group",
    role: "Turnkey furnishing",
    summary:
      "Turnkey furnishing for ISKER Institute in Aktau, delivered as a complete furniture supply and installation package.",
  },
  {
    slug: "sapsan-office-buildings-houses-tengiz",
    title: "Sapsan Office Buildings & Houses",
    gradient: "linear-gradient(135deg,#3f6212,#1a2e05)",
    category: "Fit-out & Furnishing",
    location: "Tengiz",
    client: "Sapsan",
    role: "Turnkey fit-out & furnishing",
    summary:
      "Fit-out and furnishing works for Sapsan office buildings and houses in Tengiz, supporting site-based operational spaces.",
  },
  {
    slug: "sicim-office-karabatan",
    title: "SICIM Office",
    gradient: "linear-gradient(135deg,#334155,#0f172a)",
    category: "Construction",
    location: "Karabatan",
    client: "SICIM",
    role: "Turnkey construction",
    summary:
      "Turnkey construction of the SICIM office in Karabatan, from site coordination through assembly and installation.",
  },
  {
    slug: "bonatti-office-tengiz",
    title: "Bonatti Office Building",
    gradient: "linear-gradient(135deg,#0f766e,#052e2b)",
    image: "/images/projects/bonatti-office-tengiz/cover.jpg",
    category: "Construction",
    location: "Tengiz",
    client: "Bonatti",
    role: "Construction, fit-out & furnishing",
    summary:
      "Turnkey construction, fit-out and furnishing of the Bonatti office building in Tengiz, delivered to industrial-site standards.",
    gallery: [
      "/images/projects/bonatti-office-tengiz/gallery-01.jpg",
      "/images/projects/bonatti-office-tengiz/gallery-02.jpg",
      "/images/projects/bonatti-office-tengiz/gallery-03.jpg",
    ],
  },
  {
    slug: "bonatti-office-aksai",
    title: "Bonatti Office Building",
    gradient: "linear-gradient(135deg,#164e63,#082f49)",
    category: "Construction",
    location: "Aksai",
    client: "Bonatti",
    role: "Construction & fit-out",
    summary:
      "Construction and fit-out works for the Bonatti office building in Aksai, coordinated to industrial client requirements.",
  },
  {
    slug: "agip-kashagan-gate-camp",
    title: "AGIP Kashagan Gate Camp",
    gradient: "linear-gradient(135deg,#1a8a1a,#134e13)",
    category: "Assembly",
    location: "Karabatan",
    client: "AGIP KCO",
    role: "Assembly works",
    summary:
      "Assembly works for the AGIP Kashagan gate camp in Karabatan, supporting one of the region's major industrial developments.",
  },
  {
    slug: "nur-oil-head-office-atyrau",
    title: "NUR Oil Head Office",
    gradient: "linear-gradient(135deg,#166534,#0b3d0b)",
    category: "Fit-out & Furnishing",
    location: "Atyrau",
    client: "NUR Oil",
    role: "Turnkey furnishing",
    summary:
      "Turnkey furnishing for NUR Oil Head Office in Atyrau, including coordinated furniture supply and installation.",
  },
  {
    slug: "mmk-head-office-atyrau",
    title: "MMK Head Office",
    gradient: "linear-gradient(135deg,#15803d,#052e16)",
    category: "Fit-out & Furnishing",
    location: "Atyrau",
    client: "MMK",
    role: "Turnkey furnishing",
    summary:
      "Turnkey furnishing works for MMK Head Office in Atyrau, delivered as an integrated supply and installation scope.",
  },
  {
    slug: "isker-construction-head-office-atyrau",
    title: "ISKER Construction Head Office",
    gradient: "linear-gradient(135deg,#0f766e,#052e2b)",
    image: "/images/projects/isker-construction-head-office-atyrau.jpeg",
    category: "Fit-out & Furnishing",
    location: "Atyrau",
    client: "ISKER Group",
    role: "Turnkey furnishing",
    summary:
      "Turnkey furnishing for ISKER Construction Head Office in Atyrau, from furniture procurement through final placement.",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
