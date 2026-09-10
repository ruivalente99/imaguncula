# 🍌 imaguncula

> **imaguncula** — Editorial and private PWA for creating and exporting WhatsApp stickers and multi-platform assets, built with the **TypeUI Charm** design system and philosophy from [papyrus](https://github.com/ruivalente99/papyrus).

![WhatsApp Sticker Specs](https://img.shields.io/badge/WhatsApp-512x512%20WebP%20%3C100KB-25D366?logo=whatsapp&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline--First-f59e0b)
![Playwright](https://img.shields.io/badge/Tests-Playwright%20E2E-2EAD33?logo=playwright&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)

---

## 🏛️ Philosophy & Design (Papyrus Guidelines)

- **Editorial Identity**: Lowercase brand `imaguncula`, dynamic vector emblem `NanoBananaLogo` in warm amber tones (`#b45309` / `#f59e0b`), crisp borders, and mono microtypography (`JetBrains Mono`).
- **Native iOS/Android Ergonomics**:
  - Fixed docked bottom navigation bar with Safe Area (`pb-safe`) and touch targets $\ge 44\text{px}$.
  - Native ghost drag prevention (`user-drag: none`) and elimination of horizontal overscroll bounce.
  - Smooth Light/Dark theme switching and comprehensive bilingual PT/EN support without hardcoded UI strings.
- **100% Offline-First & Private**:
  - Processing executed entirely client-side via HTML5 Canvas 2D.
  - No user images are ever transmitted to external servers or third-party clouds.
  - Service Worker and Web App Manifest configured for standalone install on mobile and desktop devices.

---

## ✨ Features

1. **Upload & Photos**:
   - Image file upload (JPEG, PNG, WebP, HEIC).
   - Direct camera capture on mobile devices.
   - Drag & Drop zone and direct clipboard paste with `Ctrl+V`.
   - 3 built-in vector presets for instant 1-click testing (Cute Pet, Meme Face, Classic Cat).
2. **Simple & Offline Background Removal**:
   - **Magic Wand**: Click any color in the preview canvas to remove it with weighted perceptual color distance.
   - **1-Click Auto Cutout**: Automatically detects and isolates perimeter background and corner colors.
   - **Brush & Eraser**: Manual retouching and restoration tools with real-time cursor overlay and undo history.
   - **Quick Shapes**: Instant geometric cutouts in Circle, Squircle (Apple-like superellipse), Rounded Rectangle, Heart, and Star.
3. **Die-Cut Sticker Border**:
   - Fast toggle for **With Border / Without Border**.
   - Radial dilation on Canvas via alpha mask: uniform, anti-aliased contour.
   - Thickness presets (Thin, Medium, Bold, Extra) and continuous slider control.
   - Quick color palette (Classic White, Papyrus Amber, Neon Green, Yellow, Black) plus free color picker.
   - **3D Pop Shadow** effect to make stickers stand out on any chat wallpaper background.
4. **Meme Captions & Emojis**:
   - High-visibility typography with contrasting outline strokes.
   - Quick emoji stamp picker (🔥, 😂, ❤️, ✨, 🕶️, 🚀, 💯, etc.).
5. **WhatsApp & Multi-Platform Export**:
   - **Official WhatsApp Standard**: Exactly $512 \times 512\text{ px}$, WebP format with alpha transparency and guaranteed adaptive compression $< 100\text{ KB}$. Visible $16\text{px}$ safety margin padding guide.
   - **1-Click "Copiar & Abrir no WhatsApp"**: Copies the sticker directly to the system clipboard and launches WhatsApp Web (`web.whatsapp.com`) on desktop or the native WhatsApp application (`whatsapp://`) on mobile for immediate pasting.
   - **Mobile Sticker Apps Integration (`.wastickers`)**: Generates universal `.wastickers` container archives (`title.txt`, `author.txt`, 96x96 `tray.png`, and 512x512 `.webp` stickers) recognized by *Sticker Maker* and *Sticker.ly* workflows to add complete packs to WhatsApp on iOS & Android with a single tap.
   - **Mobile Share**: Direct sending to WhatsApp via native Web Share API.
   - **Copy Image**: 1-click copy to clipboard for instant `Ctrl+V` pasting into WhatsApp Web or Telegram.
   - **Direct Downloads**: Download in standard WebP (512x512) or transparent HD PNG.
   - **Sticker Pack Tray & ZIP**: Store creations locally in the browser and export full packs as `.wastickers` or `.zip` files.

---

## 🧪 Automated Testing

The project includes an automated engine test suite and Playwright End-to-End tests (Desktop and Mobile viewports):

```bash
# Run all tests (Engine + Playwright E2E)
npm run test

# Run only Playwright E2E tests
npm run test:e2e

# Run only unit/engine tests
npm run test:engine
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create production build
npm run build

# Start production server
npm run start
```

---

*Crafted with the Papyrus ecosystem — 2026.*
