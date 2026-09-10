/**
 * .wastickers Package Exporter.
 * Creates standard universal sticker pack containers supported by mobile sticker apps:
 * - Sticker Maker by Viko & Co (iOS / Android)
 * - Sticker.ly / Personal Stickers
 * - WhatsApp Sticker Pack Import
 *
 * File container structure (.wastickers is a ZIP archive with root contents):
 * - title.txt: Pack Title
 * - author.txt: Pack Author
 * - tray.png: 96x96 PNG Pack Thumbnail Icon
 * - 1.webp, 2.webp, ...: 512x512 transparent WebP stickers
 */
import JSZip from "jszip";
import { triggerFileDownload } from "./webp-encoder";

export interface WastickerItem {
  dataUrl: string; // Base64 dataUrl (image/webp or image/png)
  filename?: string;
}

/**
 * Generates a 96x96 PNG tray icon base64 string.
 */
export async function generateTrayIconBase64(
  thumbnailDataUrl?: string
): Promise<string> {
  if (typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 96;
      canvas.height = 96;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (thumbnailDataUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = thumbnailDataUrl;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
          // Fit into 96x96 keeping aspect ratio
          ctx.drawImage(img, 0, 0, 96, 96);
        } else {
          // Fallback amber circle
          ctx.fillStyle = "#b45309";
          ctx.beginPath();
          ctx.arc(48, 48, 44, 0, Math.PI * 2);
          ctx.fill();
        }
        return canvas.toDataURL("image/png").split(",")[1];
      }
    } catch {
      // ignore
    }
  }
  // Minimal valid 1x1 PNG base64 fallback for non-DOM/test environments
  return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
}

/**
 * Builds the .wastickers archive Blob containing all stickers and metadata.
 */
export async function buildWastickersBlob(
  stickers: WastickerItem[],
  title: string = "imagucula Stickers",
  author: string = "imagucula"
): Promise<Blob> {
  const zip = new JSZip();

  // 1. Pack metadata files
  zip.file("title.txt", title.trim() || "imagucula Stickers");
  zip.file("author.txt", author.trim() || "imagucula");

  // 2. 96x96 tray thumbnail icon
  const firstDataUrl = stickers[0]?.dataUrl;
  const trayBase64 = await generateTrayIconBase64(firstDataUrl);
  zip.file("tray.png", trayBase64, { base64: true });

  // 3. Add individual stickers (1.webp, 2.webp, ...)
  stickers.forEach((item, index) => {
    const rawData = item.dataUrl.includes(",")
      ? item.dataUrl.split(",")[1]
      : item.dataUrl;
    const filename = `${index + 1}.webp`;
    zip.file(filename, rawData, { base64: true });
  });

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/octet-stream",
  });
}

/**
 * Triggers a direct download of the .wastickers file.
 */
export async function downloadWastickersPack(
  stickers: WastickerItem[],
  filename: string = "stickers.wastickers",
  title?: string,
  author?: string
): Promise<void> {
  const blob = await buildWastickersBlob(stickers, title, author);
  triggerFileDownload(blob, filename.endsWith(".wastickers") ? filename : `${filename}.wastickers`);
}

/**
 * Shares the .wastickers file using the native Web Share API.
 * On iOS and Android, this prompts to "Open in Sticker Maker" or WhatsApp!
 */
export async function shareWastickersPack(
  stickers: WastickerItem[],
  packName: string = "imagucula_pack",
  title: string = "imagucula Stickers",
  author: string = "imagucula"
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.canShare) {
    return false;
  }

  const blob = await buildWastickersBlob(stickers, title, author);
  const file = new File([blob], `${packName}.wastickers`, {
    type: "application/octet-stream",
  });

  if (navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title,
        text: `Pacote de stickers para WhatsApp: ${title}`,
        files: [file],
      });
      return true;
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error sharing .wastickers pack:", err);
      }
      return false;
    }
  }

  return false;
}
