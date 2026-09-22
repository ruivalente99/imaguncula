# imaguncula

> Private and offline-first PWA for creating and exporting WhatsApp stickers, meme captions, and multi-platform graphic assets.

Built upon the design system and canvas transformation foundation of **`@ruivalente99/bibliotheca`**.

---

## Core Tenets & Philosophy

- **Editorial Identity**: Lowercase brand styling (`imaguncula`), dynamic vector emblem `NanoBananaLogo` in warm amber tones (`#b45309` / `#f59e0b`), crisp borders, and monospace microtypography (`JetBrains Mono`).
- **Native iOS/Android Ergonomics**:
  - Fixed docked bottom navigation bar with Safe Area compliance (`pb-safe`) and minimum 44px touch targets.
  - Native ghost drag prevention (`user-drag: none`) and locked horizontal boundaries preventing overscroll bouncing.
  - Symmetrical Light and Dark theme switching and bilingual English / Portuguese interface support.
- **100% Offline-First & Privacy Preserving**:
  - All processing executes entirely client-side via HTML5 Canvas 2D and browser runtimes.
  - Zero user photos or personal media are ever transmitted to external servers.
  - Configured Service Worker and Web App Manifest for standalone installation on mobile and desktop devices.

---

## Features

1. **Upload & Photo Intake**:
   - File upload supporting JPEG, PNG, WebP, and HEIC formats.
   - Direct camera capture on mobile devices.
   - Drag & Drop zone (`UploadZone`) and clipboard paste support.
   - Built-in vector presets for instant testing.
2. **Offline Background Tools & Cutouts**:
   - Magic wand color selection with perceptual color distance.
   - 1-click automatic perimeter cutout.
   - Manual brush and eraser retouching with real-time cursor overlay and undo history.
   - Quick geometric shape cutouts: Circle, Squircle (Apple iOS superellipse), Rounded Rectangle, Heart, and Star.
3. **Die-Cut Sticker Border & Pop Shadow**:
   - Toggle contour border with custom pixel dilation buffer.
   - Thickness presets and continuous slider control.
   - Quick color palette and color picker.
   - 3D Pop Shadow effect for contrast on any chat wallpaper.
4. **Text Overlays & Meme Captions**:
   - High-visibility typography with contrasting outline strokes.
   - Text placement, rotation, and size controls.
5. **Multi-Platform Export**:
   - **WhatsApp Standard**: Exact 512x512 WebP format with alpha transparency and guaranteed adaptive compression under 100KB. Visual 16px safety margin guide.
   - **Direct WhatsApp Launch**: Copies sticker to clipboard and opens WhatsApp Web or native app.
   - **Mobile Sticker Apps Integration (.wastickers)**: Universal container archives recognized by mobile sticker import workflows.
   - **ZIP Archive Export**: Multi-sticker packs with metadata descriptors.

---

## Automated Testing & Verification

```bash
# Run all tests (Engine + Playwright E2E)
bun run test

# Run only Playwright E2E tests
bun run test:e2e

# Run TypeScript typecheck
bun run typecheck

# Production compilation
bun run build
```

---

## The Four Canonical Documentation Pillars

- [AGENTS.md](./AGENTS.md): Operational manual for agents and developers.
- [DESIGN.md](./DESIGN.md): Design system tokens, canvas metrics, and shape cutout definitions.
- [ARCHITECTURE.md](./ARCHITECTURE.md): Software architecture, canvas pipelines, and component tree.
- [SOUL.md](./SOUL.md): Philosophical manifesto of client-side graphic sovereignty and local-first privacy.

---

*imaguncula — Crafted with the Bibliotheca ecosystem.*
