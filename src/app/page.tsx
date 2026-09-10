"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { MobileNav } from "@/components/common/MobileNav";
import { UploadZone } from "@/components/editor/UploadZone";
import { StickerCanvas } from "@/components/editor/StickerCanvas";
import { BackgroundTools } from "@/components/editor/BackgroundTools";
import { BorderControls } from "@/components/editor/BorderControls";
import { TransformControls } from "@/components/editor/TransformControls";
import { TextOverlay } from "@/components/editor/TextOverlay";
import { StickerTray } from "@/components/editor/StickerTray";
import { ExportModal } from "@/components/export/ExportModal";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import {
  Sliders,
  Scissors,
  Sparkles,
  Type,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { hasImage, activeTab, setActiveTab, savedStickers } = useSticker();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const tabs = [
    { id: "editor" as const, label: t("nav.editor"), icon: Sliders },
    { id: "background" as const, label: t("nav.background"), icon: Scissors },
    { id: "border" as const, label: t("nav.border"), icon: Sparkles },
    { id: "text" as const, label: t("nav.text"), icon: Type },
    { id: "tray" as const, label: t("nav.tray"), icon: Layers, badge: savedStickers.length },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Top Bar Header */}
      <Header onOpenExport={() => setIsExportModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 pb-24 md:pb-8">
        {!hasImage ? (
          <UploadZone />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
            {/* Left Column: 512x512 Canvas Viewport */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center lg:sticky lg:top-20 z-10">
              <StickerCanvas />
            </div>

            {/* Right Column: Controls & Tools */}
            <div className="lg:col-span-5 space-y-4">
              {/* Desktop Pill Tab Navigation Bar */}
              <div className="sticky top-16 z-20 hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/90 dark:bg-[#161b22]/90 backdrop-blur-md border border-stone-200/80 dark:border-[#30363d] shadow-2xs overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-white dark:bg-[#21262d] text-amber-600 dark:text-amber-400 shadow-xs"
                          : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Control Panel */}
              <div className="animate-in fade-in duration-200 space-y-4">
                {activeTab === "editor" && <TransformControls />}
                {activeTab === "background" && <BackgroundTools />}
                {activeTab === "border" && <BorderControls />}
                {activeTab === "text" && <TextOverlay />}
                {activeTab === "tray" && <StickerTray />}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Docked Mobile Bottom Navigation Bar */}
      <MobileNav onOpenExport={() => setIsExportModalOpen(true)} />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
