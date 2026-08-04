import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";

export function KazencoWhy({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale].why;
  return (
    <section className="kazenco-v5-section kazenco-v5-why">
      <div className="kazenco-v5-why-copy">
        <p className="kazenco-section-kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
      </div>

      <div className="kazenco-v5-why-list">
        {copy.reasons.map(([title, description, number]) => (
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
