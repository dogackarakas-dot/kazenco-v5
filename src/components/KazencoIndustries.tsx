import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";

export function KazencoIndustries({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale].industries;
  return (
    <section id="industries" className="kazenco-v5-section">
      <div className="kazenco-v5-section-head">
        <div>
          <p className="kazenco-section-kicker">{copy.kicker}</p>
          <h2>{copy.title}</h2>
        </div>
        <p>
          {copy.intro}
        </p>
      </div>

      <div className="kazenco-v5-industry-grid">
        {copy.items.map(([title, description, number]) => (
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
