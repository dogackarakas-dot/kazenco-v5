const PRODUCTS = [
  {
    number: "01",
    title: "Pipes & Tubes",
    description:
      "Carbon steel, stainless steel and alloy steel piping materials for demanding industrial applications.",
  },
  {
    number: "02",
    title: "Fittings & Flanges",
    description:
      "Forged and butt-weld fittings, flanges and connection components to international standards.",
  },
  {
    number: "03",
    title: "Valves & Instrumentation",
    description:
      "Process valves, instrumentation valves, tubing and control components for project supply packages.",
  },
  {
    number: "04",
    title: "Fasteners & Anchor Bolts",
    description:
      "Stud bolts, anchor bolts, nuts, washers and custom connection solutions with documentation.",
  },
  {
    number: "05",
    title: "Electrical Equipment",
    description:
      "Project-based sourcing of electrical equipment, accessories and supporting industrial materials.",
  },
  {
    number: "06",
    title: "Construction Materials",
    description:
      "Coordinated supply of construction, fit-out, furnishing and site materials across Kazakhstan.",
  },
];

export function KazencoProducts() {
  return (
    <section id="products" className="kazenco-v5-section">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">Core products</p>
          <h2>Industrial materials for complex projects.</h2>
        </div>
        <p>
          Project-based sourcing supported by technical review, manufacturer
          coordination, documentation and delivery planning.
        </p>
      </div>

      <div className="kazenco-v5-product-grid">
        {PRODUCTS.map((product) => (
          <a className="kazenco-v5-product-card" href="#contact" key={product.title}>
            <span className="kazenco-v5-product-number">{product.number}</span>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <span className="kazenco-v5-card-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
