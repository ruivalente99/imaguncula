/**
 * WhatsApp Sticker Exporter & Encoder.
 * Conforms to strict WhatsApp Sticker Specifications:
 * - 512x512 exact square dimensions.
 * - Format: image/webp with alpha transparency.
 * - File size: < 100 KB for optimal speed and reliability.
 */

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  fileSizeBytes: number;
  isSizeCompliant: boolean; // < 100 KB
}

/**
 * Encodes canvas to 512x512 WebP, adaptively adjusting quality to remain strictly < 100 KB.
 */
export async function encodeWhatsAppWebP(
  sourceCanvas: HTMLCanvasElement,
  maxSizeBytes: number = 98 * 1024 // 98 KB safety target
): Promise<ExportResult> {
  // Ensure output canvas is exactly 512x512
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = 512;
  outputCanvas.height = 512;
  const ctx = outputCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw source scaled to 512x512
  ctx.drawImage(sourceCanvas, 0, 0, 512, 512);

  // Iteratively adjust quality to fit under target size
  let minQuality = 0.4;
  let maxQuality = 0.95;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;

  for (let attempt = 0; attempt < 5; attempt++) {
    const blob = await new Promise<Blob | null>((resolve) => {
      outputCanvas.toBlob((b) => resolve(b), "image/webp", bestQuality);
    });

    if (!blob) break;

    if (blob.size <= maxSizeBytes) {
      bestBlob = blob;
      // Try slightly higher quality if we still have headroom
      minQuality = bestQuality;
      bestQuality = (minQuality + maxQuality) / 2;
    } else {
      // Too big, lower quality
      maxQuality = bestQuality;
      bestQuality = (minQuality + maxQuality) / 2;
    }

    if (maxQuality - minQuality < 0.08 && bestBlob) {
      break;
    }
  }

  // Fallback if loop ended without compliant blob
  if (!bestBlob) {
    bestBlob = await new Promise<Blob>((resolve) => {
      outputCanvas.toBlob((b) => resolve(b!), "image/webp", 0.7);
    });
  }

  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(bestBlob);
  });

  return {
    blob: bestBlob,
    dataUrl,
    fileSizeBytes: bestBlob.size,
    isSizeCompliant: bestBlob.size <= 100 * 1024,
  };
}

/**
 * Encodes canvas to transparent PNG (lossless).
 */
export async function encodeTransparentPNG(
  sourceCanvas: HTMLCanvasElement
): Promise<ExportResult> {
  const blob = await new Promise<Blob>((resolve) => {
    sourceCanvas.toBlob((b) => resolve(b!), "image/png");
  });

  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  return {
    blob,
    dataUrl,
    fileSizeBytes: blob.size,
    isSizeCompliant: true,
  };
}

/**
 * Copies transparent image blob directly to system clipboard.
 * Allows instant Ctrl+V paste into WhatsApp Web and Telegram!
 */
export async function copyImageToClipboard(pngBlob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return false;
    }
    const item = new ClipboardItem({ "image/png": pngBlob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error("Clipboard write error:", err);
    return false;
  }
}

/**
 * Triggers native Web Share API with file attachment.
 * On iOS and Android, sharing WebP/PNG opens WhatsApp and sends as sticker!
 */
export async function shareFileNative(
  file: File,
  title: string = "Papyrus Sticker",
  text: string = "Criado com Papyrus Stickers"
): Promise<boolean> {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title,
        text,
        files: [file],
      });
      return true;
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Web Share error:", err);
      }
      return false;
    }
  }
  return false;
}

/**
 * Triggers browser file download.
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
