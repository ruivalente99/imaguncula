import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { colorDistance, ColorRGBA } from "../src/lib/bg-remover";
import { buildWastickersBlob } from "../src/lib/wastickers-export";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${msg}`);
}

async function runTests() {
  console.log("=== Papyrus Stickers Engine Verification Tests ===\n");

  // 1. Validate manifest.webmanifest
  console.log("1. Verifying PWA manifest...");
  const manifestPath = path.resolve(process.cwd(), "public/manifest.webmanifest");
  assert(fs.existsSync(manifestPath), "File manifest.webmanifest must exist");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  assert(manifest.display === "standalone", "PWA display mode must be standalone");
  assert(manifest.icons && manifest.icons.length > 0, "Manifest must contain icons");
  assert(manifest.theme_color === "#f7f7f5", "Theme color must adhere to Papyrus standard (#f7f7f5)");

  // 2. Validate Service Worker
  console.log("\n2. Verifying Service Worker...");
  const swPath = path.resolve(process.cwd(), "public/sw.js");
  assert(fs.existsSync(swPath), "File sw.js must exist");
  const swContent = fs.readFileSync(swPath, "utf-8");
  assert(swContent.includes("addEventListener(\"install\""), "Service Worker must have install listener");
  assert(swContent.includes("addEventListener(\"fetch\""), "Service Worker must have fetch listener for offline caching");

  // 3. Validate translation dictionary integrity & parity
  console.log("\n3. Verifying translation dictionaries integrity (PT and EN)...");
  const ptPath = path.resolve(process.cwd(), "src/locales/pt.json");
  const enPath = path.resolve(process.cwd(), "src/locales/en.json");
  assert(fs.existsSync(ptPath), "src/locales/pt.json must exist");
  assert(fs.existsSync(enPath), "src/locales/en.json must exist");

  const pt = JSON.parse(fs.readFileSync(ptPath, "utf-8"));
  const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));

  const checkKeys = (sourceObj: any, targetObj: any, sourceName: string, targetName: string, prefix = "") => {
    for (const key of Object.keys(sourceObj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      assert(key in targetObj, `Key '${fullKey}' present in ${sourceName} must exist in ${targetName}`);
      if (typeof sourceObj[key] === "object" && sourceObj[key] !== null) {
        checkKeys(sourceObj[key], targetObj[key], sourceName, targetName, fullKey);
      }
    }
  };

  // Bidirectional parity check
  checkKeys(pt, en, "PT", "EN");
  checkKeys(en, pt, "EN", "PT");

  // 4. Unit test perceptual color distance function
  console.log("\n4. Verifying color distance engine (bg-remover)...");
  const black: ColorRGBA = { r: 0, g: 0, b: 0, a: 255 };
  const white: ColorRGBA = { r: 255, g: 255, b: 255, a: 255 };
  const red: ColorRGBA = { r: 255, g: 0, b: 0, a: 255 };

  const distBlackWhite = colorDistance(black, white);
  assert(distBlackWhite > 200, "Distance between black and white must be high");

  const distBlackBlack = colorDistance(black, black);
  assert(distBlackBlack === 0, "Distance between identical colors must be exactly 0");

  const distRedBlack = colorDistance(red, black);
  assert(distRedBlack > 0 && distRedBlack < distBlackWhite, "Red-black distance must be consistent");

  // 5. Validate Test Samples
  console.log("\n5. Verifying test sample images...");
  assert(fs.existsSync(path.resolve(process.cwd(), "public/samples/pet.svg")), "Sample pet.svg exists");
  assert(fs.existsSync(path.resolve(process.cwd(), "public/samples/meme.svg")), "Sample meme.svg exists");
  assert(fs.existsSync(path.resolve(process.cwd(), "public/samples/cat.svg")), "Sample cat.svg exists");

  // 6. Validate European Portuguese (pt-PT) vocabulary compliance (prohibition of pt-BR terms)
  console.log("\n6. Verifying European Portuguese (pt-PT) compliance...");
  const ptContent = fs.readFileSync(ptPath, "utf-8");
  const forbiddenPtBr = [
    { word: "aplicativo", replacement: "aplicação / app" },
    { word: "celular", replacement: "telemóvel" },
    { word: "figurinha", replacement: "sticker" },
    { word: "salvar", replacement: "guardar" },
    { word: "salvo", replacement: "guardado" },
    { word: "centralizar", replacement: "centrar" },
    { word: "detecta", replacement: "deteta" },
  ];

  for (const item of forbiddenPtBr) {
    const regex = new RegExp(`\\b${item.word}\\b`, "i");
    assert(!regex.test(ptContent), `pt.json must not contain pt-BR term '${item.word}' (use '${item.replacement}')`);
  }

  // 7. Validate .wastickers archive generation
  console.log("\n7. Verifying .wastickers archive generator (Sticker Maker / Sticker.ly)...");
  const testStickers = [
    { dataUrl: "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP8HAA==" },
    { dataUrl: "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP8HAA==" },
  ];
  const wastickerBlob = await buildWastickersBlob(testStickers, "My Test Pack", "imagucula");
  assert(wastickerBlob.size > 0, ".wastickers blob must be non-empty");

  const loadedZip = await JSZip.loadAsync(await wastickerBlob.arrayBuffer());
  assert(loadedZip.file("title.txt") !== null, ".wastickers must contain title.txt at root");
  assert(loadedZip.file("author.txt") !== null, ".wastickers must contain author.txt at root");
  assert(loadedZip.file("tray.png") !== null, ".wastickers must contain tray.png at root");
  assert(loadedZip.file("1.webp") !== null, ".wastickers must contain 1.webp at root");
  assert(loadedZip.file("2.webp") !== null, ".wastickers must contain 2.webp at root");

  const titleContent = await loadedZip.file("title.txt")!.async("text");
  assert(titleContent === "My Test Pack", "title.txt must match specified title");

  console.log("\n✨ All automated tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
