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

export function ProjectGallery({ images, title, locale, alts }: Props) {
  const copy = DETAIL_COPY[locale].project;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = activeIndex !== null;

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
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const inertedElements: HTMLElement[] = [];

    function handleKeyDown(event: KeyboardEvent) {
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
  }, [isOpen, images.length]);

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

      {activeIndex !== null ? (
        <div
          ref={dialogRef}
          className={styles.lightbox}
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
                (activeIndex - 1 + images.length) % images.length,
              )
            }
            aria-label={previousLabel}
          >
            ←
          </button>

          <div className={styles.fullImage}>
            <Image
              src={images[activeIndex]}
              alt={alts?.[activeIndex] ?? `${title} ${copy[10]} ${activeIndex + 1}`}
              fill
              sizes="100vw"
              priority
            />
          </div>

          <button
            className={styles.next}
            type="button"
            onClick={() =>
              setActiveIndex((activeIndex + 1) % images.length)
            }
            aria-label={nextLabel}
          >
            →
          </button>

          <p>
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
