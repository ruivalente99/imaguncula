# IMAGUNCULA — Design System & Engineering Guidelines

## 1. Visual Philosophy & Canvas Dimensions

Imaguncula follows the warm stone neutral and amber brand palette established in `@ruivalente99/bibliotheca`:
- **Canvas Geometry**: Fixed 512x512 square canvas calibrated to WhatsApp and Telegram sticker standards.
- **Safety Margin Guide**: Inset visual border at 16px to guarantee no clipping in chat apps.
- **Surface Neutrals**: Page background `#f7f7f5` (light) / `#0d1117` (dark); card panels `#ffffff` / `#161b22`.

---

## 2. Shape Cutouts & Contour Standards

Supported geometric clipping masks:
- `circle`: Concentric radial crop with centered subject.
- `squircle`: Apple iOS superellipse with smooth organic corner radius (`radius * 0.45`).
- `rounded-rect`: 32px rounded rectangle.
- `heart`: Smooth cubic bezier curve contour.
- `star`: 5-point balanced star.

---

## 3. Sticker Die-Cut Border & Shadow

- **Contour Stroke**: Pixel dilation buffer rendered onto an offscreen canvas using `renderStickerOutline`.
- **Drop Shadow**: 3D pop shadow with `shadowBlur: 14`, `shadowOffsetY: 4`, `rgba(0,0,0,0.35)`.
