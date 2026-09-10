"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  StickerBorderConfig,
  StickerTransform,
  CutoutShape,
  BgTool,
  TextOverlayItem,
  SavedStickerItem,
} from "@/types/sticker";
import {
  removeColorContiguous,
  removeColorGlobal,
  autoRemovePerimeter,
  applyBrush,
} from "@/lib/bg-remover";

interface StickerContextType {
  // State
  originalImage: HTMLImageElement | null;
  processedCanvas: HTMLCanvasElement | null;
  canvasVersion: number;
  hasImage: boolean;
  border: StickerBorderConfig;
  transform: StickerTransform;
  cutoutShape: CutoutShape;
  colorFilter: { brightness: number; contrast: number; saturation: number };
  textOverlays: TextOverlayItem[];
  savedStickers: SavedStickerItem[];
  showCheckerboard: boolean;
  activeTab: "editor" | "background" | "border" | "text" | "tray";
  bgTool: BgTool;
  canUndo: boolean;
  brushSize: number;
  brushMode: "erase" | "restore";
  wandTolerance: number;
  wandFeather: number;
  wandContiguous: boolean;

  // Setters & Actions
  setActiveTab: (tab: "editor" | "background" | "border" | "text" | "tray") => void;
  setBgTool: (tool: BgTool) => void;
  setShowCheckerboard: (show: boolean) => void;
  setBorder: (border: Partial<StickerBorderConfig>) => void;
  setTransform: (transform: Partial<StickerTransform>) => void;
  resetTransform: () => void;
  setCutoutShape: (shape: CutoutShape) => void;
  setColorFilter: (filter: Partial<{ brightness: number; contrast: number; saturation: number }>) => void;
  
  // Image Loading
  loadImageFromFile: (file: File) => Promise<void>;
  loadImageFromUrl: (url: string) => Promise<void>;
  clearImage: () => void;

  // Background Removal Actions
  applyAutoCutout: () => void;
  applyWandClick: (canvasX: number, canvasY: number) => void;
  startBrushStroke: () => void;
  applyBrushStroke: (canvasX: number, canvasY: number) => void;
  resetBgMask: () => void;
  undoBgAction: () => void;
  setBrushSize: (size: number) => void;
  setBrushMode: (mode: "erase" | "restore") => void;
  setWandTolerance: (tol: number) => void;
  setWandFeather: (feather: number) => void;
  setWandContiguous: (cont: boolean) => void;

  // Text Overlay Actions
  addTextOverlay: (text?: string) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlayItem>) => void;
  removeTextOverlay: (id: string) => void;

  // Sticker Pack Management
  saveToPack: (thumbnailDataUrl: string, fileSizeBytes: number) => void;
  removeFromPack: (id: string) => void;
  clearPack: () => void;
}

const defaultBorder: StickerBorderConfig = {
  enabled: true,
  width: 14, // Classic crisp WhatsApp sticker border
  color: "#ffffff",
  shadowEnabled: true,
  shadowColor: "rgba(0, 0, 0, 0.28)",
  shadowBlur: 14,
  shadowOffsetY: 4,
};

const defaultTransform: StickerTransform = {
  zoom: 1,
  rotation: 0,
  panX: 0,
  panY: 0,
  flipH: false,
  flipV: false,
};

const StickerContext = createContext<StickerContextType | null>(null);

export function StickerProvider({ children }: { children: React.ReactNode }) {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [border, setBorderState] = useState<StickerBorderConfig>(defaultBorder);
  const [transform, setTransformState] = useState<StickerTransform>(defaultTransform);
  const [cutoutShape, setCutoutShape] = useState<CutoutShape>("free");
  const [colorFilter, setColorFilterState] = useState({ brightness: 1, contrast: 1, saturation: 1 });
  const [textOverlays, setTextOverlays] = useState<TextOverlayItem[]>([]);
  const [savedStickers, setSavedStickers] = useState<SavedStickerItem[]>([]);
  const [showCheckerboard, setShowCheckerboard] = useState(true);
  const [activeTab, setActiveTab] = useState<"editor" | "background" | "border" | "text" | "tray">("editor");
  const [bgTool, setBgTool] = useState<BgTool>("wand");
  const [canvasVersion, setCanvasVersion] = useState(0);

  const bumpCanvasVersion = useCallback(() => {
    setCanvasVersion((v) => v + 1);
  }, []);

  // BG Removal Tools State
  const [brushSize, setBrushSize] = useState(28);
  const [brushMode, setBrushMode] = useState<"erase" | "restore">("erase");
  const [wandTolerance, setWandTolerance] = useState(25);
  const [wandFeather, setWandFeather] = useState(2);
  const [wandContiguous, setWandContiguous] = useState(true);

  // History stack of ImageData for undo
  const [undoCount, setUndoCount] = useState(0);
  const undoStackRef = useRef<ImageData[]>([]);
  const originalImageDataRef = useRef<ImageData | null>(null);

  // Load saved pack from localStorage on start
  useEffect(() => {
    try {
      const saved = localStorage.getItem("papyrus_saved_stickers");
      if (saved) {
        setSavedStickers(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const savePackToStorage = (list: SavedStickerItem[]) => {
    setSavedStickers(list);
    try {
      localStorage.setItem("papyrus_saved_stickers", JSON.stringify(list));
    } catch {
      // ignore storage quota issues
    }
  };

  const pushUndoState = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const current = ctx.getImageData(0, 0, w, h);
    undoStackRef.current.push(current);
    if (undoStackRef.current.length > 8) {
      undoStackRef.current.shift();
    }
    setUndoCount(undoStackRef.current.length);
  }, []);

  const initCanvasFromImage = useCallback((img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width || 512;
    canvas.height = img.naturalHeight || img.height || 512;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);

    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    originalImageDataRef.current = initialData;
    undoStackRef.current = [];

    setOriginalImage(img);
    setProcessedCanvas(canvas);
    bumpCanvasVersion();
  }, [bumpCanvasVersion]);

  const loadImageFromFile = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          initCanvasFromImage(img);
          resolve();
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const loadImageFromUrl = async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        initCanvasFromImage(img);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const clearImage = () => {
    setOriginalImage(null);
    setProcessedCanvas(null);
    undoStackRef.current = [];
    setUndoCount(0);
    originalImageDataRef.current = null;
    setTextOverlays([]);
    setTransformState(defaultTransform);
    bumpCanvasVersion();
  };

  const setBorder = (updates: Partial<StickerBorderConfig>) => {
    setBorderState((prev) => ({ ...prev, ...updates }));
  };

  const setTransform = (updates: Partial<StickerTransform>) => {
    setTransformState((prev) => ({ ...prev, ...updates }));
  };

  const resetTransform = () => {
    setTransformState(defaultTransform);
  };

  const setColorFilter = (updates: Partial<{ brightness: number; contrast: number; saturation: number }>) => {
    setColorFilterState((prev) => ({ ...prev, ...updates }));
  };

  // Background removal methods
  const applyAutoCutout = () => {
    if (!processedCanvas) return;
    const ctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
    const w = processedCanvas.width;
    const h = processedCanvas.height;

    pushUndoState(ctx, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const result = autoRemovePerimeter(imgData, wandTolerance, wandFeather);
    ctx.putImageData(result, 0, 0);
    bumpCanvasVersion();
  };

  const applyWandClick = (imgX: number, imgY: number) => {
    if (!processedCanvas) return;
    const ctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
    const w = processedCanvas.width;
    const h = processedCanvas.height;

    if (imgX < 0 || imgX >= w || imgY < 0 || imgY >= h) return;

    pushUndoState(ctx, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);

    let result: ImageData;
    if (wandContiguous) {
      result = removeColorContiguous(imgData, imgX, imgY, wandTolerance, wandFeather);
    } else {
      const idx = (imgY * w + imgX) * 4;
      const targetColor = {
        r: imgData.data[idx],
        g: imgData.data[idx + 1],
        b: imgData.data[idx + 2],
        a: imgData.data[idx + 3],
      };
      result = removeColorGlobal(imgData, targetColor, wandTolerance, wandFeather);
    }

    ctx.putImageData(result, 0, 0);
    bumpCanvasVersion();
  };

  const startBrushStroke = useCallback(() => {
    if (!processedCanvas) return;
    const ctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
    pushUndoState(ctx, processedCanvas.width, processedCanvas.height);
  }, [processedCanvas, pushUndoState]);

  const applyBrushStroke = (imgX: number, imgY: number) => {
    if (!processedCanvas || !originalImageDataRef.current) return;
    const ctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
    const w = processedCanvas.width;
    const h = processedCanvas.height;

    const imgData = ctx.getImageData(0, 0, w, h);
    const result = applyBrush(
      imgData,
      originalImageDataRef.current,
      imgX,
      imgY,
      brushSize,
      brushMode
    );
    ctx.putImageData(result, 0, 0);
    bumpCanvasVersion();
  };

  const resetBgMask = () => {
    if (!processedCanvas || !originalImageDataRef.current) return;
    const ctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
    pushUndoState(ctx, processedCanvas.width, processedCanvas.height);
    // clone original image data
    const clone = new ImageData(
      new Uint8ClampedArray(originalImageDataRef.current.data),
      originalImageDataRef.current.width,
      originalImageDataRef.current.height
    );
    ctx.putImageData(clone, 0, 0);
    setUndoCount(undoStackRef.current.length);
    bumpCanvasVersion();
  };

  const undoBgAction = () => {
    if (!processedCanvas || undoStackRef.current.length === 0) return;
    const last = undoStackRef.current.pop()!;
    const ctx = processedCanvas.getContext("2d", { willReadFrequently: true })!;
    ctx.putImageData(last, 0, 0);
    setUndoCount(undoStackRef.current.length);
    bumpCanvasVersion();
  };

  // Text overlay methods
  const addTextOverlay = (initialText: string = "STICKER!") => {
    const newItem: TextOverlayItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: initialText,
      fontFamily: "Impact",
      fontSize: 42,
      fillColor: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 4,
      x: 256,
      y: 440,
      rotation: 0,
    };
    setTextOverlays((prev) => [...prev, newItem]);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlayItem>) => {
    setTextOverlays((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays((prev) => prev.filter((item) => item.id !== id));
  };

  // Pack management methods
  const saveToPack = (thumbnailDataUrl: string, fileSizeBytes: number) => {
    const newItem: SavedStickerItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Sticker #${savedStickers.length + 1}`,
      createdAt: Date.now(),
      thumbnailDataUrl,
      fileSizeBytes,
    };
    const updated = [newItem, ...savedStickers];
    savePackToStorage(updated);
  };

  const removeFromPack = (id: string) => {
    const updated = savedStickers.filter((item) => item.id !== id);
    savePackToStorage(updated);
  };

  const clearPack = () => {
    savePackToStorage([]);
  };

  return (
    <StickerContext.Provider
      value={{
        originalImage,
        processedCanvas,
        canvasVersion,
        hasImage: !!processedCanvas,
        border,
        transform,
        cutoutShape,
        colorFilter,
        textOverlays,
        savedStickers,
        showCheckerboard,
        activeTab,
        bgTool,
        canUndo: undoCount > 0,
        brushSize,
        brushMode,
        wandTolerance,
        wandFeather,
        wandContiguous,
        setActiveTab,
        setBgTool,
        setShowCheckerboard,
        setBorder,
        setTransform,
        resetTransform,
        setCutoutShape,
        setColorFilter,
        loadImageFromFile,
        loadImageFromUrl,
        clearImage,
        applyAutoCutout,
        applyWandClick,
        startBrushStroke,
        applyBrushStroke,
        resetBgMask,
        undoBgAction,
        setBrushSize,
        setBrushMode,
        setWandTolerance,
        setWandFeather,
        setWandContiguous,
        addTextOverlay,
        updateTextOverlay,
        removeTextOverlay,
        saveToPack,
        removeFromPack,
        clearPack,
      }}
    >
      {children}
    </StickerContext.Provider>
  );
}

export function useSticker() {
  const context = useContext(StickerContext);
  if (!context) {
    throw new Error("useSticker must be used within a StickerProvider");
  }
  return context;
}
