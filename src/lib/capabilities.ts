export interface Capability {
  slug: string;
  number: string;
  title: string;
  description: string;
  overview: string;
  scope: string[];
  delivery: { title: string; description: string }[];
  relatedProjectSlugs: string[];
}

export const CAPABILITIES: Capability[] = [
  {
    slug: "construction-site-works",
    number: "01",
    title: "Construction & Site Works",
    description: "Coordinated civil, structural and installation works for commercial and industrial project environments.",
    overview: "KAZENCO coordinates defined construction packages from site preparation and foundation interfaces through structural erection and supporting infrastructure works. Execution is planned around approved scope, access requirements and project HSE controls.",
    scope: ["Civil & foundation support", "Structural steel erection", "Pipeline infrastructure support", "Site HSE coordination"],
    delivery: [
      { title: "Scope review", description: "Confirm drawings, interfaces, site constraints and required documentation." },
      { title: "Execution planning", description: "Coordinate resources, sequencing, access and project safety requirements." },
      { title: "Site delivery", description: "Complete the agreed works with progress and quality coordination." },
      { title: "Handover", description: "Close the package against the approved scope and supporting records." },
    ],
    relatedProjectSlugs: ["isker-industrial-infrastructure-tengiz", "tco-industrial-access-platforms-tengiz", "4-batyr-houses-atyrau", "bonatti-office-tengiz"],
  },
  {
    slug: "fit-out-furnishing",
    number: "02",
    title: "Fit-out & Furnishing",
    description: "Integrated interior completion and furnishing packages for offices, camps, hospitality and operational facilities.",
    overview: "Fit-out, furniture supply and installation are coordinated as one delivery package. This reduces handover gaps between interior works, procurement, transport, placement and final completion.",
    scope: ["Interior fit-out", "Office & camp furniture", "Delivery & installation", "Final placement & handover"],
    delivery: [
      { title: "Requirement review", description: "Confirm room schedules, layouts, finishes and furniture requirements." },
      { title: "Package coordination", description: "Align fit-out activities, purchasing and delivery sequencing." },
      { title: "Installation", description: "Deliver, assemble and place the approved interior and furniture package." },
      { title: "Completion", description: "Review final placement and close outstanding handover items." },
    ],
    relatedProjectSlugs: ["worley-parsons-atyrau", "sarens-tco-tengiz", "bonatti-office-tengiz", "kis-orion-atyrau"],
  },
  {
    slug: "industrial-procurement-supply",
    number: "03",
    title: "Industrial Procurement & Supply",
    description: "Project-based sourcing and delivery of technical materials against client specifications and documentation requirements.",
    overview: "KAZENCO reviews project requirements, coordinates manufacturers and prepares supply packages around the requested specification, quantity, documentation and delivery location. Final compliance is confirmed against each approved request.",
    scope: ["Technical requirement review", "Manufacturer coordination", "MTC & CoC documentation", "Delivery planning"],
    delivery: [
      { title: "Technical review", description: "Check specifications, quantities, standards and required delivery documentation." },
      { title: "Sourcing", description: "Coordinate suitable manufacturers and commercial supply conditions." },
      { title: "Documentation", description: "Compile the agreed certificates, records and material documentation." },
      { title: "Delivery", description: "Plan packing, transport and delivery against the approved schedule." },
    ],
    relatedProjectSlugs: ["marriott-hotel-atyrau", "akzhayik-hotel-atyrau"],
  },
  {
    slug: "environmental-geosynthetic-works",
    number: "04",
    title: "Environmental & Geosynthetic Works",
    description: "Protective ground systems and geosynthetic applications supporting industrial and civil infrastructure.",
    overview: "Protective lining, subgrade and insulation applications are coordinated to the defined site build-up and installation sequence. The scope is aligned with adjacent civil and structural works to maintain continuity across the workfront.",
    scope: ["Ground-lining systems", "Protective subgrade layers", "Insulation applications", "Installation support"],
    delivery: [
      { title: "System review", description: "Confirm the specified layer build-up, interfaces and installation area." },
      { title: "Material planning", description: "Coordinate approved materials, quantities and workfront availability." },
      { title: "Application", description: "Install the agreed protective layers in sequence with adjacent works." },
      { title: "Close-out", description: "Review completed areas and supporting installation records." },
    ],
    relatedProjectSlugs: ["isker-industrial-infrastructure-tengiz"],
  },
];

export function getCapability(slug: string): Capability | undefined {
  return CAPABILITIES.find((capability) => capability.slug === slug);
}
