"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DeferredContactModal } from "@/components/DeferredContactModal";
import { HOME_COPY } from "@/lib/home-translations";
import type { Locale } from "@/lib/i18n";

const CLIENTS = [
  "Fluor",
  "WorleyParsons",
  "Schlumberger",
  "NCOC",
  "TCO",
  "Bonatti",
];

function AnimatedValue({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const duration = 1100;
        const startedAt = performance.now();

        const update = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));

          if (progress < 1) {
            frame = requestAnimationFrame(update);
          }
        };

        frame = requestAnimationFrame(update);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div ref={ref} className="kazenco-v7-stat">
      <strong>
        {display}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export function KazencoHeroContent({ locale = "en" }: { locale?: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = HOME_COPY[locale].hero;

  const stats = useMemo(
    () => [
      { value: 20, suffix: "+", label: copy.stats[0] },
      { value: 17, label: copy.stats[1] },
      { value: 20, label: copy.stats[2] },
    ],
    [copy.stats],
  );

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = rootRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    element.style.setProperty("--hero-x", `${x * 24}px`);
    element.style.setProperty("--hero-y", `${y * 18}px`);
  };

  const onPointerLeave = () => {
    const element = rootRef.current;
    if (!element) return;
    element.style.setProperty("--hero-x", "0px");
    element.style.setProperty("--hero-y", "0px");
  };

  return (
    <div
      ref={rootRef}
      className="kazenco-hero-content kazenco-v7-hero-content"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="kazenco-v7-orbit" aria-hidden="true" />

      <p className="kazenco-hero-eyebrow kazenco-v7-reveal kazenco-v7-delay-1">
        {copy.eyebrow}
      </p>

      <h1 className="kazenco-hero-title kazenco-v8-title">
        <span className="kazenco-v7-reveal kazenco-v7-delay-2">{copy.title[0]}</span>
        <span className="kazenco-v7-reveal kazenco-v7-delay-3">{copy.title[1]}</span>
        <span className="kazenco-v7-reveal kazenco-v7-delay-4">{copy.title[2]}</span>
      </h1>

      <p className="inc-lead kazenco-hero-lead kazenco-v7-reveal kazenco-v7-delay-5">
        {copy.lead}
      </p>

      <div className="kazenco-hero-actions kazenco-v7-reveal kazenco-v7-delay-6">
        <DeferredContactModal
          triggerClassName="kazenco-hero-primary"
          triggerLabel={copy.quote}
        />
        <a href="#projects" className="kazenco-hero-secondary">
          {copy.projects}
        </a>
      </div>

      <div className="kazenco-v7-stats kazenco-v7-reveal kazenco-v7-delay-7">
        {stats.map((stat) => (
          <AnimatedValue key={stat.label} {...stat} />
        ))}
      </div>

      <div className="inc-trusted kazenco-v7-trusted kazenco-v7-reveal kazenco-v7-delay-8">
        <p>{copy.clients}</p>
        <ul>
          {CLIENTS.map((client) => (
            <li key={client}>{client}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
