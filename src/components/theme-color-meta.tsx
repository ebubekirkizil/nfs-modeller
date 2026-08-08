"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * <meta name="theme-color"> etiketini sayfadaki tema düğmesiyle eşitler.
 *
 * Neden gerekli: iOS Safari durum çubuğu ile alt araç çubuğunu sayfanın
 * pikselleriyle değil, düz bir renkle boyar — o rengi `theme-color`dan alır.
 * Statik etiket yalnızca `prefers-color-scheme`e bakabildiği için, kullanıcı
 * telefonu açık temadayken siteyi koyuya çevirdiğinde çubuklar yanlış renkte
 * kalıyordu. Bu bileşen etiketi asıl seçili temaya göre günceller.
 *
 * Renkler globals.css'teki `--bar` değişkeninden okunur; tek kaynak orası.
 */
export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const bar = getComputedStyle(document.documentElement)
      .getPropertyValue("--bar")
      .trim();
    if (!bar) return;

    // Statik etiketler media sorgulu; onları bırakıp media'sız tek bir etiket
    // yönetiyoruz — media'sız olan her durumda geçerli sayılır.
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = bar;
  }, [resolvedTheme]);

  return null;
}
