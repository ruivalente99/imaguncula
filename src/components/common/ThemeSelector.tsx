"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/locales";
import { ThemeSelector as BibliothecaThemeSelector } from "@ruivalente99/bibliotheca/ui";

export function ThemeSelector() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <BibliothecaThemeSelector
      variant="toggle"
      resolvedTheme={resolvedTheme}
      onThemeChange={toggleTheme}
      labels={{
        ariaLabel: t("theme.toggle"),
        toggleTitle: resolvedTheme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark"),
      }}
    />
  );
}
