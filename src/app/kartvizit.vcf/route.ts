import { DATA } from "@/data/resume";

/**
 * Kartvizit sayfasındaki "Rehbere Ekle" düğmesinin indirdiği vCard dosyası.
 *
 * İçerik src/data/resume.tsx'ten üretilir — orayı güncellemek yeterli.
 * iOS ve Android, text/vcard dosyasını açtığında doğrudan "Kişi Ekle"
 * ekranını gösterir.
 */

/** vCard özel karakterlerini kaçırır (RFC 6350 §3.4). */
function escapeValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** İsmi "ad" ve "soyad" olarak ayırır: son kelime soyad, kalanı ad. */
function splitName(fullName: string): { given: string; family: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { given: parts[0], family: "" };
  return {
    family: parts[parts.length - 1],
    given: parts.slice(0, -1).join(" "),
  };
}

function buildVCard(): string {
  const { given, family } = splitName(DATA.name);

  const { street, district, city, country } = DATA.address;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeValue(family)};${escapeValue(given)};;;`,
    `FN:${escapeValue(DATA.name)}`,
    `ORG:${escapeValue(DATA.company)}`,
    `TITLE:${escapeValue(DATA.description)}`,
    `TEL;TYPE=CELL:${escapeValue(DATA.contact.tel)}`,
    `EMAIL;TYPE=INTERNET:${escapeValue(DATA.contact.email)}`,
    `URL:${escapeValue(DATA.url)}`,
    // ADR alan sırası: posta kutusu;ek;sokak;şehir;bölge;posta kodu;ülke
    `ADR;TYPE=WORK:;;${escapeValue(street)};${escapeValue(
      district
    )};${escapeValue(city)};;${escapeValue(country)}`,
    ...Object.values(DATA.contact.social)
      .filter((social) => social.url.startsWith("http"))
      .map(
        (social) =>
          `X-SOCIALPROFILE;TYPE=${escapeValue(
            social.name.toLowerCase()
          )}:${escapeValue(social.url)}`
      ),
    "END:VCARD",
  ];

  // vCard satır sonları CRLF olmak zorunda.
  return lines.join("\r\n") + "\r\n";
}

/** Dosya adı: "abdulbaki-meto.vcf" */
function fileName(): string {
  const slug = DATA.name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "kartvizit"}.vcf`;
}

// İçerik isteğe bağlı değil — derleme sırasında bir kez üretilsin.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildVCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName()}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
