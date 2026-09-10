"use client";

import React, { useState, useEffect } from "react";
import { NanoBananaLogo } from "./NanoBananaLogo";
import { ThemeSelector } from "./ThemeSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/locales";
import { useSticker } from "@/context/StickerContext";
import { Share2, Download, Sparkles, Plus, Image as ImageIcon } from "lucide-react";

interface HeaderProps {
  onOpenExport: () => void;
}

export function Header({ onOpenExport }: HeaderProps) {
  const { t } = useTranslation();
  const { hasImage, clearImage, savedStickers } = useSticker();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full overflow-visible border-b border-stone-200/80 dark:border-[#30363d] bg-white/80 dark:bg-[#161b22]/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand logo & title */}
        <div className="flex items-center gap-2.5">
          <NanoBananaLogo size="md" glow />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-bold tracking-tight lowercase text-stone-900 dark:text-stone-100">
                papyrus <span className="text-amber-600 dark:text-amber-400 font-semibold">stickers</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                512×512 WebP
              </span>
            </div>
            <span className="hidden md:inline text-[11px] font-medium text-stone-500 dark:text-stone-400 -mt-0.5">
              {t("app.tagline")}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA install button if available */}
          {deferredPrompt && (
            <button
              onClick={handleInstallPWA}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-[#21262d] text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-[#363d47] hover:border-amber-400 transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t("pwa.install")}</span>
            </button>
          )}

          {/* New / Reset button if image is loaded */}
          {hasImage && (
            <button
              onClick={clearImage}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100/80 dark:bg-[#1c2128] hover:bg-stone-200/80 dark:hover:bg-[#282e37] border border-stone-200/70 dark:border-[#30363d] transition-all duration-150 active:scale-95"
              title={t("upload.changePhoto")}
            >
              <Plus className="w-3.5 h-3.5 rotate-45 text-stone-500" />
              <span className="hidden sm:inline">{t("upload.removePhoto")}</span>
            </button>
          )}

          <LanguageSwitcher />
          <ThemeSelector />

          {/* Main Export Action Button */}
          <button
            onClick={onOpenExport}
            disabled={!hasImage}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs ${
              hasImage
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 hover:shadow-md active:scale-95 cursor-pointer"
                : "bg-stone-200 dark:bg-[#21262d] text-stone-400 dark:text-stone-600 cursor-not-allowed"
            }`}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t("export.title")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
