/**
 * WhatsApp Direct Open & Action Launch Utility.
 * Enables 1-click seamless workflow to download compliant sticker and launch WhatsApp.
 */
import { copyImageToClipboard, triggerFileDownload } from "./webp-encoder";

export type WhatsAppTarget = "auto" | "web" | "app";

/**
 * Detects whether the current device is a mobile phone/tablet.
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Opens WhatsApp on the device or in browser.
 * On Desktop: defaults to opening https://web.whatsapp.com in a new tab.
 * On Mobile / App: triggers whatsapp:// URL scheme, with graceful web fallback.
 */
export function openWhatsApp(target: WhatsAppTarget = "auto"): void {
  if (typeof window === "undefined") return;

  const isMobile = isMobileDevice();

  if (target === "web" || (!isMobile && target === "auto")) {
    window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
    return;
  }

  // On Mobile or explicit App target:
  const targetUrl = "whatsapp://";
  window.location.href = targetUrl;

  // Fallback to web interface if app protocol is unhandled after timeout
  if (isMobile) {
    setTimeout(() => {
      window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
    }, 1600);
  }
}

/**
 * Triggers official sticker download and immediately launches WhatsApp so the user
 * can click '+' -> 'Novo Autocolante' (New Sticker) and pick the downloaded sticker.
 * Uses PNG format because WhatsApp Web / Desktop sticker creator natively accepts
 * and expects transparent PNG images.
 */
export async function downloadAndOpenWhatsApp(
  pngBlob: Blob,
  webpBlob?: Blob,
  target: WhatsAppTarget = "auto"
): Promise<void> {
  // 1. Download official transparent PNG file so it is readily available in Downloads
  triggerFileDownload(pngBlob, "sticker.png");

  // 2. Also copy PNG to clipboard
  try {
    await copyImageToClipboard(pngBlob);
  } catch {
    // Graceful fallback
  }

  // 3. Open WhatsApp Web or App
  openWhatsApp(target);
}

/**
 * Copies the transparent sticker image to clipboard and launches WhatsApp.
 */
export async function copyAndLaunchWhatsApp(
  pngBlob: Blob,
  target: WhatsAppTarget = "auto"
): Promise<boolean> {
  const copied = await copyImageToClipboard(pngBlob);
  openWhatsApp(target);
  return copied;
}

