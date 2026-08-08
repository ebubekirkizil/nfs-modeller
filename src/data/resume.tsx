import { Icons } from "@/components/icons";
import { MapPinIcon, UserPlusIcon } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TEK DÜZENLEME NOKTASI
 *  Sitedeki bütün metin ve bağlantılar bu dosyadan gelir.
 *  "TODO" yazan her yeri kendi bilgilerinle değiştir; başka dosyaya dokunmana
 *  gerek yok.  Kalanları görmek için:  grep -rn "TODO" src/data
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** İletişim bilgileri — kartvizit satırları ve vCard buradan okur. */
const CONTACT = {
  // NOT: "abdülbakimeto5@" olarak verilmişti; Gmail adreslerinde "ü" gibi
  // ASCII dışı harf kullanılamaz (yalnızca a-z, 0-9 ve nokta), bu yüzden
  // "abdulbakimeto5@" yazıldı. Farklıysa burayı düzelt.
  email: "abdulbakimeto5@gmail.com",
  /** Ekranda gösterilen, yerel biçim. */
  tel: "0553 790 26 77",
  /** tel: ve wa.me bağlantıları için: ülke kodu, boşluksuz. */
  telE164: "+905537902677",
  /** Kullanıcı adı; hem bağlantı hem de satırın altındaki etiket bundan üretilir. */
  instagramHandle: "bbaki.meto",
};

/**
 * Paylaş menüsünden gelen adresteki `utm_source` ve `igsh` parametreleri
 * bilinçli olarak atıldı: bunlar profilin bir parçası değil, bağlantının nereden
 * kopyalandığını taşıyan izleme etiketleri.
 */
const INSTAGRAM_URL = `https://www.instagram.com/${CONTACT.instagramHandle}`;

/** Ofis adresi. Konum satırı ve rehber kartı buradan okur. */
const OFFICE = {
  company: "Özgüven Emlak",
  street: "Batı Mah. Hatboyu Cad. No:42/47, Pendik İş Merkezi Kat:1",
  district: "Pendik",
  city: "İstanbul",
  country: "Türkiye",
};

export const DATA = {
  name: "Abdülbaki Meto",
  initials: "AM",
  // Sitenin yayındaki adresi. Sosyal medya önizleme görseli ve SEO etiketleri
  // buradan mutlak adres üretir. Kendi alan adını alınca burayı değiştir
  // (ya da NEXT_PUBLIC_SITE_URL ortam değişkenini ver) — bkz. src/lib/site-url.ts
  url: "https://abdulbaki-meto-portfolio.vercel.app",
  /** Çalıştığı firma. Rehber kartında "şirket" alanı olarak görünür. */
  company: OFFICE.company,
  /** İsmin altındaki kısa konum. Tam adres `address` alanında. */
  location: `${OFFICE.district}, ${OFFICE.city}`,
  locationLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${OFFICE.company} ${OFFICE.street} ${OFFICE.district} ${OFFICE.city}`
  )}`,
  /** Tam ofis adresi — rehber kartına ve konum satırının ipucuna gider. */
  address: OFFICE,
  // İsmin altında, arama sonuçlarında ve rehbere eklenen kişi kartının
  // "ünvan" alanında görünür.
  description: "Gayrimenkul Danışmanı",
  // Değiştirmek için yeni fotoğrafı public/ klasörüne koyup yolunu buraya yaz.
  // Boş bırakılırsa baş harfler ("AM") gösterilir.
  avatarUrl: "/me.jpg",

  /**
   * Fotoğrafın sağ altındaki durum rozeti (GitHub'daki gibi).
   * `emoji`yi istediğinle değiştir; `label` ekran okuyucuya okunan karşılığı,
   * emoji tek başına anlamlı okunmadığı için gerekli.
   */
  status: {
    emoji: "🏠",
    label: "Emlak danışmanı",
  },

  /**
   * Sayfadaki bağlantı listesi.
   * Sıralamayı değiştirmek için satırların yerini değiştirmen yeterli.
   * `primary: true` olan satır vurgulu (renkli) görünür — tek tane olmalı.
   */
  links: [
    {
      label: "Rehbere Ekle",
      description: "Kişi kartını telefonuna kaydet",
      // Dosya src/app/kartvizit.vcf/route.ts tarafından bu dosyadan üretilir.
      href: "/kartvizit.vcf",
      icon: UserPlusIcon,
      download: true,
      primary: true,
    },
    {
      label: "WhatsApp",
      description: "Bana doğrudan yaz",
      // wa.me numarayı "+" ve boşluk olmadan ister.
      href: `https://wa.me/${CONTACT.telE164.replace(/\D/g, "")}`,
      icon: Icons.whatsapp,
    },
    {
      label: "Telefon",
      description: CONTACT.tel,
      href: `tel:${CONTACT.telE164}`,
      icon: Icons.phone,
    },
    {
      label: "E-posta",
      description: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      icon: Icons.email,
    },
    {
      label: "Ofis",
      description: `${OFFICE.company} · ${OFFICE.district}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${OFFICE.company} ${OFFICE.street} ${OFFICE.district} ${OFFICE.city}`
      )}`,
      icon: MapPinIcon,
    },
    {
      label: "Instagram",
      description: `@${CONTACT.instagramHandle}`,
      href: INSTAGRAM_URL,
      icon: Icons.instagram,
    },
  ],

  contact: {
    email: CONTACT.email,
    tel: CONTACT.telE164,
    /** vCard'a sosyal profil olarak eklenir. */
    social: {
      WhatsApp: {
        name: "WhatsApp",
        url: `https://wa.me/${CONTACT.telE164.replace(/\D/g, "")}`,
      },
      Instagram: { name: "Instagram", url: INSTAGRAM_URL },
    },
  },
};
