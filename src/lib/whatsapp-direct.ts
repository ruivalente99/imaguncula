/**
 * WhatsApp Direct Open & Clipboard Launch Utility.
 * Enables 1-click seamless workflow to copy sticker and open WhatsApp.
 */
import { copyImageToClipboard } from "./webp-encoder";

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
 * On Mobile: triggers whatsapp:// URL scheme, with graceful web fallback.
 */
export function openWhatsApp(target: WhatsAppTarget = "auto"): void {
  if (typeof window === "undefined") return;

  const isMobile = isMobileDevice();

  if (target === "web" || (!isMobile && target === "auto")) {
    window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
    return;
  }

  // On Mobile or explicit App target:
  // Trigger whatsapp://send protocol
  const targetUrl = "whatsapp://";
  window.location.href = targetUrl;

  // Fallback to web interface if app protocol is unhandled after timeout
  setTimeout(() => {
    window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
  }, 1600);
}

/**
 * Copies the transparent sticker image to clipboard and immediately launches WhatsApp.
 * When WhatsApp opens, user simply presses Ctrl+V / Cmd+V or long-press Paste.
 */
export async function copyAndLaunchWhatsApp(
  pngBlob: Blob,
  target: WhatsAppTarget = "auto"
): Promise<boolean> {
  const copied = await copyImageToClipboard(pngBlob);
  // Launch WhatsApp regardless, so the user is in WhatsApp
  openWhatsApp(target);
  return copied;
}
