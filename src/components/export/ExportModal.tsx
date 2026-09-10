"use client";

import React, { useState, useEffect } from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { useToast } from "@/context/ToastContext";
import { compositeFullSticker } from "@/lib/canvas-utils";
import {
  encodeWhatsAppWebP,
  encodeTransparentPNG,
  copyImageToClipboard,
  shareFileNative,
  triggerFileDownload,
  ExportResult,
} from "@/lib/webp-encoder";
import { copyAndLaunchWhatsApp } from "@/lib/whatsapp-direct";
import { downloadWastickersPack, shareWastickersPack } from "@/lib/wastickers-export";
import { WhatsAppGuide } from "./WhatsAppGuide";
import {
  X,
  Share2,
  Copy,
  Download,
  Check,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  MessageCircle,
  PackageOpen,
  Info,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const { success, error, info } = useToast();
  const {
    processedCanvas,
    canvasVersion,
    border,
    transform,
    cutoutShape,
    colorFilter,
    textOverlays,
    saveToPack,
  } = useSticker();

  const [webpResult, setWebpResult] = useState<ExportResult | null>(null);
  const [pngResult, setPngResult] = useState<ExportResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [hasSavedPack, setHasSavedPack] = useState(false);

  // Generate WebP and PNG results whenever modal opens
  useEffect(() => {
    if (!isOpen || !processedCanvas) return;

    let isMounted = true;
    setIsGenerating(true);
    setHasCopied(false);
    setHasSavedPack(false);

    const generateOutputs = async () => {
      // 1. Create a clean 512x512 canvas for export
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 512;
      exportCanvas.height = 512;
      const ctx = exportCanvas.getContext("2d", { willReadFrequently: true })!;

      compositeFullSticker({
        targetCtx: ctx,
        width: 512,
        height: 512,
        image: processedCanvas,
        border,
        transform,
        cutoutShape,
        colorFilter,
        textOverlays,
        safetyPadding: 16,
      });

      // 2. Encode to WebP (< 100 KB) and PNG
      const webp = await encodeWhatsAppWebP(exportCanvas);
      const png = await encodeTransparentPNG(exportCanvas);

      if (isMounted) {
        setWebpResult(webp);
        setPngResult(png);
        setIsGenerating(false);
      }
    };

    generateOutputs();

    return () => {
      isMounted = false;
    };
  }, [isOpen, processedCanvas, canvasVersion, border, transform, cutoutShape, colorFilter, textOverlays]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Actions
  const handleOpenWhatsApp = async () => {
    if (!pngResult) return;
    try {
      await copyAndLaunchWhatsApp(pngResult.blob, "auto");
      setHasCopied(true);
      success(t("export.openWhatsAppSuccess"));
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      error(t("export.copiedError"));
    }
  };

  const handleDownloadWastickers = async () => {
    if (!webpResult) return;
    const items = [{ dataUrl: webpResult.dataUrl }];
    
    // On mobile devices supporting Web Share API, share .wastickers to prompt opening in Sticker Maker
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const shared = await shareWastickersPack(items, "sticker", "imagucula Sticker", "imagucula");
      if (shared) {
        success(t("export.sharedSuccess"));
        return;
      }
    }

    await downloadWastickersPack(items, "sticker.wastickers", "imagucula Sticker", "imagucula");
    success(t("export.downloadWastickersSuccess"));
  };

  const handleShareWhatsApp = async () => {
    if (!webpResult) return;
    const file = new File([webpResult.blob], "sticker.webp", { type: "image/webp" });
    const shared = await shareFileNative(file, "imagucula Sticker", "Sticker do WhatsApp");
    if (shared) {
      success(t("export.sharedSuccess"));
    } else {
      // Fallback: trigger download
      triggerFileDownload(webpResult.blob, "sticker.webp");
      info(t("export.sharedFallback"));
    }
  };

  const handleCopyImage = async () => {
    if (!pngResult) return;
    const copied = await copyImageToClipboard(pngResult.blob);
    if (copied) {
      setHasCopied(true);
      success(t("export.copiedSuccess"));
      setTimeout(() => setHasCopied(false), 2500);
    } else {
      error(t("export.copiedError"));
    }
  };

  const handleDownloadWebP = () => {
    if (!webpResult) return;
    triggerFileDownload(webpResult.blob, "sticker.webp");
    success(t("export.downloadWebpSuccess"));
  };

  const handleDownloadPNG = () => {
    if (!pngResult) return;
    triggerFileDownload(pngResult.blob, "sticker.png");
    success(t("export.downloadPngSuccess"));
  };

  const handleSaveToPack = () => {
    if (!webpResult) return;
    saveToPack(webpResult.dataUrl, webpResult.fileSizeBytes);
    setHasSavedPack(true);
    success(t("export.savedSuccess"));
    setTimeout(() => setHasSavedPack(false), 2500);
  };

  const sizeKb = webpResult ? (webpResult.fileSizeBytes / 1024).toFixed(1) : "0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-200">
      {/* Modal Dialog Card (rounded-3xl per Papyrus guidelines) */}
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-stone-200/80 dark:border-[#363d47] bg-white dark:bg-[#161b22] shadow-2xl p-5 sm:p-7 space-y-5 text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#21262d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t("export.title")}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t("export.subtitle")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] text-stone-400 hover:text-stone-700 transition-colors"
            title={t("common.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview & Size Compliance Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-[#0d1117] border border-stone-200/70 dark:border-[#30363d]">
          {/* 128x128 Preview with checkerboard */}
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative flex items-center justify-center border border-stone-200 dark:border-stone-700 shadow-sm group"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)",
              backgroundSize: "14px 14px",
            }}
          >
            {webpResult ? (
              <img
                src={webpResult.dataUrl}
                alt="Sticker Preview"
                draggable={true}
                className="w-full h-full object-contain p-1 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                title={t("export.dragHint")}
              />
            ) : (
              <div className="animate-pulse w-full h-full bg-stone-200 dark:bg-[#21262d]" />
            )}
            <div className="absolute bottom-1 inset-x-1 flex items-center justify-center pointer-events-none">
              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-medium bg-stone-900/85 text-white shadow-xs">
                {t("export.dragHint")}
              </span>
            </div>
          </div>

          {/* Specs & Status */}
          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                512 × 512 px WebP
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {t("export.readyBadge")}
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t("export.sizeInfo")}{" "}
              <strong className="text-stone-800 dark:text-stone-200 font-mono">
                {sizeKb} KB
              </strong>{" "}
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                {t("export.officialLimit")}
              </span>
            </p>

            <div className="text-[11px] text-stone-400 pt-1">
              {t("export.specsNotice")}
            </div>
          </div>
        </div>

        {/* Informative notice on how WhatsApp sends true stickers */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/25 text-xs text-stone-800 dark:text-stone-200">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px] leading-relaxed">
            <strong className="block font-bold text-stone-900 dark:text-stone-100">
              {t("export.howItWorksTitle")}
            </strong>
            <p className="text-stone-600 dark:text-stone-300">
              {t("export.howItWorksDesc")}
            </p>
          </div>
        </div>

        {/* Primary Export Actions */}
        <div className="space-y-2.5">
          {/* Action 1: Add to WhatsApp via Sticker Maker (.wastickers) */}
          <button
            type="button"
            onClick={handleDownloadWastickers}
            disabled={isGenerating || !webpResult}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm shadow-emerald-600/25 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 group-hover:scale-110 transition-transform">
                <PackageOpen className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold">{t("export.downloadWastickers")}</span>
                <span className="text-[10px] text-white/80 font-normal">
                  {t("export.downloadWastickersDesc")}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/20">
              .wastickers
            </span>
          </button>

          {/* Action 2: Download Official WebP (Ideal for WhatsApp Web '+' -> Sticker or drag) */}
          <button
            type="button"
            onClick={handleDownloadWebP}
            disabled={isGenerating || !webpResult}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 dark:border-[#363d47] bg-stone-50/80 dark:bg-[#1c2128] hover:border-emerald-400 dark:hover:border-emerald-500 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {t("export.downloadWebp")}
                </span>
                <span className="text-[10px] text-stone-500">
                  {t("export.downloadWebpDesc")}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              WebP 512
            </span>
          </button>

          {/* Action 3: Copy & Open in WhatsApp */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            disabled={isGenerating || !pngResult}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 dark:border-[#363d47] bg-stone-50/80 dark:bg-[#1c2128] hover:border-amber-400 dark:hover:border-amber-500 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {t("export.openWhatsApp")}
                </span>
                <span className="text-[10px] text-stone-500">
                  {t("export.openWhatsAppDesc")}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
              {t("export.openWhatsAppBadge")}
            </span>
          </button>

          {/* Action 4: Share Native */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            disabled={isGenerating || !webpResult}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-stone-200 dark:border-[#363d47] bg-stone-50/80 dark:bg-[#1c2128] hover:border-stone-400 dark:hover:border-stone-500 active:scale-[0.99] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-500/10 text-stone-600 dark:text-stone-400 group-hover:scale-110 transition-transform">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {t("export.shareWhatsApp")}
                </span>
                <span className="text-[10px] text-stone-500">
                  {t("export.shareWhatsAppDesc")}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              {t("export.sendBadge")}
            </span>
          </button>

          {/* Action 5: Copy Image & Download PNG HD */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isGenerating || !pngResult}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-[#363d47] bg-white dark:bg-[#161b22] hover:bg-stone-50 dark:hover:bg-[#1c2128] text-xs font-semibold text-stone-800 dark:text-stone-200 active:scale-95 transition-all cursor-pointer"
            >
              {hasCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
              <span>{hasCopied ? t("export.copiedBadge") : t("export.copyImage")}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isGenerating || !pngResult}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-[#363d47] bg-white dark:bg-[#161b22] hover:bg-stone-50 dark:hover:bg-[#1c2128] text-xs font-semibold text-stone-800 dark:text-stone-200 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-400" />
              <span>{t("export.formatPng")}</span>
            </button>
          </div>

          {/* Action 4: Save to Local Pack */}
          <button
            type="button"
            onClick={handleSaveToPack}
            disabled={isGenerating || !webpResult || hasSavedPack}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all cursor-pointer"
          >
            {hasSavedPack ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <BookmarkCheck className="w-3.5 h-3.5" />
            )}
            <span>{hasSavedPack ? t("export.savedBadge") : t("export.saveToTray")}</span>
          </button>
        </div>

        {/* WhatsApp Step-by-Step Guide Accordion */}
        <WhatsAppGuide />
      </div>
    </div>
  );
}
