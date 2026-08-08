import { ThemeProvider } from "@/components/theme-provider";
import { DATA } from "@/data/resume";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  // og:image mutlak adrese çevrilirken bu taban kullanılır — bkz. site-url.ts
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${DATA.name} — ${DATA.description}`,
    template: `%s | ${DATA.name}`,
  },
  description: `${DATA.name}, ${DATA.company} bünyesinde ${DATA.location} bölgesinde çalışan ${DATA.description.toLocaleLowerCase("tr-TR")}.`,
  openGraph: {
    title: `${DATA.name} — ${DATA.description}`,
    description: `${DATA.company} · ${DATA.location}`,
    url: getSiteUrl(),
    siteName: DATA.name,
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name} — ${DATA.description}`,
    description: `${DATA.company} · ${DATA.location}`,
    card: "summary_large_image",
  },
};

/**
 * Kök yerleşim yalnızca sağlayıcıları ve tipografiyi kurar.
 * Sayfa kabuğu (genişlik, arka plan, dock menüsü) her sayfaya aittir —
 * kartvizit sayfası ortalanmış dar bir kolon, /cv ise okunur bir yazı kolonu.
 */
/**
 * `viewportFit: "cover"` olmadan iOS Safari sayfayı güvenli alanların içine
 * hapsediyor; üstte ve altta arka planın ulaşmadığı düz şeritler kalıyor.
 * `themeColor` de tarayıcı çubuğunu sayfayla aynı renge boyar, böylece ekranın
 * kenarındaki geçiş görünmez olur.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#06070a" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
