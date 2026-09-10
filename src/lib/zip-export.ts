import JSZip from "jszip";
import { SavedStickerItem } from "@/types/sticker";

/**
 * Creates and triggers download of a ZIP archive containing all stickers in the pack.
 */
export async function exportStickersZip(
  stickers: SavedStickerItem[],
  packName: string = "papyrus_stickers_pack"
): Promise<void> {
  if (stickers.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder(packName) || zip;

  // Add individual stickers
  for (let i = 0; i < stickers.length; i++) {
    const item = stickers[i];
    const paddedIndex = String(i + 1).padStart(2, "0");
    const filename = `sticker_${paddedIndex}.webp`;

    // Extract base64 data from Data URL
    const base64Data = item.thumbnailDataUrl.split(",")[1];
    if (base64Data) {
      folder.file(filename, base64Data, { base64: true });
    }
  }

  // Add metadata descriptor
  const metadata = {
    pack_name: packName,
    created_at: new Date().toISOString(),
    generator: "papyrus-stickers-pwa",
    stickers_count: stickers.length,
  };
  folder.file("metadata.json", JSON.stringify(metadata, null, 2));

  // Generate and download zip
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${packName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
