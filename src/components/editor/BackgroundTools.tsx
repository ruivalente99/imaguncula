"use client";

import React, { useState } from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { useToast } from "@/context/ToastContext";
import {
  Scissors,
  Wand2,
  Paintbrush,
  Shapes,
  RotateCcw,
  Undo2,
  Sparkles,
  Circle,
  Square,
  Heart,
  Star,
  Maximize,
} from "lucide-react";
import { CutoutShape } from "@/types/sticker";

export function BackgroundTools() {
  const { t } = useTranslation();
  const { success } = useToast();
  const {
    applyAutoCutout,
    resetBgMask,
    undoBgAction,
    canUndo,
    brushSize,
    setBrushSize,
    brushMode,
    setBrushMode,
    wandTolerance,
    setWandTolerance,
    wandFeather,
    setWandFeather,
    wandContiguous,
    setWandContiguous,
    cutoutShape,
    setCutoutShape,
    bgTool,
    setBgTool,
  } = useSticker();

  const handleAuto = () => {
    applyAutoCutout();
    success(t("bg.autoSuccess"));
  };

  const shapes: { id: CutoutShape; label: string; icon: any }[] = [
    { id: "free", label: t("shapes.free"), icon: Maximize },
    { id: "circle", label: t("shapes.circle"), icon: Circle },
    { id: "squircle", label: t("shapes.squircle"), icon: Square },
    { id: "heart", label: t("shapes.heart"), icon: Heart },
    { id: "star", label: t("shapes.star"), icon: Star },
  ];

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {t("bg.title")}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {t("bg.subtitle")}
            </p>
          </div>
        </div>

        {/* Undo / Reset Actions */}
        <div className="flex items-center gap-1.5">
          {canUndo && (
            <button
              type="button"
              onClick={undoBgAction}
              className="p-1.5 rounded-full border border-stone-200 dark:border-[#363d47] text-stone-600 hover:bg-stone-100 dark:hover:bg-[#21262d] transition-all"
              title={t("bg.undo")}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={resetBgMask}
            className="p-1.5 rounded-full border border-stone-200 dark:border-[#363d47] text-stone-600 hover:bg-stone-100 dark:hover:bg-[#21262d] transition-all"
            title={t("bg.resetMask")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1-Click Auto Cutout Banner */}
      <button
        type="button"
        onClick={handleAuto}
        className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/5 dark:from-amber-950/40 dark:to-[#161b22] border border-amber-300/80 dark:border-amber-700/60 text-left hover:border-amber-500 transition-all active:scale-[0.99] group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/30 group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
              {t("bg.autoCutout")}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400">
              {t("bg.autoCutoutDesc")}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/20">
          {t("bg.autoBadge")}
        </span>
      </button>

      {/* Sub-tabs for tools */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-stone-100 dark:bg-[#0d1117] border border-stone-200/80 dark:border-[#30363d]">
        <button
          type="button"
          onClick={() => setBgTool("wand")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            bgTool === "wand"
              ? "bg-white dark:bg-[#21262d] text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{t("bg.wandTab")}</span>
        </button>

        <button
          type="button"
          onClick={() => setBgTool("brush")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            bgTool === "brush"
              ? "bg-white dark:bg-[#21262d] text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>{t("bg.eraseTab")}</span>
        </button>

        <button
          type="button"
          onClick={() => setBgTool("shapes")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            bgTool === "shapes"
              ? "bg-white dark:bg-[#21262d] text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          }`}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>{t("bg.shapesTab")}</span>
        </button>
      </div>

      {/* Subtab 1: Magic Wand Settings */}
      {bgTool === "wand" && (
        <div className="space-y-3 pt-1 animate-in fade-in-50 duration-150">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-300/50 dark:border-amber-700/30 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t("bg.clickPrompt")}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
              <span>{t("bg.tolerance")}</span>
              <span className="font-mono text-stone-500">{wandTolerance}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              value={wandTolerance}
              onChange={(e) => setWandTolerance(Number(e.target.value))}
              className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
              <span>{t("bg.feather")}</span>
              <span className="font-mono text-stone-500">{wandFeather}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              value={wandFeather}
              onChange={(e) => setWandFeather(Number(e.target.value))}
              className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Contiguous Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
              {t("bg.contiguous")}
            </span>
            <button
              type="button"
              onClick={() => setWandContiguous(!wandContiguous)}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                wandContiguous ? "bg-amber-600" : "bg-stone-300 dark:bg-[#30363d]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  wandContiguous ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Subtab 2: Brush & Eraser */}
      {bgTool === "brush" && (
        <div className="space-y-3 pt-1 animate-in fade-in-50 duration-150">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBrushMode("erase")}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                brushMode === "erase"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                  : "border-stone-200 dark:border-[#30363d] text-stone-600 dark:text-stone-400"
              }`}
            >
              {t("bg.modeErase")}
            </button>
            <button
              type="button"
              onClick={() => setBrushMode("restore")}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                brushMode === "restore"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "border-stone-200 dark:border-[#30363d] text-stone-600 dark:text-stone-400"
              }`}
            >
              {t("bg.modeRestore")}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
              <span>{t("bg.brushSize")}</span>
              <span className="font-mono text-stone-500">{brushSize}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={60}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-amber-600 h-1.5 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Subtab 3: Quick Shapes Cutout */}
      {bgTool === "shapes" && (
        <div className="grid grid-cols-5 gap-1.5 pt-1 animate-in fade-in-50 duration-150">
          {shapes.map((s) => {
            const Icon = s.icon;
            const isSelected = cutoutShape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCutoutShape(s.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold"
                    : "border-stone-200 dark:border-[#30363d] text-stone-600 dark:text-stone-400 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] truncate max-w-full">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
