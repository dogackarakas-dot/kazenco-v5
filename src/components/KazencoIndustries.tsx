const INDUSTRIES = [
  ["01", "Oil & Gas", "Supply and project support for upstream, midstream and downstream requirements."],
  ["02", "Petrochemical", "Materials and coordinated delivery for process plants and industrial facilities."],
  ["03", "Energy", "Project supply packages for power generation and supporting infrastructure."],
  ["04", "Industrial Facilities", "Construction, fit-out, furnishing and technical materials for operational sites."],
  ["05", "Infrastructure", "Coordinated material supply and site support for regional development projects."],
  ["06", "Commercial & Hospitality", "Turnkey furnishing, fit-out and material supply for offices and hotels."],
];

export function KazencoIndustries() {
  return (
    <section id="industries" className="kazenco-v5-section">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">Industries we serve</p>
          <h2>Built for demanding operating environments.</h2>
        </div>
        <p>
          Supporting operators, EPC contractors and project teams with
          coordinated supply and delivery across Kazakhstan.
        </p>
      </div>

      <div className="kazenco-v5-industry-grid">
        {INDUSTRIES.map(([number, title, description]) => (
          <article className="kazenco-v5-industry-card" key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
