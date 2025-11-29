"use client";

import React from "react";
import en from "@/app/locales/en.json";
import id from "@/app/locales/id.json";

type SupportedLang = "en" | "id";

// Dictionary can have nested structure (e.g., { label: { ... }, success: { ... } })
type Dictionary = Record<string, any>;

type LanguageContextValue = {
  lang: SupportedLang;
  dictionary: Dictionary;
  setLang: (lang: SupportedLang) => void;
  t: (key: string) => string;
};

const dictionaries: Record<SupportedLang, Dictionary> = {
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
  const t = React.useCallback((key: string) => {
    // If key doesn't have dot notation, default to "label." prefix for backward compatibility
    const finalKey = key.includes('.') ? key : `label.${key}`;
    
    // Support nested keys with dot notation (e.g., "error.internal_error", "label.dashboard")
    const keys = finalKey.split('.');
    let value: any = dictionary;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return original key if not found
      }
    }
    return typeof value === 'string' ? value : key;
  }, [dictionary]);

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


