import Image from "next/image";
import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";

export function KazencoContact({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale].contact;
  const details = [
    { label: copy.labels[0], value: copy.location },
    { label: copy.labels[1], value: "info@kazenco.com", href: "mailto:info@kazenco.com" },
    { label: copy.labels[2], value: "+7 702 431 66 98", href: "tel:+77024316698" },
  ];
  return (
    <section id="contact" className="kazenco-v5-rfq kazenco-contact">
      <Image
        className="kazenco-contact-background"
        src="/images/hero/kazenco-refinery-hero.jpg"
        alt=""
        fill
        sizes="(max-width: 1220px) 100vw, 1180px"
      />
      <div className="kazenco-contact-heading">
        <p className="kazenco-section-kicker">{copy.kicker}</p>
        <p>{copy.intro}</p>
      </div>

      <div className="kazenco-contact-details">
        {details.map((detail) => (
          <article key={detail.label}>
            <span>{detail.label}</span>
            {detail.href ? (
              <a href={detail.href}>{detail.value}</a>
            ) : (
              <address>{detail.value}</address>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
