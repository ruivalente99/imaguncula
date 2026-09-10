"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { useToast } from "@/context/ToastContext";
import { Upload, Camera, Sparkles, Image as ImageIcon } from "lucide-react";

export function UploadZone() {
  const { t } = useTranslation();
  const { loadImageFromFile, loadImageFromUrl, hasImage } = useSticker();
  const { error } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            loadImageFromFile(file).catch(() => error("Erro ao ler imagem colada"));
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [loadImageFromFile, error]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFromFile(file).catch(() => error("Erro ao carregar arquivo de imagem"));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      loadImageFromFile(file).catch(() => error("Erro ao soltar imagem"));
    }
  };

  const samples = [
    { title: t("upload.sample1"), src: "/samples/pet.svg", emoji: "🐶" },
    { title: t("upload.sample2"), src: "/samples/meme.svg", emoji: "😎" },
    { title: t("upload.sample3"), src: "/samples/cat.svg", emoji: "🐱" },
  ];

  if (hasImage) return null;

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-5 animate-in fade-in-50 duration-300">
      {/* Drop area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200 group ${
          isDragging
            ? "border-amber-500 bg-amber-500/10 scale-[1.01]"
            : "border-stone-300 dark:border-[#363d47] bg-white/70 dark:bg-[#161b22]/70 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-stone-50/80 dark:hover:bg-[#1c2128]/80 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-4 border border-amber-300/60 dark:border-amber-500/30">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 text-center">
          {t("upload.title")}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 text-center mt-1 max-w-sm">
          {t("upload.subtitle")}
        </p>

        {/* Buttons inside dropzone */}
        <div className="flex items-center gap-2.5 mt-6" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/25 active:scale-95 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t("upload.cta")}</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-stone-100 dark:bg-[#21262d] text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-[#363d47] hover:bg-stone-200 active:scale-95 transition-all"
          >
            <Camera className="w-4 h-4 text-stone-500" />
            <span>{t("upload.camera")}</span>
          </button>
        </div>
      </div>

      {/* Samples prompt */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t("upload.samplesPrompt")}</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {samples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadImageFromUrl(sample.src)}
              className="flex items-center gap-2 p-2.5 rounded-2xl border border-stone-200/80 dark:border-[#30363d] bg-white dark:bg-[#161b22] hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-sm transition-all duration-150 active:scale-95 group text-left"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{sample.emoji}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
                  {sample.title}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">1-click test</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
