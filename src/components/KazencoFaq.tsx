"use client";

import { DeferredContactModal } from "@/components/DeferredContactModal";
import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function KazencoFaq({ locale = "en" }: { locale?: Locale }) {
  const copy = HOME_COPY[locale];
  const headRef = useScrollReveal<HTMLDivElement>();
  const listRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="inc-section inc-faq">
      <div ref={headRef} className="kazenco-v7-reveal-onscroll">
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

      <div ref={listRef} className="inc-faq-list">
        {copy.faq.items.map(([question, answer], index) => (
          <details
            key={question}
            className={`kazenco-v7-reveal-onscroll kazenco-v7-delay-${index + 1}`}
          >
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
