"use client";

import { lazy, Suspense, useState } from "react";
import type { AboutModalProps } from "@/components/AboutModal";

const AboutModal = lazy(() =>
  import("@/components/AboutModal").then((module) => ({ default: module.AboutModal })),
);

export function DeferredAboutModal({ triggerLabel, triggerClassName }: AboutModalProps) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <Suspense fallback={null}>
        <AboutModal triggerLabel={triggerLabel} initialOpen hideTrigger />
      </Suspense>
    );
  }

  return (
    <button type="button" onClick={() => setActivated(true)} className={triggerClassName}>
      <span className="inc-button-text" aria-hidden="true">
        <span>{triggerLabel}</span><span>{triggerLabel}</span><span>{triggerLabel}</span>
      </span>
      <span className="sr-only">{triggerLabel}</span>
    </button>
  );
}
