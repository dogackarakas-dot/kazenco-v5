import Image from "next/image";
import { DeferredAboutModal } from "@/components/DeferredAboutModal";
import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";

export function KazencoAbout({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale].about;
  return (
    <section id="about" className="inc-section inc-proof">
      <div>
        <p className="kazenco-section-kicker">{copy.kicker}</p>
        <h2>{copy.title}</h2>
      </div>

      <blockquote>
        <span>&ldquo;</span>
        <p>
          {copy.text}
        </p>
        <cite>{copy.cite}</cite>
      </blockquote>

      <DeferredAboutModal
        triggerClassName="inc-button inc-button-view inc-showreel"
        triggerLabel={copy.button}
      />

      <aside className="kazenco-affiliate" aria-label={copy.affiliate.label}>
        <p className="kazenco-affiliate-label">{copy.affiliate.label}</p>
        <p>{copy.affiliate.text}</p>
        <a
          href="https://doka.com.tr/en"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.affiliate.ariaLabel}
        >
          <Image
            className="kazenco-affiliate-logo"
            src="/images/brand/doka-logo-main.png"
            alt={copy.affiliate.link}
            width={760}
            height={348}
            sizes="(max-width: 900px) 140px, 152px"
          />
        </a>
      </aside>
    </section>
  );
}
