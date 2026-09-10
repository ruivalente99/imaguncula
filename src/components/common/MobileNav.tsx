"use client";

import React from "react";
import { useTranslation } from "@/locales";
import { useSticker } from "@/context/StickerContext";
import { Sliders, Scissors, Sparkles, Type, Layers, Share2 } from "lucide-react";

interface Props {
  onOpenExport: () => void;
}

export function MobileNav({ onOpenExport }: Props) {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, hasImage, savedStickers } = useSticker();

  const tabs = [
    { id: "editor" as const, label: t("nav.editor"), icon: Sliders },
    { id: "background" as const, label: t("nav.background"), icon: Scissors },
    { id: "border" as const, label: t("nav.border"), icon: Sparkles },
    { id: "text" as const, label: t("nav.text"), icon: Type },
    { id: "tray" as const, label: t("nav.tray"), icon: Layers, badge: savedStickers.length },
  ];

  return (
    <nav className="fixed md:hidden bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-md border-t border-stone-200 dark:border-[#30363d] px-2 py-1 flex items-center justify-around pb-safe shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-xl py-1 px-2 transition-all duration-150 active:scale-95 ${
              isActive
                ? "text-amber-600 dark:text-amber-400 font-bold"
                : "text-stone-500 dark:text-stone-400 font-medium hover:text-stone-700"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? "scale-110" : ""}`} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[9px] font-mono font-bold bg-amber-600 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* Direct Export Action on Mobile */}
      <button
        type="button"
        onClick={onOpenExport}
        disabled={!hasImage}
        className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] rounded-xl py-1 px-2 transition-all duration-150 active:scale-95 ${
          hasImage
            ? "text-amber-700 dark:text-amber-300 font-bold cursor-pointer"
            : "text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-50"
        }`}
      >
        <Share2 className="w-5 h-5" />
        <span className="text-[10px] tracking-tight mt-0.5">{t("nav.export")}</span>
      </button>
    </nav>
  );
}
