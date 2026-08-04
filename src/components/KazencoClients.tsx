"use client";

import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";

const CLIENTS = [
  { name: "AGIP KCO", image: "/images/clients/agip-kco.png" },
  { name: "Bonatti", image: "/images/clients/bonatti.png" },
  { name: "CCC", image: "/images/clients/ccc.svg" },
  { name: "Denholm Zholdas", image: "/images/clients/denholm-zholdas.svg" },
  { name: "Fluor", image: "/images/clients/fluor.png" },
  { name: "GATE Construction", image: "/images/clients/gate-construction.png" },
  { name: "ISKER Group", image: "/images/clients/isker-group.png" },
  { name: "Kentech", image: "/images/clients/kentech.png" },
  { name: "KCOI", image: "/images/clients/kcoi.svg" },
  { name: "NCOC", image: "/images/clients/ncoc.png" },
  { name: "PSN KazStroy", image: "/images/clients/psn-kazstroy.png" },
  { name: "Schlumberger", image: "/images/clients/schlumberger.png" },
  { name: "Sarens", image: "/images/clients/sarens.png" },
  { name: "Senimdi Kurylys LLP", image: "/images/clients/senimdi-kurylys.jpeg" },
  { name: "SICIM", image: "/images/clients/sicim.png" },
  { name: "TCO", image: "/images/clients/tco.png" },
  { name: "WorleyParsons", image: "/images/clients/worleyparsons.png" },
];

export function KazencoClients({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).clients;
  return (
    <section id="clients" className="kazenco-v5-section kazenco-v5-clients">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">{copy[0]}</p>
          <h2>{copy[1]}</h2>
        </div>
        <p>{copy[2]}</p>
      </div>

      <div className="kazenco-v5-client-grid">
        {CLIENTS.map((client) => (
          <div className="kazenco-v5-client-card" key={client.name}>
            <Image
              src={client.image}
              alt={`${client.name} logo`}
              width={220}
              height={96}
              sizes="(max-width: 680px) 42vw, (max-width: 1080px) 26vw, 190px"
              className={client.name === "Senimdi Kurylys LLP" ? "kazenco-client-logo-large" : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
