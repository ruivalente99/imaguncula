# 🍌 imaguncula

> **imaguncula** — PWA editorial e privado para criação e exportação de stickers para WhatsApp e outras plataformas, seguindo o design system e a filosofia **TypeUI Charm** do [papyrus](https://github.com/ruivalente99/papyrus).

![WhatsApp Sticker Specs](https://img.shields.io/badge/WhatsApp-512x512%20WebP%20%3C100KB-25D366?logo=whatsapp&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline--First-f59e0b)
![Playwright](https://img.shields.io/badge/Tests-Playwright%20E2E-2EAD33?logo=playwright&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)

---

## 🏛️ Filosofia & Design (Papyrus Guidelines)

- **Identidade Editorial**: Marca em minúsculas `imaguncula`, emblema vetorial dinâmico `NanoBananaLogo` em tons de âmbar quente (`#b45309` / `#f59e0b`), bordas nítidas e microtipografia mono (`JetBrains Mono`).
- **Ergonomia Nativa iOS/Android**:
  - Dock de navegação inferior fixo com Safe Area (`pb-safe`) e alvos de toque $\ge 44\text{px}$.
  - Bloqueio de ghost drag nativo (`user-drag: none`) e eliminação de overscroll horizontal.
  - Alternância suave de temas Claro/Escuro e suporte bilíngue PT/EN sem textos hardcoded.
- **100% Offline-First & Privado**:
  - Processamento inteiramente no cliente via HTML5 Canvas 2D.
  - Nenhuma imagem é enviada para servidores ou nuvem de terceiros.
  - Service Worker e Web App Manifest configurados para instalação standalone no celular ou desktop.

---

## ✨ Funcionalidades

1. **Upload & Fotos**:
   - Upload de arquivos de imagem (JPEG, PNG, WebP, HEIC).
   - Captura direta pela câmera no celular.
   - Área de soltar (Drag & Drop) e colar direto da área de transferência com `Ctrl+V`.
   - 3 presets vetoriais para teste instantâneo com 1 clique (Pet, Meme, Gato).
2. **Remoção de Fundo Simples & Offline**:
   - **Varinha Mágica**: clique em qualquer cor do preview para removê-la com distância de cor perceptual ponderada.
   - **Recorte Automático 1-Click**: detecta e elimina automaticamente o perímetro e cantos de fundo.
   - **Pincel & Borracha**: ferramentas manuais de retoque e restauração com cursor em tempo real e suporte a desfazer (*undo*).
   - **Formas Rápidas**: recorte geométrico instantâneo em Círculo, Superelipse (*Squircle*), Retângulo Arredondado, Coração e Estrela.
3. **Borda Die-Cut de Figurinha**:
   - Alternador rápido **Com Borda / Sem Borda**.
   - Dilatação radial no Canvas por máscara alfa: contorno uniforme e sem serrilhado.
   - Presets de espessura (Fina, Média, Grossa, Extra) e controle por slider.
   - Paleta de cores rápidas (Branco Clássico, Âmbar, Neon, Preto) e seletor livre.
   - Efeito de **Sombra Flutuante 3D** para destacar o sticker em qualquer fundo de conversa.
4. **Legendas de Meme & Emojis**:
   - Textos de alta visibilidade com contorno espesso.
   - Carimbos rápidos de figurinhas (🔥, 😂, ❤️, ✨, 🕶️, 🚀, 💯, etc.).
5. **Exportação WhatsApp & Outros Meios**:
   - **Padrão Oficial WhatsApp**: Exatamente $512 \times 512\text{ px}$, formato WebP com transparência e compressão adaptativa garantida $< 100\text{ KB}$. Margem de segurança de $16\text{px}$ visível no canvas.
   - **Compartilhar no Celular**: Envio direto para o WhatsApp via Web Share API como figurinha.
   - **Copiar Imagem**: Botão para copiar e colar com `Ctrl+V` diretamente no WhatsApp Web ou Telegram.
   - **Downloads**: Download direto em WebP (512x512) ou PNG HD transparente.
   - **Bandeja de Pacotes & ZIP**: Salva suas criações no navegador e exporta pacotes completos em arquivo `.zip`.

---

## 🧪 Testes Automatizados

O projeto inclui uma suíte completa de testes de motor e testes End-to-End via Playwright (Desktop e Mobile):

```bash
# Rodar todos os testes (Engine + Playwright E2E)
npm run test

# Rodar apenas testes Playwright
npm run test:e2e

# Rodar apenas testes unitários de motor
npm run test:engine
```

---

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Iniciar servidor de produção
npm run start
```

---

*Desenvolvido com o ecossistema Papyrus — 2026.*
