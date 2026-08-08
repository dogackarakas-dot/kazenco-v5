"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { KazencoMark } from "@/components/Logo";
import { NAVIGATION, localeFromPathname } from "@/lib/i18n";

const LINKS = [
  { key: "about", hash: "about" },
  { key: "capabilities", hash: "capabilities" },
  { key: "products", hash: "products" },
  { key: "industries", hash: "industries" },
  { key: "projects", hash: "projects" },
  { key: "clients", hash: "clients" },
  { key: "certificates", hash: "certificates" },
  { key: "contact", hash: "contact" },
] as const;

export function PremiumHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = NAVIGATION[locale];
  const homePath = `/${locale}`;
  const isHome = pathname === homePath || pathname === `${homePath}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`inc-header${scrolled ? " kazenco-header-scrolled" : ""}${!isHome ? " kazenco-header-solid" : ""}${menuOpen ? " kazenco-menu-open" : ""}`}
    >
      <div className="kazenco-header-shell">
        <Link href={homePath} className="inc-logo" aria-label={copy.home}>
          <KazencoMark className="inc-logo-mark" />
        </Link>

        <nav
          id="kazenco-main-navigation"
          className={`inc-nav${menuOpen ? " is-open" : ""}`}
          aria-label={copy.navigation}
        >
          <ul>
            {LINKS.map((link) => (
              <li key={link.hash}>
                <a
                  className="kazenco-nav-link"
                  href={`${homePath}#${link.hash}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {copy[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="kazenco-header-actions">
          <LanguageSwitcher />
          <button
            type="button"
            className="kazenco-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="kazenco-main-navigation"
            aria-label={menuOpen ? copy.closeMenu : copy.menu}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
