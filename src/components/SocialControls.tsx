"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ACCESSIBILITY_COPY } from "@/lib/modal-translations";
import {
  CloseIcon,
  MailIcon,
  PlusIcon,
  WhatsAppIcon,
} from "@/components/icons";

const SOCIALS = [
  { label: "Email", href: "mailto:info@kazenco.com", Icon: MailIcon },
  { label: "WhatsApp", href: "https://wa.me/77024316698", Icon: WhatsAppIcon },
];

const BUTTON =
  "flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[18px] bg-card text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background";

export function SocialControls({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const accessibility = ACCESSIBILITY_COPY[locale];

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={
          open ? accessibility.closeSocial : accessibility.openSocial
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${BUTTON} ${
          open ? "bg-foreground text-background hover:bg-foreground/90" : ""
        }`}
      >
        {open ? (
          <CloseIcon className="h-[18px] w-[18px]" />
        ) : (
          <PlusIcon className="h-[18px] w-[18px]" />
        )}
      </button>

      {open &&
        SOCIALS.map(({ label, href, Icon }) => (
          <a key={label} href={href} aria-label={label} className={BUTTON}>
            <Icon className="h-[18px] w-[18px]" />
          </a>
        ))}
    </div>
  );
}
