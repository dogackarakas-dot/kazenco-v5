const REASONS = [
  [
    "01",
    "Two decades of regional experience",
    "Established in Atyrau in 2004, with project delivery knowledge built across Kazakhstan’s key industrial regions.",
  ],
  [
    "02",
    "Integrated delivery model",
    "Engineering support, procurement, construction, fit-out, furnishing and material supply coordinated by one team.",
  ],
  [
    "03",
    "Multilingual technical communication",
    "Commercial and technical coordination in English, Russian, Turkish and Kazakh.",
  ],
  [
    "04",
    "Documentation-led supply",
    "Project requirements supported with manufacturer documentation, certificates, inspection records and traceability.",
  ],
];

export function KazencoWhy() {
  return (
    <section className="kazenco-v5-section kazenco-v5-why">
      <div className="kazenco-v5-why-copy">
        <p className="kazenco-section-kicker">Why KAZENCO</p>
        <h2>Local knowledge. International project discipline.</h2>
      </div>

      <div className="kazenco-v5-why-list">
        {REASONS.map(([number, title, description]) => (
          <article className="kazenco-v5-why-item" key={title}>
            <strong>{number}</strong>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
