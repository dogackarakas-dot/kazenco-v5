"use client";

import { useEffect, useRef } from "react";

// Longest possible reveal: the last stagger delay (.kazenco-v7-delay-8 =
// 780ms) plus the 850ms keyframe duration, with a small buffer.
const MAX_REVEAL_MS = 1700;

/**
 * Adds `kazenco-v7-in-view` to the returned ref's element the first time it
 * scrolls into the viewport, then disconnects. Pair with the
 * `.kazenco-v7-reveal-onscroll` CSS class (see globals.css) on the same
 * element (single reveal) or on its direct children (staggered grid reveal).
 *
 * Once the entrance animation has had time to finish, the reveal classes are
 * stripped from the element (and any direct children that carried them).
 * `animation-fill-mode: forwards` holds the animated `transform` value with
 * higher cascade priority than ordinary `:hover`/`:active` rules for as long
 * as the animation stays attached — without this cleanup, cards that use
 * this hook would permanently lose their existing hover-lift and any new
 * press-feedback `transform` after their one-time reveal.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const clearReveal = () => {
      element.classList.remove("kazenco-v7-in-view", "kazenco-v7-reveal-onscroll");
      element.querySelectorAll(":scope > .kazenco-v7-reveal-onscroll").forEach((child) => {
        child.classList.remove("kazenco-v7-reveal-onscroll");
      });
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      clearReveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          element.classList.add("kazenco-v7-in-view");
          observer.disconnect();
          window.setTimeout(clearReveal, MAX_REVEAL_MS);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
