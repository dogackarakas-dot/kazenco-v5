"use client";

import Link from "next/link";
import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";
import { getLocalizedIndustries } from "@/lib/industry-translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function KazencoIndustries({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale].industries;
  const industries = getLocalizedIndustries(locale);
  const headRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  return (
    <section id="industries" className="kazenco-v5-section">
      <div ref={headRef} className="kazenco-v5-section-head kazenco-v7-reveal-onscroll">
        <div>
          <p className="kazenco-section-kicker">{copy.kicker}</p>
          <h2>{copy.title}</h2>
        </div>
        <p>
          {copy.intro}
        </p>
      </div>

      <div ref={gridRef} className="kazenco-v5-industry-grid">
        {industries.slice(0, 3).map((industry, index) => (
          <Link
            className={`kazenco-v5-industry-card kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
            href={`/${locale}/industries/${industry.slug}`}
            key={industry.slug}
          >
            <span>{industry.number}</span>
            <h3>{industry.title}</h3>
            <p>{industry.description}</p>
          </Link>
        ))}
      </div>

      <div className="kazenco-catalog-cta">
        <Link href={`/${locale}/industries`} className="kazenco-catalog-button">
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
