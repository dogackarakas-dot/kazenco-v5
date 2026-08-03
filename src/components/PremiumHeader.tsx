"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContactModal } from "@/components/ContactModal";
import { KazencoMark } from "@/components/Logo";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Projects", href: "#projects" },
  { label: "Clients", href: "#clients" },
];

export function PremiumHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`inc-header${scrolled ? " kazenco-header-scrolled" : ""}`}>
      <div className="kazenco-header-shell">
        <Link href="/" className="inc-logo" aria-label="KAZENCO Home">
          <KazencoMark className="inc-logo-mark" />
        </Link>

        <nav className="inc-nav" aria-label="Main navigation">
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a className="kazenco-nav-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <ContactModal
                triggerClassName="inc-button inc-button-conversation"
                triggerLabel="Request a quotation"
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
