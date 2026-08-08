"use client";

import { LinkCard } from "@/components/link-card";
import { ModeToggle } from "@/components/mode-toggle";
import { Iridescence } from "@/components/reactbits/iridescence";
import { SiteFooter } from "@/components/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTheme } from "next-themes";

/**
 * Gökkuşağı arka planının tema başına ana rengi (0-1 RGB).
 *
 * Açık temada koyu, koyu temada açık: her iki durumda da arka plan zemine
 * yaklaşmak yerine ondan ayrışsın, böylece efekt gerçekten görünür olsun.
 */
const IRIDESCENCE_COLOR = {
  light: [0.78, 0.76, 0.88],
  dark: [0.6, 0.54, 0.82],
} as const;

/** Profil fotoğrafının çapı (px). Rozetler bundan türetilir. */
const AVATAR_SIZE = 116;
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
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

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
      {/* Gökkuşağı arka planı + üstünde metni okunur tutan perde.
          Shader yalnızca istemcide ve tema bilindikten sonra kurulur, yoksa
          koyu temada bir an açık renkle başlayıp zıplıyor. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {mounted && (
          <Iridescence
            color={isDark ? IRIDESCENCE_COLOR.dark : IRIDESCENCE_COLOR.light}
            speed={0.6}
            amplitude={0.1}
            mouseReact
            paused={reduceMotion ?? false}
          />
        )}
        <div className="absolute inset-0 bg-background/64 dark:bg-background/70" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex w-full flex-col items-center gap-8"
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
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <AvatarFallback className="text-xl">
                    {DATA.initials}
                  </AvatarFallback>
                </Avatar>

                {/* Güneydoğu (−45°) */}
                <span
                  role="img"
                  aria-label={DATA.status.label}
                  style={{
                    ...badgeStyle(SE),
                    fontSize: BADGE_ICON_SIZE,
                    lineHeight: 1,
                  }}
                  className={BADGE_CLASS}
                >
                  {DATA.status.emoji}
                </span>

                {/* Kuzeydoğu (+45°). Fotoğrafla aynı hover animasyonuna
                    katılsın diye motion kutusunun içinde. */}
                <ModeToggle
                  style={badgeStyle(NE)}
                  className={cn(BADGE_CLASS, "z-10")}
                />
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tighter sm:text-3xl">
                {DATA.name}
              </h1>
              <p className="max-w-xs text-balance text-sm text-muted-foreground">
                {DATA.description}
              </p>
              <a
                href={DATA.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <MapPin className="size-3" aria-hidden />
                {DATA.location}
              </a>
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
