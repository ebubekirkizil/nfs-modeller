import { Icons } from "@/components/icons";
import { GlobeIcon, UserPlusIcon } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TEK DÜZENLEME NOKTASI
 *  Sitedeki bütün metin ve bağlantılar bu dosyadan gelir.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CONTACT = {
  email: "ebukizil@gmail.com", // Daha sonra eklenecek/değiştirilecek
  tel: "0551 069 88 12",
  telE164: "+905510698812",
  instagramHandle: "ebubekir.kizildas", 
};

const INSTAGRAM_URL = `https://www.instagram.com/${CONTACT.instagramHandle}`;

export const DATA = {
  name: "Ebubekir Kızıldaş",
  initials: "EK",
  url: "https://sentientwire.com",
  company: "Sentientwire",
  location: "Türkiye",
  locationLink: "https://sentientwire.com",
  address: {
    company: "Sentientwire",
    street: "",
    district: "",
    city: "",
    country: "Türkiye",
  },
  description: "Dijital Pazarlama Uzmanı",
  avatarUrl: "/ebubekir-kizildas/me.jpg",

  status: {
    emoji: "🚀",
    label: "Dijital Çözümler",
  },

  links: [
    {
      label: "Rehbere Ekle",
      description: "Kişi kartını telefonuna kaydet",
      href: "/ebubekir-kizildas/kartvizit.vcf",
      icon: UserPlusIcon,
      download: true,
      primary: true,
    },
    {
      label: "WhatsApp",
      description: "Bana doğrudan yaz",
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
      label: "Web Sitesi",
      description: "sentientwire.com",
      href: `https://sentientwire.com`,
      icon: GlobeIcon,
    },
    {
      label: "E-posta",
      description: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      icon: Icons.email,
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
    social: {
      WhatsApp: {
        name: "WhatsApp",
        url: `https://wa.me/${CONTACT.telE164.replace(/\D/g, "")}`,
      },
      Website: {
        name: "Web Sitesi",
        url: "https://sentientwire.com",
      },
      Instagram: { name: "Instagram", url: INSTAGRAM_URL },
    },
  },
};
