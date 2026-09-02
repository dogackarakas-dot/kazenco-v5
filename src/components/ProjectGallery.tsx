"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { DETAIL_COPY } from "@/lib/detail-translations";
import styles from "./ProjectGallery.module.css";

type Props = {
  images: string[];
  title: string;
  locale: Locale;
  alts?: string[];
};

type LightboxPhase = "entering" | "open" | "exiting";
const EXIT_DURATION_MS = 280; // matches .fullImage's transition duration, the longer of the two

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ProjectGallery({ images, title, locale, alts }: Props) {
  const copy = DETAIL_COPY[locale].project;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = activeIndex !== null;

  const [displayIndex, setDisplayIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<LightboxPhase>("entering");

  useEffect(() => {
    if (activeIndex !== null) setDisplayIndex(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    setMounted(true);
    setPhase("entering");
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setPhase("open");
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || !mounted) return;
    setPhase("exiting");
    const timeout = window.setTimeout(
      () => setMounted(false),
      prefersReducedMotion() ? 0 : EXIT_DURATION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [isOpen, mounted]);

  const closeLabel =
    locale === "ru"
      ? "Закрыть галерею"
      : locale === "tr"
        ? "Galeriyi kapat"
        : locale === "kz"
          ? "Галереяны жабу"
          : "Close gallery";

  const previousLabel =
    locale === "ru"
      ? "Предыдущее изображение"
      : locale === "tr"
        ? "Önceki görsel"
        : locale === "kz"
          ? "Алдыңғы сурет"
          : "Previous image";

  const nextLabel =
    locale === "ru"
      ? "Следующее изображение"
      : locale === "tr"
        ? "Sonraki görsel"
        : locale === "kz"
          ? "Келесі сурет"
          : "Next image";

  useEffect(() => {
    if (!mounted) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const inertedElements: HTMLElement[] = [];

    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? 0
            : (current - 1 + images.length) % images.length,
        );
      }

      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );

        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    let activeBranch: HTMLElement | null = dialogRef.current;

    while (activeBranch?.parentElement) {
      for (const sibling of activeBranch.parentElement.children) {
        if (
          sibling !== activeBranch &&
          sibling instanceof HTMLElement &&
          !sibling.inert
        ) {
          sibling.inert = true;
          inertedElements.push(sibling);
        }
      }

      activeBranch = activeBranch.parentElement;
    }

    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);

      inertedElements.forEach((element) => {
        element.inert = false;
      });

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [mounted, images.length]);

  return (
    <>
      <div className={styles.grid} aria-label={`${title} ${copy[10]}`}>
        {images.map((image, index) => (
          <button
            type="button"
            onClick={() => setActiveIndex(index)}
            key={image}
          >
            <Image
              src={image}
              alt={alts?.[index] ?? `${title} ${copy[10]} ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {mounted ? (
        <div
          ref={dialogRef}
          className={styles.lightbox}
          data-phase={prefersReducedMotion() ? "open" : phase}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} ${copy[10]}`}
        >
          <button
            ref={closeRef}
            className={styles.close}
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label={closeLabel}
          >
            ×
          </button>

          <button
            className={styles.previous}
            type="button"
            onClick={() =>
              setActiveIndex(
                (displayIndex - 1 + images.length) % images.length,
              )
            }
            aria-label={previousLabel}
          >
            ←
          </button>

          <div className={styles.fullImage}>
            <Image
              src={images[displayIndex]}
              alt={alts?.[displayIndex] ?? `${title} ${copy[10]} ${displayIndex + 1}`}
              fill
              sizes="100vw"
              priority
            />
          </div>

          <button
            className={styles.next}
            type="button"
            onClick={() =>
              setActiveIndex((displayIndex + 1) % images.length)
            }
            aria-label={nextLabel}
          >
            →
          </button>

          <p>
            {displayIndex + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
