import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { LocaleProvider } from "@/locales";
import { StickerProvider } from "@/context/StickerContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export const metadata: Metadata = {
  title: "imagucula — criador de stickers para whatsapp",
  description: "Crie stickers para WhatsApp com recorte de fundo, borda personalizada e formato oficial 512x512 WebP. 100% offline e privado.",
  applicationName: "imagucula",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "imagucula",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('papyrus_theme_mode');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}

                // Register Service Worker for PWA
                if ('serviceWorker' in navigator && window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {});
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans min-h-screen charm-bg-dynamic text-stone-900 dark:text-stone-100 selection:bg-amber-700 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <LocaleProvider>
              <StickerProvider>{children}</StickerProvider>
            </LocaleProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
