"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

const COOKIE_NAME = "zemin_cookie_consent";

function hasConsent() {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));
}

function setConsentCookie() {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=accepted; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function CookieNotice() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setVisible(!hasConsent());
    });
  }, []);

  if (!visible) return null;

  const copy =
    lang === "de"
      ? {
          label: "Cookies",
          body: "Wir nutzen nur notwendige Cookies, damit die Seite zuverlässig funktioniert und deine Auswahl gespeichert bleibt.",
          action: "Verstanden",
        }
      : {
          label: "Cookies",
          body: "We use only essential cookies to keep the site working reliably and remember your choice.",
          action: "Understood",
        };

  function accept() {
    setConsentCookie();
    setVisible(false);
  }

  return (
    <aside
      aria-label={copy.label}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground bg-background px-5 py-4 md:px-6"
    >
      <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
        <span className="display-pressura text-[22px] leading-none md:text-[28px]">
          {copy.label}
        </span>
        <p className="label-mono max-w-4xl text-[12px] leading-relaxed md:text-[13px]">
          {copy.body}
        </p>
        <button
          type="button"
          onClick={accept}
          className="label-mono w-fit border border-foreground px-5 py-2 text-[12px] transition-colors hover:bg-foreground hover:text-background"
        >
          {copy.action} ↗
        </button>
      </div>
    </aside>
  );
}