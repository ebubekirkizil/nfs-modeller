"use client";

import { useState, useEffect } from "react";

import { LinkCard } from "@/components/link-card";
import { ModeToggle } from "@/components/mode-toggle";
import { Iridescence } from "@/components/reactbits/iridescence";
import { SiteFooter } from "@/components/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";


/** Profil fotoğrafının çapı (px). Rozetler bundan türetilir. */
const AVATAR_SIZE = 128;
/** İki rozetin de çapı (px) — güneydoğu ve kuzeydoğu aynı boyutta. */
const BADGE_SIZE = 32;
/** Rozetlerin içindeki simge boyutu. Emoji ve güneş/ay ikonu eşit görünsün
 *  diye ikisi de 16px: ikon tarafında bunun karşılığı `size-4`. */
const BADGE_ICON_SIZE = 16;

/**
 * Rozet merkezinin çember üzerindeki konumu.
 * Merkez (r, r); açı θ için nokta = (r + r·cosθ, r − r·sinθ).
 * ±45° için r·cos45 = r·(√2/2).
 */
const RADIUS = AVATAR_SIZE / 2;
const DIAGONAL = RADIUS * Math.SQRT1_2;
/** Kuzeydoğu (+45°) — tema düğmesi. */
const NE = { left: RADIUS + DIAGONAL, top: RADIUS - DIAGONAL };
/** Güneydoğu (−45°) — durum rozeti. */
const SE = { left: RADIUS + DIAGONAL, top: RADIUS + DIAGONAL };

/**
 * İki rozetin ortak görünümü — tek kaynak.
 * Ev emojisi ve tema düğmesi birebir aynı çemberi kullansın diye burada
 * tanımlı; `ring-2 ring-background` rozeti fotoğrafın kenarından ayırıyor.
 */
const BADGE_CLASS =
  "absolute flex items-center justify-center rounded-full border-2 border-border bg-background shadow-sm ring-2 ring-background";

/** Rozeti verilen noktanın tam üstüne, merkezinden hizalayarak oturtur. */
const badgeStyle = (point: { left: number; top: number }) => ({
  left: point.left,
  top: point.top,
  width: BADGE_SIZE,
  height: BADGE_SIZE,
  transform: "translate(-50%, -50%)",
});

export default function CardPage() {
  const [bgKey, setBgKey] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        // iOS Safari BFCache dönüşünde WebGL context'i kaybediyor olabilir.
        // Geri dönüldüğünde arka planı tamamen sıfırdan mount etmek için key'i artır.
        setBgKey((prev) => prev + 1);
      }
    }
    
    // Hem sekme aktifliği (visibility) hem de BFCache dönüşü için dinle
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handleVisibilityChange);
    };
  }, []);

  // Hareketi azaltma tercihinde yalnızca opaklık geçişi kalır.
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.06,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const item: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  return (
    <>
      {/* Lüks konut fotoğraflarından oluşan eğik ızgara + okunurluk perdesi.
          Kutu bilinçli olarak ekrandan taşırılıyor:
          - Yükseklik `100lvh` (araç çubuğu gizliymiş gibi en büyük yükseklik).
            Safari'nin çubuğu kaydırırken açılıp kapanması görünür alanın
            yüksekliğini değiştiriyor; `inset-0` bunu takip edince arka plan
            sürekli yeniden boyutlanıyordu. `lvh` sabit kaldığı için titremez.
          - Üstte ve altta `env(safe-area-inset-*)` kadar taşma: arka plan durum
            çubuğunun ve alt araç çubuğunun altına kadar uzansın. */}
      <div
        className="pointer-events-none fixed z-0"
        style={{
          top: "calc(-1 * env(safe-area-inset-top, 0px))",
          left: 0,
          right: 0,
          height:
            "calc(100lvh + env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Teknolojik, modern, inovatif arka plan animasyonu */}
        <Iridescence key={bgKey} color={[0.1, 0.4, 0.8]} mouseReact={true} paused={reduceMotion ?? false} />
        {/* Sayfa geneli perde: okunurluğu korumak için */}
        <div className="absolute inset-0 bg-background/40 dark:bg-background/60" />
      </div>

      {/* Dolgu `env(safe-area-inset-*)` ile: viewport-fit=cover sayesinde sayfa
          çentik ve ana ekran çubuğunun altına kadar uzanıyor, içerik oraya
          girmesin. */}
      <main
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-8 px-6"
        style={{
          paddingTop: "max(4rem, env(safe-area-inset-top))",
          paddingBottom: "max(4rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* İçerik kartı: metnin okunurluğunu tamamen bu katman sağlıyor.
            `backdrop-blur-2xl` yalnızca kartın altındaki fotoğrafları
            bulanıklaştırır — kartın dışında evler net kalır. */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex w-full flex-col items-center gap-8 rounded-3xl border border-border/60 bg-background/85 p-6 shadow-2xl backdrop-blur-md sm:p-8 dark:bg-background/80"
        >
          <motion.div
            variants={item}
            className="flex flex-col items-center gap-3 text-center"
          >
            {/* Fotoğraf + çember üzerindeki iki rozet.
                Ölçü ve konumlar satır içi `style` ile veriliyor; Tailwind
                sınıfına bağlı değil. Sebep: shadcn Avatar'ın temel sınıfı
                `h-10 w-10` ve tailwind-merge bunu `size-` sınıflarıyla aynı
                grupta saymıyor, yani `size-24` onu güvenilir biçimde geçersiz
                kılamıyor. Satır içi stil bu belirsizliği tamamen kaldırır. */}
            <div
              className="relative"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            >
              <motion.div
                className="group size-full"
                whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                // Motion, whileTap gören her öğeye tabindex="0" basıyor.
                // Fotoğraf tıklanabilir değil; klavye sırasına girmemeli.
                tabIndex={-1}
              >
                {/* Kenarlık reçetesi fotoğraf ve iki rozette aynı:
                    `border-2 border-border`. Vurgu halkası yalnızca hover'da
                    çıkar; ring yerleşimi etkilemediği için zıplama olmaz. */}
                <Avatar className="h-full w-full rounded-full border-2 border-border shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:ring-4 group-hover:ring-emerald-600/30">
                  <AvatarImage
                    alt={DATA.name}
                    src={DATA.avatarUrl}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <AvatarFallback className="text-xl">
                    {DATA.initials}
                  </AvatarFallback>
                </Avatar>

                {/* Kuzeydoğu (+45°). Fotoğrafla aynı hover animasyonuna
                    katılsın diye motion kutusunun içinde. */}
                <ModeToggle
                  style={badgeStyle(NE)}
                  className={cn(BADGE_CLASS, "z-10")}
                />
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              {/* Playfair Display yalnızca isimde. Serif olduğu için sıkı
                  `tracking-tighter` yerine normal harf aralığı daha iyi
                  duruyor. */}
              <h1
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {DATA.name}
              </h1>
              <p className="max-w-xs text-balance text-sm text-muted-foreground">
                {DATA.description}
              </p>
            </div>
          </motion.div>

          <ul className="flex w-full flex-col gap-3">
            {DATA.links.map((link) => (
              <LinkCard key={link.label} item={link} />
            ))}
          </ul>

          <motion.div variants={item}>
            <SiteFooter />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
