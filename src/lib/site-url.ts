import { DATA } from "@/data/resume";

/**
 * Sosyal medya önizlemeleri için sitenin mutlak adresi.
 *
 * WhatsApp, Twitter, LinkedIn gibi botlar `og:image`i **mutlak** URL olarak
 * ister; göreli yol verilirse önizleme görselsiz çıkar. Next bu adresi
 * `metadataBase`ten üretir, dolayısıyla burası yanlışsa önizleme kırılır.
 *
 * Öncelik sırası:
 *  1. NEXT_PUBLIC_SITE_URL — elle verilen adres (kendi alan adın)
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel'in üretim adresi (otomatik)
 *  3. resume.tsx içindeki `url`
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return DATA.url.replace(/\/+$/, "");
}
