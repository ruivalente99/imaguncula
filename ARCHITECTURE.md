# IMAGUNCULA — Software Architecture Guide

## 1. Architectural Blueprint & Pipelines

Imaguncula is structured as a client-first graphics studio:

```
Imaguncula
├── src/
│   ├── app/                    -> Next.js 15 App Router & PWA manifests
│   ├── components/
│   │   ├── common/             -> Header, ThemeSelector, LanguageSwitcher
│   │   ├── editor/             -> StickerCanvas, UploadZone, TransformControls, BorderControls
│   │   └── export/             -> ExportModal, WhatsAppGuide
│   ├── lib/
│   │   ├── bg-remover.ts       -> Client-side subject isolation
│   │   ├── canvas-utils.ts     -> Compositing, shape cutouts, text overlay
│   │   ├── webp-encoder.ts     -> High-performance WebP compression
│   │   └── zip-export.ts       -> Multi-sticker pack ZIP export
│   └── types/                  -> Sticker and export type definitions
```

---

## 2. Dependency on `@ruivalente99/bibliotheca`

Imaguncula relies on Bibliotheca for:
- Canvas utilities: `createOffscreenCanvas`, `renderStickerOutline`, `compressCanvasImage`.
- UI primitives: `Button`, `Card`, `Badge`, `Switch`, `Modal`, `Drawer`.
- Tokens: Spacing, border radii, and light/dark theme variables.
