import { ThemeProvider } from "@/components/theme-provider";
import { DATA } from "@/data/resume";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Yalnızca isim için. Dosya depoda: aynı dosyayı sosyal medya önizleme görseli
 * de okuyor (src/app/opengraph-image.tsx), böylece sayfadaki ve paylaşım
 * kartındaki yazı tipi birebir aynı oluyor.
 */
const playfair = localFont({
  src: "../fonts/PlayfairDisplay-Bold.ttf",
  variable: "--font-display",
  weight: "700",
  display: "swap",
});

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
 * `viewportFit: "cover"`: sayfa çentiğin ve ana ekran çubuğunun altına kadar
 * uzansın, arka plan ekranın fiziksel kenarlarına ulaşsın.
 *
 * `themeColor` BİLEREK yok. Verildiğinde iOS Safari durum çubuğunu ve alt
 * araç çubuğunu o düz renkle boyuyor — arka plandaki gradyanın üstünü kapatan
 * siyah şeritler tam olarak bundan çıkıyordu. Belirtilmediğinde Safari
 * çubukları sayfanın kendi içeriğinden örnekler ve gradyan çubukların altında
 * görünmeye devam eder.
 */
export const viewport: Viewport = {
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
          geistMono.variable,
          playfair.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
