# IMAGUNCULA — Agent Reference & Developer Manual

This document serves as the technical guide for AI Agents, LLMs, and engineers operating on the **Imaguncula** (PWA Sticker & Image Studio) codebase.

---

## 1. System Identity & Core Tenets

Imaguncula is an offline-first PWA sticker generator and canvas transformation studio built with Next.js 15, React 19, TypeScript, and Bun.

All modifications must adhere to:
- **Offline & Privacy Preserving**: Zero external image processing APIs. All background removal, clipping, dilation, and WebP encoding happen in the browser.
- **Bibliotheca Integration**: Consumes `@ruivalente99/bibliotheca` for UI primitives and export canvas helpers.
- **Zero Emojis**: Code, docstrings, tests, and commit messages must strictly avoid emojis.
- **Strict Branching Policy**: Never push directly to `main`. Always develop on a dedicated branch (`git checkout -b <type>/<description>`) and submit a Pull Request.

---

## 2. Quality Gates & Verification

```bash
# Typecheck TypeScript definitions
bun run typecheck

# Run Playwright E2E tests
bun run test:e2e

# Run Next.js build verification
bun run build
```

---

## 3. The Four Canonical Documentation Pillars

1. **`AGENTS.md`**: Operational manual for agents and developers.
2. **`DESIGN.md`**: Visual specification, canvas metrics, and design tokens.
3. **`ARCHITECTURE.md`**: Software architecture, canvas pipelines, and component tree.
4. **`SOUL.md`**: Cultural and philosophical manifesto of client-side graphic sovereignty.
