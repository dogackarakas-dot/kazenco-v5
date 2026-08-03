"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DICT, type Lang } from "@/lib/site";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (typeof DICT)[Lang];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem("zemin-lang");
      if (stored === "en" || stored === "de") {
        setLang(stored);
        return;
      }

      const browserLang = window.navigator.language.toLowerCase();
      setLang(browserLang.startsWith("de") ? "de" : "en");
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("zemin-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggle: () => setLang((prev) => (prev === "en" ? "de" : "en")),
    t: DICT[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
