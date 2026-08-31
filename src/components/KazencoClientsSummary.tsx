"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import { CLIENTS } from "@/lib/clients";

export function KazencoClientsSummary({ locale = "en" }: { locale?: Locale }) {
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
        {CLIENTS.slice(0, 8).map((client) => (
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

      <div className="kazenco-catalog-cta">
        <Link href={`/${locale}/clients`} className="kazenco-catalog-button">
          {copy[3]}
        </Link>
      </div>
    </section>
  );
}
