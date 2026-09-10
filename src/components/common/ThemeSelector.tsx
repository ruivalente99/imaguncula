"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeSelector() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-8 h-8 rounded-full border border-stone-200/80 dark:border-[#363d47] bg-stone-100/70 dark:bg-[#1c2128] text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-200 active:scale-95"
      aria-label="Alternar tema claro / escuro"
      title={resolvedTheme === "dark" ? "Mudar para Claro" : "Mudar para Escuro"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-stone-600 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}
