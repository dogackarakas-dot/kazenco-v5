"use client";

import { lazy, Suspense, useState } from "react";
import type { ContactModalProps } from "@/components/ContactModal";

const ContactModal = lazy(() =>
  import("@/components/ContactModal").then((module) => ({ default: module.ContactModal })),
);

export function DeferredContactModal({ triggerLabel, triggerClassName }: ContactModalProps) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <Suspense fallback={null}>
        <ContactModal triggerLabel={triggerLabel} initialOpen hideTrigger />
      </Suspense>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className={triggerClassName ?? "inline cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"}
    >
      {triggerLabel}
    </button>
  );
}
