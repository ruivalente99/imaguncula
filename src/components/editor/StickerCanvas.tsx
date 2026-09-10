"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSticker } from "@/context/StickerContext";
import { useTranslation } from "@/locales";
import { compositeFullSticker, drawCheckerboard } from "@/lib/canvas-utils";
import {
  Grid,
  ShieldCheck,
  Undo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Wand2,
  Paintbrush,
} from "lucide-react";

export function StickerCanvas() {
  const { t } = useTranslation();
  const {
    processedCanvas,
    canvasVersion,
    hasImage,
    border,
    transform,
    setTransform,
    cutoutShape,
    colorFilter,
    textOverlays,
    showCheckerboard,
    setShowCheckerboard,
    activeTab,
    bgTool,
    canUndo,
    undoBgAction,
    applyWandClick,
    startBrushStroke,
    applyBrushStroke,
    brushSize,
    brushMode,
  } = useSticker();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [showSafeZone, setShowSafeZone] = useState(true);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [brushCursor, setBrushCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Re-render the canvas whenever any sticker parameter changes
  const renderComposite = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Draw full composite
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
  }, [processedCanvas, canvasVersion, border, transform, cutoutShape, colorFilter, textOverlays]);

  useEffect(() => {
    renderComposite();
  }, [renderComposite]);

  // Convert client viewport coordinates to Canvas 512x512 coordinates
  const getCanvasCoords = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 512 / rect.width;
    const scaleY = 512 / rect.height;
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  };

  // Convert Canvas coords to raw processedCanvas image coordinates (taking transforms into account)
  const getImageCoords = (canvasX: number, canvasY: number): { x: number; y: number } | null => {
    if (!processedCanvas) return null;
    const imgW = processedCanvas.width;
    const imgH = processedCanvas.height;

    // Inverse transform
    const maxAvailable = 512 - 32;
    const baseScale = Math.min(maxAvailable / imgW, maxAvailable / imgH);
    const effectiveZoom = transform.zoom * baseScale;

    // Translation offset
    let dx = canvasX - (256 + transform.panX);
    let dy = canvasY - (256 + transform.panY);

    // Rotation inverse
    const rad = (-transform.rotation * Math.PI) / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

    // Flip inverse
    const fx = transform.flipH ? -rx : rx;
    const fy = transform.flipV ? -ry : ry;

    // Zoom inverse
    const ix = fx / effectiveZoom + imgW / 2;
    const iy = fy / effectiveZoom + imgH / 2;

    return { x: Math.round(ix), y: Math.round(iy) };
  };

  // Pointer Handlers (Works seamlessly across Mouse and Touch/Pointers)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasImage) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsPointerDown(true);

    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    if (activeTab === "background") {
      const imgCoords = getImageCoords(coords.x, coords.y);
      if (imgCoords) {
        if (bgTool === "wand") {
          applyWandClick(imgCoords.x, imgCoords.y);
        } else if (bgTool === "brush") {
          startBrushStroke();
          applyBrushStroke(imgCoords.x, imgCoords.y);
          renderComposite();
        }
      }
    } else {
      // Pan image in Editor mode
      setDragStart({ x: e.clientX - transform.panX, y: e.clientY - transform.panY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (coords) {
      setBrushCursor({
        x: coords.x,
        y: coords.y,
        visible: activeTab === "background" && bgTool === "brush",
      });
    }

    if (!isPointerDown || !hasImage) return;

    if (activeTab === "background") {
      if (bgTool === "brush" && coords) {
        const imgCoords = getImageCoords(coords.x, coords.y);
        if (imgCoords) {
          applyBrushStroke(imgCoords.x, imgCoords.y);
          renderComposite();
        }
      }
    } else {
      // Pan drag
      const newPanX = e.clientX - dragStart.x;
      const newPanY = e.clientY - dragStart.y;
      setTransform({ panX: Math.round(newPanX), panY: Math.round(newPanY) });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsPointerDown(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerLeave = () => {
    setBrushCursor((prev) => ({ ...prev, visible: false }));
    setIsPointerDown(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    const newZoom = Math.min(3.0, Math.max(0.2, transform.zoom + delta));
    setTransform({ zoom: parseFloat(newZoom.toFixed(2)) });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full h-full p-2 sm:p-4 select-none overflow-hidden"
    >
      {/* Floating Canvas Top Toolbar */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md border border-stone-200/80 dark:border-[#30363d] shadow-2xs text-stone-600 dark:text-stone-300">
        {/* Toggle Checkerboard */}
        <button
          onClick={() => setShowCheckerboard(!showCheckerboard)}
          className={`p-1.5 rounded-full transition-all ${
            showCheckerboard
              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
              : "hover:bg-stone-100 dark:hover:bg-[#21262d]"
          }`}
          title={t("canvas.checkerboard")}
          aria-label={t("canvas.checkerboard")}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Toggle WhatsApp 16px safe zone */}
        <button
          onClick={() => setShowSafeZone(!showSafeZone)}
          className={`p-1.5 rounded-full transition-all ${
            showSafeZone
              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
              : "hover:bg-stone-100 dark:hover:bg-[#21262d]"
          }`}
          title={t("canvas.whatsappSafeZone")}
          aria-label={t("canvas.whatsappSafeZone")}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-stone-200 dark:bg-[#30363d] mx-0.5" />

        {/* Zoom In & Out */}
        <button
          onClick={() =>
            setTransform({ zoom: parseFloat(Math.max(0.2, transform.zoom - 0.1).toFixed(2)) })
          }
          className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] active:scale-95 transition-all"
          title={t("canvas.zoomOut")}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] font-semibold min-w-[38px] text-center">
          {Math.round(transform.zoom * 100)}%
        </span>

        <button
          onClick={() =>
            setTransform({ zoom: parseFloat(Math.min(3.0, transform.zoom + 0.1).toFixed(2)) })
          }
          className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] active:scale-95 transition-all"
          title={t("canvas.zoomIn")}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Reset View */}
        <button
          onClick={() => setTransform({ zoom: 1, panX: 0, panY: 0 })}
          className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] active:scale-95 transition-all"
          title={t("transform.center")}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Undo BG edit */}
        {canUndo && (
          <>
            <div className="w-[1px] h-3.5 bg-stone-200 dark:bg-[#30363d] mx-0.5" />
            <button
              onClick={undoBgAction}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 active:scale-95 transition-all"
              title={t("bg.undo")}
            >
              <Undo2 className="w-3 h-3" />
              <span>{t("bg.undo")}</span>
            </button>
          </>
        )}
      </div>

      {/* Main 512x512 Canvas Box */}
      <div
        className={`relative w-full max-w-[340px] xs:max-w-[390px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[512px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 transition-all duration-200 ${
          activeTab === "background"
            ? bgTool === "shapes"
              ? "border-amber-500/80 ring-4 ring-amber-500/15 cursor-default"
              : "border-amber-500/80 ring-4 ring-amber-500/15 cursor-crosshair"
            : "border-stone-200/90 dark:border-[#30363d] cursor-grab active:cursor-grabbing"
        }`}
        onWheel={handleWheel}
      >
        {/* Background Checkerboard Grid for Transparency */}
        {showCheckerboard && (
          <div
            className="absolute inset-0 pointer-events-none opacity-90 dark:opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />
        )}

        {/* WhatsApp 16px Safe Area Boundary Line (16/512 = 3.125%) */}
        {showSafeZone && (
          <div
            className="absolute inset-[3.125%] border border-dashed border-amber-500/40 pointer-events-none z-10 rounded-2xl flex items-start justify-end p-1.5"
            title={t("canvas.safeZoneTitle")}
          >
            <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 opacity-60">
              {t("canvas.safeZoneBadge")}
            </span>
          </div>
        )}

        {/* The 512x512 Master Canvas */}
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          className="relative w-full h-full object-contain touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        />

        {/* Custom Brush Cursor in Background mode */}
        {activeTab === "background" && brushCursor.visible && (
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500 bg-amber-500/20 transition-transform duration-75"
            style={{
              left: `${(brushCursor.x / 512) * 100}%`,
              top: `${(brushCursor.y / 512) * 100}%`,
              width: `${(brushSize * 2 / 512) * 100}%`,
              height: `${(brushSize * 2 / 512) * 100}%`,
            }}
          />
        )}
      </div>

      {/* Micro-hint under canvas */}
      <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
        {activeTab === "background" ? (
          <>
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{t("bg.clickPrompt")}</span>
          </>
        ) : (
          <>
            <Move className="w-3.5 h-3.5 text-stone-400" />
            <span>{t("canvas.dragHint")}</span>
          </>
        )}
      </div>
    </div>
  );
}
