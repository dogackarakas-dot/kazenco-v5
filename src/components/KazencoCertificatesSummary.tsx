import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sectionCopy } from "@/lib/section-translations";

export function KazencoCertificatesSummary({ locale = "en" }: { locale?: Locale }) {
  const copy = sectionCopy(locale).certificates;
  return (
    <section id="certificates" className="kazenco-v5-section">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">{copy[0]}</p>
          {copy[1] ? <h2>{copy[1]}</h2> : null}
        </div>
        <p>{copy[2]}</p>
      </div>
      <div className="kazenco-catalog-cta">
        <Link href={`/${locale}/certificates`} className="kazenco-catalog-button">
          {copy[10]}
        </Link>
      </div>
    </section>
  );
}
