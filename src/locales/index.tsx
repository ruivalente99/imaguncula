"use client";

import { useState, useEffect, createContext, useContext } from "react";
import pt from "./pt.json";
import en from "./en.json";

export const dictionaries = {
  pt,
  en,
} as const;

export type SupportedLocale = keyof typeof dictionaries;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof pt>;

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, fallback?: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "pt",
  setLocale: () => {},
  t: (key: string) => key,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("papyrus_sticker_locale") as SupportedLocale;
      if (saved && (saved === "pt" || saved === "en")) {
        setLocaleState(saved);
      }
    } catch {
      // ignore storage access issue
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("papyrus_sticker_locale", newLocale);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[locale] || dictionaries.pt;
    const parts = key.split(".");
    let current: any = dict;

    for (const part of parts) {
      if (current === undefined || current === null) break;
      current = current[part];
    }

    if (typeof current === "string") return current;

    // Fallback to pt dictionary if en missing
    if (locale !== "pt") {
      let ptCurrent: any = dictionaries.pt;
      for (const part of parts) {
        if (ptCurrent === undefined || ptCurrent === null) break;
        ptCurrent = ptCurrent[part];
      }
      if (typeof ptCurrent === "string") return ptCurrent;
    }

    return fallback || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LocaleContext);
}
