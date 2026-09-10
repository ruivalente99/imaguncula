"use client";

import React from "react";
import { useTranslation } from "@/locales";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const toggle = () => {
    setLocale(locale === "pt" ? "en" : "pt");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-stone-200/80 dark:border-[#363d47] bg-stone-100/70 dark:bg-[#1c2128] text-[11px] font-mono font-bold uppercase text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-200 active:scale-95"
      aria-label="Alterar idioma"
      title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <Languages className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
      <span>{locale}</span>
    </button>
  );
}
