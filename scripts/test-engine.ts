import fs from "fs";
import path from "path";
import { colorDistance, ColorRGBA } from "../src/lib/bg-remover";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${msg}`);
}

async function runTests() {
  console.log("=== Início dos Testes de Verificação do Papyrus Stickers Engine ===\n");

  // 1. Validar manifest.webmanifest
  console.log("1. Verificando PWA manifest...");
  const manifestPath = path.resolve(process.cwd(), "public/manifest.webmanifest");
  assert(fs.existsSync(manifestPath), "Arquivo manifest.webmanifest deve existir");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  assert(manifest.display === "standalone", "Display do PWA deve ser standalone");
  assert(manifest.icons && manifest.icons.length > 0, "Manifest deve conter ícones");
  assert(manifest.theme_color === "#f7f7f5", "Cor de tema deve seguir padrão Papyrus (#f7f7f5)");

  // 2. Validar Service Worker
  console.log("\n2. Verificando Service Worker...");
  const swPath = path.resolve(process.cwd(), "public/sw.js");
  assert(fs.existsSync(swPath), "Arquivo sw.js deve existir");
  const swContent = fs.readFileSync(swPath, "utf-8");
  assert(swContent.includes("addEventListener(\"install\""), "SW deve ter listener de instalação");
  assert(swContent.includes("addEventListener(\"fetch\""), "SW deve ter listener de fetch offline");

  // 3. Validar integridade dos dicionários de tradução
  console.log("\n3. Verificando integridade das traduções (PT e EN)...");
  const ptPath = path.resolve(process.cwd(), "src/locales/pt.json");
  const enPath = path.resolve(process.cwd(), "src/locales/en.json");
  assert(fs.existsSync(ptPath), "src/locales/pt.json deve existir");
  assert(fs.existsSync(enPath), "src/locales/en.json deve existir");

  const pt = JSON.parse(fs.readFileSync(ptPath, "utf-8"));
  const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));

  const checkKeys = (objPt: any, objEn: any, prefix = "") => {
    for (const key of Object.keys(objPt)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      assert(key in objEn, `Chave '${fullKey}' presente em PT deve existir em EN`);
      if (typeof objPt[key] === "object" && objPt[key] !== null) {
        checkKeys(objPt[key], objEn[key], fullKey);
      }
    }
  };
  checkKeys(pt, en);

  // 4. Teste unitário da função de distância perceptual de cor
  console.log("\n4. Verificando motor de distância de cor (bg-remover)...");
  const black: ColorRGBA = { r: 0, g: 0, b: 0, a: 255 };
  const white: ColorRGBA = { r: 255, g: 255, b: 255, a: 255 };
  const red: ColorRGBA = { r: 255, g: 0, b: 0, a: 255 };

  const distBlackWhite = colorDistance(black, white);
  assert(distBlackWhite > 200, "Distância entre preto e branco deve ser alta");

  const distBlackBlack = colorDistance(black, black);
  assert(distBlackBlack === 0, "Distância entre cores idênticas deve ser exatamente 0");

  const distRedBlack = colorDistance(red, black);
  assert(distRedBlack > 0 && distRedBlack < distBlackWhite, "Distância vermelho-preto consistente");

  // 5. Validar Samples
  console.log("\n5. Verificando imagens de teste (Samples)...");
  assert(fs.existsSync(path.resolve(process.cwd(), "public/samples/pet.svg")), "Sample pet.svg existe");
  assert(fs.existsSync(path.resolve(process.cwd(), "public/samples/meme.svg")), "Sample meme.svg existe");
  assert(fs.existsSync(path.resolve(process.cwd(), "public/samples/cat.svg")), "Sample cat.svg existe");

  console.log("\n✨ Todos os testes automatizados passaram com sucesso!");
}

runTests().catch((err) => {
  console.error("Erro na execução dos testes:", err);
  process.exit(1);
});
