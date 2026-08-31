import { DeferredContactModal } from "@/components/DeferredContactModal";
import { HeroStack } from "@/components/HeroStack";
import { IncrediblesCursor } from "@/components/IncrediblesCursor";
import { KazencoAbout } from "@/components/KazencoAbout";
import { KazencoClientsSummary } from "@/components/KazencoClientsSummary";
import { KazencoContact } from "@/components/KazencoContact";
import { KazencoCertificatesSummary } from "@/components/KazencoCertificatesSummary";
import { KazencoCapabilities } from "@/components/KazencoCapabilities";
import { KazencoFooter } from "@/components/KazencoFooter";
import { KazencoHeroContent } from "@/components/KazencoHeroContent";
import { KazencoIndustries } from "@/components/KazencoIndustries";
import { KazencoProducts } from "@/components/KazencoProducts";
import { KazencoProjectMap } from "@/components/KazencoProjectMap";
import { KazencoWhy } from "@/components/KazencoWhy";
import { PremiumHeader } from "@/components/PremiumHeader";
import { KazencoV12Portfolio } from "@/components/KazencoV12Portfolio";
import { getLocalizedProjects } from "@/lib/project-translations";
import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";

export function KazencoHome({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale];
  const projects = getLocalizedProjects(locale);
  return (
    <>
      <IncrediblesCursor />
      <a href="#main-content" className="inc-skip">{copy.skip}</a>
      <PremiumHeader />

      <main id="main-content" className="inc-page">
        <HeroStack heroChildren={<KazencoHeroContent locale={locale} />} />


        <KazencoClientsSummary locale={locale} />

        <KazencoCertificatesSummary locale={locale} />

        <KazencoAbout locale={locale} />


        <KazencoWhy locale={locale} />

        <KazencoCapabilities locale={locale} />

        <KazencoProducts locale={locale} />

        <KazencoIndustries locale={locale} />

        <KazencoProjectMap locale={locale} />

        <KazencoV12Portfolio projects={projects} locale={locale} />


        <section className="inc-section inc-faq">
          <div>
            <p className="kazenco-section-kicker">{copy.faq.kicker}</p>
            <h2>{copy.faq.title}</h2>
            <p>
              {copy.faq.intro}{" "}
              <DeferredContactModal
                triggerClassName="cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"
                triggerLabel={copy.faq.contact}
              />
            </p>
          </div>

          <div className="inc-faq-list">
            {copy.faq.items.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>


        <KazencoContact locale={locale} />

      </main>

      <KazencoFooter locale={locale} />
    </>
  );
}
