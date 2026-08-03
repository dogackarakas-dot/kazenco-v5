"use client";

const CLIENTS = [
  { name: "AGIP KCO", image: "/images/clients/agip-kco.png" },
  { name: "Bonatti", image: "/images/clients/bonatti.png" },
  { name: "Fluor", image: "/images/clients/fluor.png" },
  { name: "Isker Group", image: "/images/clients/isker-group.png" },
  { name: "Kentech", image: "/images/clients/kentech.png" },
  { name: "NCOC", image: "/images/clients/ncoc.png" },
  { name: "PSN KazStroy", image: "/images/clients/psn-kazstroy.png" },
  { name: "Schlumberger", image: "/images/clients/schlumberger.png" },
  { name: "TCO", image: "/images/clients/tco.png" },
  { name: "WorleyParsons", image: "/images/clients/worleyparsons.png" },
];

export function KazencoClients() {
  return (
    <section id="clients" className="kazenco-v5-section kazenco-v5-clients">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">Trusted by industry leaders</p>
          <h2>Relationships earned through delivery.</h2>
        </div>
        <p>
          Supporting international operators, EPC contractors and regional
          project teams across Kazakhstan.
        </p>
      </div>

      <div className="kazenco-v5-client-grid">
        {CLIENTS.map((client) => (
          <div className="kazenco-v5-client-card" key={client.name}>
            <img src={client.image} alt={`${client.name} logo`} />
          </div>
        ))}
      </div>
    </section>
  );
}
