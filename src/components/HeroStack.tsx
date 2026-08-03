"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Project } from "@/types/project";

interface HeroStackProps {
  /** Hero content (h1 / lead / trusted-by row) — rendered inside the curtain layer. */
  heroChildren: ReactNode;
  heading: string;
  text: string;
  projects: Project[];
}

/** How many cards back a receded card keeps shrinking/lifting before it just holds still. */
const MAX_STACK_DEPTH = 3;
const RECEDE_TRANSLATE_PER_LEVEL = 3; // %
const RECEDE_SCALE_PER_LEVEL = 0.03;

/** Scroll budget for the pinned heading+cards layer, in "vh" units. */
const HEADING_REVEAL_VH = 55;
const CARD_VH = 100;
const SETTLE_VH = 45; // hold time after the last card before the section releases

/**
 * Hero-to-stack scroll sequence:
 *  1. Hero scrolls up at normal speed while its own content lags behind it
 *     (parallax), like it's briefly hanging inside the section.
 *  2. Hero is opaque + overflow:hidden, so it acts as a curtain physically
 *     covering the "Real projects" heading as it scrolls off normally.
 *  3. The heading+cards layer is plain CSS `position: sticky` — the same
 *     technique used for the hero curtain itself — so it engages and (later)
 *     releases exactly at its container's edges with zero hand-rolled
 *     timing math. GSAP only drives the *content* inside it (the heading's
 *     settle-in and each card's transform); it never touches the pin/release
 *     mechanics, which is what kept drifting out of sync with the real
 *     document flow and either overlapping the next section or cutting to it
 *     abruptly.
 *  4. Each card slides up into place, then — as the *next* card starts its
 *     own entrance — recedes slightly (small negative translateY + scale
 *     down a few percent) while staying fully opaque, so it keeps peeking
 *     out as a thin stacked layer behind the new card instead of just
 *     vanishing under it.
 * Driven entirely by GSAP ScrollTrigger with scrub, so it's fully reversible.
 *
 * Under prefers-reduced-motion the DOM tree is never swapped (only one tree
 * is ever rendered — GSAP just doesn't touch it): unmounting the GSAP-
 * controlled subtree once reduced-motion is detected a tick later caused a
 * `removeChild` crash. Instead, a class on the root switches the pinned
 * layer back to plain static flow via CSS, and the effect below simply
 * never runs GSAP at all when reduced motion is on.
 */
export function HeroStack({ heroChildren, heading, text, projects }: HeroStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Lazy-initialized (not read in an effect) so the very first client render
  // already knows whether to run GSAP at all, instead of briefly mounting it
  // and tearing it down again.
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const heroEl = heroRef.current;
    const heroInner = heroInnerRef.current;
    const cardsWrapEl = cardsWrapRef.current;
    const headingEl = headingRef.current;
    if (!heroEl || !heroInner || !cardsWrapEl || !headingEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero's own box scrolls at normal (1:1) speed since it's plain in-flow
      // content, clipped by `overflow: hidden`. Its content is dragged down
      // (lagging) as it goes, for a parallax "hang" — but since hero itself
      // is what does the clipping, dragging content down by too much can
      // shove the last bit of content (the trusted-by row) past the box's
      // own bottom edge before it ever gets a turn on screen, effectively
      // losing it. Cap the lag to the actual spare room below the content
      // (the bottom padding) minus a safety buffer, so nothing ever clips.
      const heroRect = heroEl.getBoundingClientRect();
      const innerRect = heroInner.getBoundingClientRect();
      const spareMargin = Math.max(0, heroRect.bottom - innerRect.bottom - 24);
      const maxLag = Math.min(heroEl.offsetHeight * 0.32, spareMargin);

      const parallax = gsap.fromTo(
        heroInner,
        { y: 0 },
        {
          y: maxLag,
          ease: "none",
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );

      const updateCards = (cardsProgress: number) => {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const local = cardsProgress - index; // this card's own entrance progress

          if (local < 0) {
            card.style.transform = "translate(-50%, -50%) translateY(70%) scale(0.92)";
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
            return;
          }

          const entranceT = Math.min(local, 1);
          const eased = 1 - Math.pow(1 - entranceT, 3); // ease-out cubic
          const baseTranslateY = 70 * (1 - eased);
          const baseScale = 0.92 + 0.08 * eased;

          // How many cards behind the current one this card is — fractional
          // while the very next card is still sliding in, so the recede
          // and the next card's entrance read as one connected motion.
          const depth = Math.min(Math.max(0, cardsProgress - (index + 1)), MAX_STACK_DEPTH);
          const recedeT = Math.min(depth, 1);
          const extraLevels = Math.max(0, depth - 1);
          const recedeLevels = recedeT + extraLevels;

          const translateY = baseTranslateY - recedeLevels * RECEDE_TRANSLATE_PER_LEVEL;
          const scale = baseScale * (1 - recedeLevels * RECEDE_SCALE_PER_LEVEL);

          card.style.transform = `translate(-50%, -50%) translateY(${translateY}%) scale(${scale})`;
          card.style.opacity = "1"; // never faded — recede is transform-only
          card.style.pointerEvents = depth < 0.5 ? "auto" : "none";
        });
      };

      const totalVh = HEADING_REVEAL_VH + projects.length * CARD_VH + SETTLE_VH;
      const headingFraction = HEADING_REVEAL_VH / totalVh;
      const cardsFraction = (projects.length * CARD_VH) / totalVh;

      const reveal = ScrollTrigger.create({
        trigger: cardsWrapEl,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          if (self.progress <= headingFraction) {
            // Curtain-reveal phase: heading settles from a slight offset into
            // place right as the sticky layer engages; always fully opaque.
            const t = headingFraction > 0 ? self.progress / headingFraction : 1;
            headingEl.style.transform = `translateX(-50%) translateY(${22 * (1 - t)}vh)`;
            cardRefs.current.forEach((card) => {
              if (!card) return;
              card.style.opacity = "0";
              card.style.pointerEvents = "none";
            });
            return;
          }

          headingEl.style.transform = "translateX(-50%) translateY(0)";
          const cardsT = cardsFraction > 0 ? Math.min(1, (self.progress - headingFraction) / cardsFraction) : 1;
          updateCards(cardsT * projects.length);
        },
      });

      return () => {
        parallax.scrollTrigger?.kill();
        parallax.kill();
        reveal.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [projects.length, reducedMotion]);

  return (
    <div ref={rootRef} className={reducedMotion ? "inc-stack inc-stack-reduced" : "inc-stack"}>
      <section ref={heroRef} className="inc-hero">
        <div ref={heroInnerRef} className="inc-hero-inner">
          {heroChildren}
        </div>
      </section>

      <div
        ref={cardsWrapRef}
        className="inc-stack-cards-wrap"
        style={reducedMotion ? undefined : { height: `${(HEADING_REVEAL_VH + projects.length * CARD_VH + SETTLE_VH)}svh` }}
      >
        <div className="inc-stack-pin">
          <div ref={headingRef} className="inc-stack-heading">
            <h2>{heading}</h2>
            <p>{text}</p>
          </div>

          {projects.map((project, index) => (
            <Link
              key={project.slug}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              href={`/project/${project.slug}`}
              className="inc-stack-card"
              style={reducedMotion ? undefined : { zIndex: index, opacity: 0, pointerEvents: "none" }}
            >
              <div className="inc-stack-media">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="inc-stack-content">
                <h3>{project.title}</h3>
                <p>{project.location} · {project.role}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
