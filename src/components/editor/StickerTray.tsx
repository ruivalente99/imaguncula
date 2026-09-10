"use client";

import React from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { useToast } from "@/context/ToastContext";
import { exportStickersZip } from "@/lib/zip-export";
import { Layers, Download, Trash2, PackagePlus, FileArchive } from "lucide-react";

export function StickerTray() {
  const { t } = useTranslation();
  const { savedStickers, removeFromPack, clearPack } = useSticker();
  const { success } = useToast();

  const handleDownloadZip = async () => {
    if (savedStickers.length === 0) return;
    await exportStickersZip(savedStickers);
    success("Pacote ZIP baixado com sucesso!");
  };

  const handleClear = () => {
    if (window.confirm(t("tray.confirmClear"))) {
      clearPack();
      success("Pacote limpo!");
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {t("tray.title")}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {savedStickers.length} {t("tray.itemCount")}
            </p>
          </div>
        </div>

        {savedStickers.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
            title={t("tray.clearAll")}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Empty State */}
      {savedStickers.length === 0 ? (
        <div className="py-8 text-center space-y-2 border border-dashed border-stone-200 dark:border-[#30363d] rounded-2xl p-4">
          <PackagePlus className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            {t("tray.empty")}
          </p>
          <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
            {t("tray.emptyPrompt")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Download Zip Action Banner */}
          <button
            type="button"
            onClick={handleDownloadZip}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm shadow-amber-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <FileArchive className="w-4 h-4" />
            <span>{t("tray.downloadZip")}</span>
          </button>

          {/* Grid of saved stickers */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {savedStickers.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center p-2 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-stone-50/70 dark:bg-[#1c2128] hover:border-amber-400 transition-all"
              >
                {/* Checkerboard preview bg */}
                <div
                  className="w-full aspect-square rounded-xl overflow-hidden relative flex items-center justify-center border border-stone-200/60 dark:border-stone-700/60 shadow-2xs"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)",
                    backgroundSize: "12px 12px",
                  }}
                >
                  <img
                    src={item.thumbnailDataUrl}
                    alt={item.title}
                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="w-full mt-1.5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-stone-500 truncate">
                    {(item.fileSizeBytes / 1024).toFixed(1)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromPack(item.id)}
                    className="p-1 rounded-full text-stone-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Remover"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
