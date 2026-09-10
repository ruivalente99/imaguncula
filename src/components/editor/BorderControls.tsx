"use client";

import React from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { Sparkles, SunMedium, Check, SlidersHorizontal } from "lucide-react";

export function BorderControls() {
  const { t } = useTranslation();
  const { border, setBorder } = useSticker();

  const widthPresets = [
    { label: t("border.presets.thin"), val: 6 },
    { label: t("border.presets.medium"), val: 14 },
    { label: t("border.presets.bold"), val: 22 },
    { label: t("border.presets.extra"), val: 30 },
  ];

  const colorPresets = [
    { name: t("border.colorWhite"), hex: "#ffffff" },
    { name: t("border.colorAmber"), hex: "#b45309" },
    { name: t("border.colorNeon"), hex: "#22c55e" },
    { name: "Yellow", hex: "#facc15" },
    { name: t("border.colorBlack"), hex: "#000000" },
  ];

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {t("border.title")}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {t("border.subtitle")}
            </p>
          </div>
        </div>

        {/* Status pill */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
            border.enabled
              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50"
              : "bg-stone-100 dark:bg-[#21262d] text-stone-500"
          }`}
        >
          {border.enabled ? t("border.withBorder") : t("border.withoutBorder")}
        </span>
      </div>

      {/* Main Switch: Com Borda / Sem Borda */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 dark:bg-[#0d1117] border border-stone-200/80 dark:border-[#30363d]">
        <button
          type="button"
          onClick={() => setBorder({ enabled: true, width: border.width === 0 ? 14 : border.width })}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
            border.enabled
              ? "bg-white dark:bg-[#21262d] text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("border.withBorder")}</span>
        </button>

        <button
          type="button"
          onClick={() => setBorder({ enabled: false })}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
            !border.enabled
              ? "bg-white dark:bg-[#21262d] text-stone-900 dark:text-stone-100 shadow-xs"
              : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          <span>{t("border.withoutBorder")}</span>
        </button>
      </div>

      {/* Border Customization when enabled */}
      {border.enabled && (
        <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
          {/* Width Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>{t("border.width")}</span>
              <span className="font-mono text-stone-500">{border.width}px</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {widthPresets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setBorder({ width: p.val })}
                  className={`py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    border.width === p.val
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold"
                      : "border-stone-200 dark:border-[#30363d] text-stone-600 dark:text-stone-400 hover:bg-stone-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min={2}
              max={36}
              value={border.width}
              onChange={(e) => setBorder({ width: Number(e.target.value) })}
              className="w-full accent-amber-600 dark:accent-amber-400 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>

          {/* Border Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {t("border.color")}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorPresets.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setBorder({ color: c.hex })}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${
                    border.color.toLowerCase() === c.hex.toLowerCase()
                      ? "border-amber-600 dark:border-amber-400 scale-110 shadow-sm"
                      : "border-stone-300 dark:border-stone-600 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {border.color.toLowerCase() === c.hex.toLowerCase() && (
                    <Check
                      className={`w-4 h-4 ${
                        c.hex === "#ffffff" ? "text-stone-900" : "text-white"
                      }`}
                    />
                  )}
                </button>
              ))}

              {/* Custom Color Input */}
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={border.color}
                  onChange={(e) => setBorder({ color: e.target.value })}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-stone-300 dark:border-stone-600 p-0 overflow-hidden bg-transparent"
                  title="Cor personalizada"
                />
              </div>
            </div>
          </div>

          {/* 3D Pop Shadow */}
          <div className="pt-2 border-t border-stone-100 dark:border-[#21262d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-stone-400" />
              <div>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                  {t("border.shadowTitle")}
                </span>
                <span className="text-[10px] text-stone-500">
                  {t("border.enableShadow")}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBorder({ shadowEnabled: !border.shadowEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                border.shadowEnabled ? "bg-amber-600" : "bg-stone-200 dark:bg-[#30363d]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  border.shadowEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
