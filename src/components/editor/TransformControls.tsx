"use client";

import React from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import {
  Sliders,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  Sun,
  Contrast,
  Sparkles,
  Maximize2,
} from "lucide-react";

export function TransformControls() {
  const { t } = useTranslation();
  const {
    transform,
    setTransform,
    resetTransform,
    colorFilter,
    setColorFilter,
  } = useSticker();

  const handleRotate90 = () => {
    let next = transform.rotation + 90;
    if (next > 180) next -= 360;
    setTransform({ rotation: next });
  };

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {t("transform.title")}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {t("transform.subtitle")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetTransform}
          className="p-1.5 rounded-full border border-stone-200 dark:border-[#363d47] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#21262d] transition-all"
          title={t("transform.reset")}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Transform Action Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={handleRotate90}
          className="flex flex-col items-center gap-1 p-2 rounded-xl border border-stone-200 dark:border-[#30363d] hover:bg-stone-50 dark:hover:bg-[#1c2128] active:scale-95 text-xs text-stone-700 dark:text-stone-300 transition-all"
          title={t("transform.rotate90")}
        >
          <RotateCw className="w-4 h-4 text-amber-600" />
          <span className="text-[10px]">+90°</span>
        </button>

        <button
          type="button"
          onClick={() => setTransform({ flipH: !transform.flipH })}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
            transform.flipH
              ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold"
              : "border-stone-200 dark:border-[#30363d] text-stone-700 dark:text-stone-300 hover:bg-stone-50"
          }`}
          title={t("transform.flipH")}
        >
          <FlipHorizontal className="w-4 h-4" />
          <span className="text-[10px]">{t("transform.flipHShort")}</span>
        </button>

        <button
          type="button"
          onClick={() => setTransform({ flipV: !transform.flipV })}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
            transform.flipV
              ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold"
              : "border-stone-200 dark:border-[#30363d] text-stone-700 dark:text-stone-300 hover:bg-stone-50"
          }`}
          title={t("transform.flipV")}
        >
          <FlipVertical className="w-4 h-4" />
          <span className="text-[10px]">{t("transform.flipVShort")}</span>
        </button>

        <button
          type="button"
          onClick={() => setTransform({ panX: 0, panY: 0 })}
          className="flex flex-col items-center gap-1 p-2 rounded-xl border border-stone-200 dark:border-[#30363d] hover:bg-stone-50 dark:hover:bg-[#1c2128] active:scale-95 text-xs text-stone-700 dark:text-stone-300 transition-all"
          title={t("transform.center")}
        >
          <Maximize2 className="w-4 h-4 text-stone-500" />
          <span className="text-[10px]">{t("transform.center")}</span>
        </button>
      </div>

      {/* Rotation Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
          <span>{t("transform.rotation")}</span>
          <span className="font-mono text-stone-500">{transform.rotation}°</span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          value={transform.rotation}
          onChange={(e) => setTransform({ rotation: Number(e.target.value) })}
          className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Photo Filters Collapsible / Section */}
      <div className="pt-3 border-t border-stone-100 dark:border-[#21262d] space-y-2.5">
        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
          {t("transform.filters")}
        </span>

        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              {t("transform.brightness")}
            </span>
            <span className="font-mono">{Math.round(colorFilter.brightness * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={1.5}
            step={0.05}
            value={colorFilter.brightness}
            onChange={(e) => setColorFilter({ brightness: Number(e.target.value) })}
            className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5" />
              {t("transform.contrast")}
            </span>
            <span className="font-mono">{Math.round(colorFilter.contrast * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={1.6}
            step={0.05}
            value={colorFilter.contrast}
            onChange={(e) => setColorFilter({ contrast: Number(e.target.value) })}
            className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t("transform.saturation")}
            </span>
            <span className="font-mono">{Math.round(colorFilter.saturation * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.1}
            value={colorFilter.saturation}
            onChange={(e) => setColorFilter({ saturation: Number(e.target.value) })}
            className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
