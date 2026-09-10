export type BorderPreset = "none" | "thin" | "medium" | "bold" | "extra";

export interface StickerBorderConfig {
  enabled: boolean;
  width: number; // in pixels (e.g. 0 to 40)
  color: string; // e.g. '#ffffff'
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetY: number;
}

export interface StickerTransform {
  zoom: number; // 0.2 to 3.0
  rotation: number; // -180 to 180 (degrees)
  panX: number; // offset in px
  panY: number; // offset in px
  flipH: boolean;
  flipV: boolean;
}

export type CutoutShape = "free" | "circle" | "squircle" | "rounded-rect" | "heart" | "star";

export type BgTool = "wand" | "brush" | "shapes";

export interface TextOverlayItem {
  id: string;
  text: string;
  fontFamily: "Impact" | "Inter" | "JetBrains Mono" | "Merriweather";
  fontSize: number; // 16 to 72
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  x: number; // 0 to 512
  y: number; // 0 to 512
  rotation: number;
}

export interface StickerState {
  originalImage: HTMLImageElement | null;
  processedImage: HTMLImageElement | null; // transparent/segmented image
  hasImage: boolean;
  imageDimensions: { width: number; height: number };
  border: StickerBorderConfig;
  transform: StickerTransform;
  cutoutShape: CutoutShape;
  textOverlays: TextOverlayItem[];
  colorFilter: {
    brightness: number; // 0.5 to 1.5
    contrast: number; // 0.5 to 1.5
    saturation: number; // 0 to 2.0
  };
  safetyPadding: number; // 16px recommended by WhatsApp
  showCheckerboard: boolean;
  isProcessing: boolean;
  processingProgress: number; // 0 to 100
}

export interface SavedStickerItem {
  id: string;
  title: string;
  createdAt: number;
  thumbnailDataUrl: string;
  webpBlobUrl?: string;
  fileSizeBytes: number;
}
