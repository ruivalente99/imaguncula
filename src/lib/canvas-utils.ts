import { StickerBorderConfig, StickerTransform, TextOverlayItem, CutoutShape } from "@/types/sticker";
import {
  createOffscreenCanvas,
  renderStickerOutline,
  compressCanvasImage,
  downloadCanvas,
} from "@ruivalente99/bibliotheca/export";

export {
  createOffscreenCanvas,
  renderStickerOutline,
  compressCanvasImage,
  downloadCanvas,
};

/**
 * Applies geometric shape cutouts (circle, squircle, heart, rounded rect, star)
 */
export function applyShapeCutout(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  shape: CutoutShape,
  padding: number = 24
) {
  if (shape === "free") return;

  const x = padding;
  const y = padding;
  const width = w - padding * 2;
  const height = h - padding * 2;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(width, height) / 2;

  ctx.save();
  ctx.beginPath();

  switch (shape) {
    case "circle":
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      break;

    case "squircle": {
      // Apple-like superellipse / squircle
      const r = radius * 0.45;
      ctx.roundRect(x, y, width, height, r);
      break;
    }

    case "rounded-rect":
      ctx.roundRect(x, y, width, height, 32);
      break;

    case "heart": {
      const topCurveHeight = height * 0.3;
      ctx.moveTo(cx, cy + height * 0.4);
      // Left curve
      ctx.bezierCurveTo(
        cx - width * 0.55,
        cy + height * 0.1,
        cx - width * 0.55,
        cy - topCurveHeight,
        cx,
        cy - topCurveHeight * 0.4
      );
      // Right curve
      ctx.bezierCurveTo(
        cx + width * 0.55,
        cy - topCurveHeight,
        cx + width * 0.55,
        cy + height * 0.1,
        cx,
        cy + height * 0.4
      );
      break;
    }

    case "star": {
      const spikes = 5;
      const outerRadius = radius;
      const innerRadius = radius * 0.45;
      let rot = (Math.PI / 2) * 3;
      let step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        let sx = cx + Math.cos(rot) * outerRadius;
        let sy = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(sx, sy);
        rot += step;

        sx = cx + Math.cos(rot) * innerRadius;
        sy = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      break;
    }
  }

  ctx.closePath();
  ctx.clip();
}

/**
 * Composite full sticker onto target 512x512 Canvas.
 */
export function compositeFullSticker({
  targetCtx,
  width = 512,
  height = 512,
  image,
  border,
  transform,
  cutoutShape,
  colorFilter,
  textOverlays,
  safetyPadding = 16,
}: {
  targetCtx: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  image: HTMLCanvasElement | HTMLImageElement | null;
  border: StickerBorderConfig;
  transform: StickerTransform;
  cutoutShape: CutoutShape;
  colorFilter: { brightness: number; contrast: number; saturation: number };
  textOverlays: TextOverlayItem[];
  safetyPadding?: number;
}) {
  targetCtx.clearRect(0, 0, width, height);

  if (!image) return;

  // 1. Prepare image content layer on offscreen canvas
  const { canvas: contentCanvas, ctx: contentCtx } = createOffscreenCanvas(width, height);
  contentCtx.imageSmoothingEnabled = true;
  contentCtx.imageSmoothingQuality = "high";

  // Filter adjustment
  contentCtx.filter = `brightness(${colorFilter.brightness}) contrast(${colorFilter.contrast}) saturate(${colorFilter.saturation})`;

  // Apply transforms
  contentCtx.save();

  // Position at center with user pan
  contentCtx.translate(width / 2 + transform.panX, height / 2 + transform.panY);
  contentCtx.rotate((transform.rotation * Math.PI) / 180);
  contentCtx.scale(
    transform.flipH ? -transform.zoom : transform.zoom,
    transform.flipV ? -transform.zoom : transform.zoom
  );

  // Apply shape cutout if selected
  if (cutoutShape !== "free") {
    applyShapeCutout(contentCtx, width, height, cutoutShape, safetyPadding);
  }

  // Draw image centered
  const imgW = image instanceof HTMLImageElement ? image.naturalWidth || image.width : image.width;
  const imgH = image instanceof HTMLImageElement ? image.naturalHeight || image.height : image.height;

  // Fit image into available canvas preserving aspect ratio
  const maxAvailable = width - safetyPadding * 2;
  const scale = Math.min(maxAvailable / imgW, maxAvailable / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;

  contentCtx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  contentCtx.restore();

  // 2. Render Border (with or without)
  if (border.enabled && border.width > 0) {
    const borderOutline = renderStickerOutline(contentCanvas, border.width, border.color);

    // Optional 3D Pop Shadow under the sticker outline
    if (border.shadowEnabled) {
      targetCtx.save();
      targetCtx.shadowColor = border.shadowColor || "rgba(0,0,0,0.35)";
      targetCtx.shadowBlur = border.shadowBlur || 14;
      targetCtx.shadowOffsetY = border.shadowOffsetY || 4;
      targetCtx.drawImage(borderOutline, 0, 0);
      targetCtx.restore();
    }

    // Draw the clean die-cut sticker border
    targetCtx.drawImage(borderOutline, 0, 0);
  } else if (border.shadowEnabled) {
    // Subtle shadow even without border
    targetCtx.save();
    targetCtx.shadowColor = border.shadowColor || "rgba(0,0,0,0.3)";
    targetCtx.shadowBlur = border.shadowBlur || 12;
    targetCtx.shadowOffsetY = border.shadowOffsetY || 3;
    targetCtx.drawImage(contentCanvas, 0, 0);
    targetCtx.restore();
  }

  // 3. Draw cut-out subject image on top
  targetCtx.drawImage(contentCanvas, 0, 0);

  // 4. Render Text Overlays / Meme Captions
  for (const item of textOverlays) {
    renderTextOverlayItem(targetCtx, item);
  }
}

/**
 * Renders individual text overlay with professional meme/sticker outline.
 */
export function renderTextOverlayItem(ctx: CanvasRenderingContext2D, item: TextOverlayItem) {
  if (!item.text.trim()) return;

  ctx.save();
  ctx.translate(item.x, item.y);
  if (item.rotation) {
    ctx.rotate((item.rotation * Math.PI) / 180);
  }

  ctx.font = `900 ${item.fontSize}px ${item.fontFamily}, Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Heavy dark or contrasting stroke for readability on any background
  if (item.strokeWidth > 0) {
    ctx.strokeStyle = item.strokeColor;
    ctx.lineWidth = item.strokeWidth * 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeText(item.text, 0, 0);
  }

  // Text Fill
  ctx.fillStyle = item.fillColor;
  ctx.fillText(item.text, 0, 0);

  ctx.restore();
}

/**
 * Draws a subtle checkerboard pattern on the canvas to inspect transparency.
 */
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  size: number = 16,
  lightColor: string = "#f5f5f4",
  darkColor: string = "#e7e5e4"
) {
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const isEven = (x / size + y / size) % 2 === 0;
      ctx.fillStyle = isEven ? lightColor : darkColor;
      ctx.fillRect(x, y, size, size);
    }
  }
}
