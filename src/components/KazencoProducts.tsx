const PRODUCTS = [
  {
    number: "01",
    title: "Pipes & Tubes",
    eyebrow: "Piping systems",
    description:
      "Carbon steel, stainless steel and alloy steel pipes and tubes for refinery, petrochemical, energy and industrial projects.",
    standards: ["ASTM", "ASME", "API"],
    accent: "pipes",
  },
  {
    number: "02",
    title: "Fittings & Flanges",
    eyebrow: "Connection systems",
    description:
      "Forged and butt-weld fittings, flanges and connection components supplied to international project standards.",
    standards: ["B16.5", "B16.9", "B16.11"],
    accent: "fittings",
  },
  {
    number: "03",
    title: "Valves & Instrumentation",
    eyebrow: "Flow control",
    description:
      "Process valves, instrumentation valves, tubing and control components for critical industrial service.",
    standards: ["API", "ASME", "NACE"],
    accent: "valves",
  },
  {
    number: "04",
    title: "Fasteners & Anchor Bolts",
    eyebrow: "Connection hardware",
    description:
      "Stud bolts, anchor bolts, nuts, washers and custom fastening packages supported by material documentation.",
    standards: ["A193", "A320", "A194"],
    accent: "fasteners",
  },
  {
    number: "05",
    title: "Electrical Equipment",
    eyebrow: "Electrical supply",
    description:
      "Project-based sourcing of electrical equipment, accessories and supporting industrial materials.",
    standards: ["IEC", "ATEX", "IP"],
    accent: "electrical",
  },
  {
    number: "06",
    title: "Construction Materials",
    eyebrow: "Site materials",
    description:
      "Coordinated supply of construction, fit-out, furnishing and site materials for project delivery across Kazakhstan.",
    standards: ["QA/QC", "MTC", "CoC"],
    accent: "construction",
  },
];

function ProductGraphic({ accent }: { accent: string }) {
  return (
    <div className={`kazenco-v9-product-graphic kazenco-v9-${accent}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function KazencoProducts() {
  return (
    <section id="products" className="kazenco-v5-section kazenco-v9-products">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">Core products</p>
          <h2>Industrial supply, engineered around project requirements.</h2>
        </div>
        <p>
          Technical review, manufacturer coordination, documentation and
          delivery planning — brought together in one supply workflow.
        </p>
      </div>

      <div className="kazenco-v9-product-grid">
        {PRODUCTS.map((product, index) => (
          <a
            className={`kazenco-v9-product-card${index === 0 ? " is-featured" : ""}`}
            href="#contact"
            key={product.title}
          >
            <div className="kazenco-v9-product-top">
              <div>
                <span className="kazenco-v9-product-number">{product.number}</span>
                <p className="kazenco-v9-product-eyebrow">{product.eyebrow}</p>
              </div>
              <span className="kazenco-v9-product-arrow" aria-hidden="true">↗</span>
            </div>

            <ProductGraphic accent={product.accent} />

            <div className="kazenco-v9-product-copy">
              <h3>{product.title}</h3>
              <p>{product.description}</p>

              <ul aria-label={`${product.title} standards`}>
                {product.standards.map((standard) => (
                  <li key={standard}>{standard}</li>
                ))}
              </ul>

              <span className="kazenco-v9-product-link">View supply scope</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
