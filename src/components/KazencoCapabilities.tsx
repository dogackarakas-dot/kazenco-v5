"use client";

import Link from "next/link";
import { CAPABILITIES } from "@/lib/capabilities";
import { getLocalizedCapability } from "@/lib/capability-translations";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function KazencoCapabilities({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).capabilities;
  const capabilities = CAPABILITIES.map((capability) => getLocalizedCapability(capability.slug, locale) ?? capability);
  const headRef = useScrollReveal<HTMLElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  return (
    <section id="capabilities" className="kazenco-v5-section kazenco-capabilities">
      <header ref={headRef} className="kazenco-capabilities-head kazenco-v7-reveal-onscroll">
        <div>
          <p className="kazenco-section-kicker">{copy[0]}</p>
          <h2>{copy[1]}</h2>
        </div>
        <div>
          <p>{copy[2]}</p>
          <a href="#contact">{copy[3]} <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <div ref={gridRef} className="kazenco-capabilities-grid">
        {capabilities.map((capability, index) => (
          <article
            key={capability.title}
            className={`kazenco-capability-card kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
          >
            <span>{capability.number}</span>
            <h3>{capability.title}</h3>
            <div>
              <p>{capability.description}</p>
              <ul aria-label={`${capability.title} scope`}>
                {capability.scope.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href={`/${locale}/capabilities/${capability.slug}`}>{copy[4]} <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
