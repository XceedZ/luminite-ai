"use client";

import React from "react";
import en from "@/app/locales/en.json";
import id from "@/app/locales/id.json";

type SupportedLang = "en" | "id";

type LanguageContextValue = {
  lang: SupportedLang;
  dictionary: Record<string, string>;
  setLang: (lang: SupportedLang) => void;
  t: (key: string) => string;
};

const dictionaries: Record<SupportedLang, Record<string, string>> = {
  en,
  id,
};

const LanguageContext = React.createContext<LanguageContextValue | undefined>(
  undefined
);

function getInitialLang(defaultLang: SupportedLang = "en"): SupportedLang {
  if (typeof document !== "undefined") {
    const cookieMatch = document.cookie.match(/(?:^|; )lang=([^;]+)/);
    const cookieLang = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    const storedLang = (localStorage.getItem("lang") as SupportedLang | null) || cookieLang;
    if (storedLang === "en" || storedLang === "id") return storedLang;
  }
  return defaultLang;
}

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang?: SupportedLang;
}) {
  const [lang, setLangState] = React.useState<SupportedLang>(initialLang);

  React.useEffect(() => {
    // On mount, reconcile with persisted preference
    const persisted = getInitialLang(initialLang);
    if (persisted !== lang) {
      setLangState(persisted);
    }
    // Ensure <html lang> reflects the chosen language
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", persisted);
    }
  }, []);

  const setLang = React.useCallback((next: SupportedLang) => {
    setLangState(next);
    try {
      if (typeof document !== "undefined") {
        document.cookie = `lang=${encodeURIComponent(next)}; path=/; max-age=${60 * 60 * 24 * 365}`;
        localStorage.setItem("lang", next);
        document.documentElement.setAttribute("lang", next);
      }
    } catch {}
  }, []);

  const dictionary = dictionaries[lang] ?? dictionaries.en;
  const t = React.useCallback((key: string) => dictionary[key] || key, [dictionary]);

  const value: LanguageContextValue = React.useMemo(
    () => ({ lang, dictionary, setLang, t }),
    [lang, dictionary, setLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}


