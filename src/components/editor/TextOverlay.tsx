"use client";

import React, { useState } from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { Type, Plus, Trash2, Smile, AlignCenter } from "lucide-react";

export function TextOverlay() {
  const { t } = useTranslation();
  const {
    textOverlays,
    addTextOverlay,
    updateTextOverlay,
    removeTextOverlay,
  } = useSticker();

  const [inputText, setInputText] = useState("");

  const handleAdd = () => {
    addTextOverlay(inputText.trim() || "STICKER!");
    setInputText("");
  };

  const quickEmojis = ["🔥", "😂", "❤️", "✨", "🕶️", "🚀", "💯", "👑", "👀", "🥳", "🐶", "🐱"];

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {t("textOverlay.title")}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {t("textOverlay.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Input + Add button */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t("textOverlay.placeholder")}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-[#30363d] bg-stone-50 dark:bg-[#0d1117] text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white active:scale-95 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("textOverlay.addText")}</span>
        </button>
      </div>

      {/* Quick Emojis Stamps */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1">
          <Smile className="w-3.5 h-3.5 text-amber-500" />
          {t("textOverlay.quickEmojis")}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addTextOverlay(emoji)}
              className="w-8 h-8 rounded-xl border border-stone-200 dark:border-[#30363d] bg-stone-50 dark:bg-[#1c2128] hover:bg-amber-50 dark:hover:bg-[#21262d] text-base flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Existing Overlays List */}
      {textOverlays.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-[#21262d]">
          {textOverlays.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-stone-200/90 dark:border-[#30363d] bg-stone-50/50 dark:bg-[#1c2128]/50 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateTextOverlay(item.id, { text: e.target.value })}
                  className="flex-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117]"
                />
                <button
                  type="button"
                  onClick={() => removeTextOverlay(item.id)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  title={t("textOverlay.delete")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Controls for this text: Font size, Color, Position Y */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-500 block mb-1">
                    {t("textOverlay.size")}: {item.fontSize}px
                  </span>
                  <input
                    type="range"
                    min={18}
                    max={72}
                    value={item.fontSize}
                    onChange={(e) =>
                      updateTextOverlay(item.id, { fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-amber-600 h-1 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <span className="text-stone-500 block mb-1">{t("textOverlay.posY")}</span>
                  <input
                    type="range"
                    min={40}
                    max={480}
                    value={item.y}
                    onChange={(e) => updateTextOverlay(item.id, { y: Number(e.target.value) })}
                    className="w-full accent-amber-600 h-1 bg-stone-200 dark:bg-[#30363d] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Color options */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-500">{t("textOverlay.textColorLabel")}</span>
                  <input
                    type="color"
                    value={item.fillColor}
                    onChange={(e) => updateTextOverlay(item.id, { fillColor: e.target.value })}
                    className="w-6 h-6 rounded-full cursor-pointer p-0 border border-stone-300 overflow-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-500">{t("textOverlay.strokeColorLabel")}</span>
                  <input
                    type="color"
                    value={item.strokeColor}
                    onChange={(e) => updateTextOverlay(item.id, { strokeColor: e.target.value })}
                    className="w-6 h-6 rounded-full cursor-pointer p-0 border border-stone-300 overflow-hidden"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
