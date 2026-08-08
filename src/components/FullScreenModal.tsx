"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons";

export type ModalPhase = "entering" | "open" | "exiting";

interface FullScreenModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  /** Render prop so content can key its own entrance stagger off the panel's phase. */
  children: (phase: ModalPhase) => ReactNode;
}

const DURATION_MS = 820;
const CLIP_CLOSED = "inset(100% 20% 0% 20% round 24px)";
const CLIP_OPEN = "inset(0% 0% 0% 0% round 0px)";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Full-screen, viewport-covering modal shell: opens via a clip-path reveal
 * from a small bottom-center sliver, locks background scroll (restoring the
 * exact position on close), traps focus, and closes on Escape or the close
 * button. Content is passed as children — this component only owns the
 * chrome, animation and accessibility plumbing.
 */
export function FullScreenModal({
  open,
  onClose,
  labelledBy,
  closeLabel,
  children,
}: FullScreenModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<ModalPhase>("entering");
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounting/animating in response to the `open` prop is the actual side effect here, not incidental state sync
    setMounted(true);
    setPhase("entering");

    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    const main = document.getElementById("main-content");
    main?.setAttribute("inert", "");
    main?.setAttribute("aria-hidden", "true");

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setPhase("open");
        panelRef.current?.focus();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return undefined;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts the exit animation in response to the `open` prop flipping false
    setPhase("exiting");
    const timeout = window.setTimeout(
      () => {
        setMounted(false);

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        // `html` has `scroll-behavior: smooth` globally (for anchor nav), so
        // a plain scrollTo here would visibly glide from the top back down
        // to scrollYRef instead of landing instantly — "instant" opts this
        // one restore out of that.
        window.scrollTo({ top: scrollYRef.current, left: 0, behavior: "instant" });

        const main = document.getElementById("main-content");
        main?.removeAttribute("inert");
        main?.removeAttribute("aria-hidden");

        previouslyFocused.current?.focus();
      },
      prefersReducedMotion() ? 0 : DURATION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  const reduced = prefersReducedMotion();
  const clipPath = reduced ? CLIP_OPEN : phase === "open" ? CLIP_OPEN : CLIP_CLOSED;

  // Portalled straight to <body> rather than rendered in place: this modal
  // is triggered from deep inside `#main-content`, and marking that element
  // `inert` while open (so background content can't be tabbed/clicked into)
  // was making the modal *itself* inert too — including its own close
  // button — since it was a DOM descendant of the thing being switched off,
  // no matter how high its `position: fixed` z-index was visually.
  return createPortal(
    <div className="fixed inset-0 z-[1000] h-dvh w-screen bg-foreground/25">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="absolute inset-3 overflow-hidden rounded-2xl bg-[#FAFAFA] outline-none transition-[clip-path] duration-[820ms] ease-[cubic-bezier(0.76,0,0.24,1)] sm:inset-6 sm:rounded-[24px]"
        style={{ clipPath }}
        data-phase={phase}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-transform duration-300 hover:rotate-90 hover:scale-110 sm:right-12 sm:top-12"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>

        <div
          className="h-full overflow-y-auto overscroll-contain px-4 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-20"
          data-lenis-prevent
        >
          {children(phase)}
        </div>
      </div>
    </div>,
    document.body,
  );
}
