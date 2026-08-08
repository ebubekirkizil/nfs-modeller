"use client";

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

/**
 * MagicUI'nin View Transitions tabanlı tema düğmesi, next-themes'e bağlanmış hâli.
 *
 * Bileşen "kontrollü" modda çalışır: `theme` prop'u verildiği için kalıcılığı
 * next-themes üstlenir, bileşen kendi başına localStorage'a yazmaz.
 */
export function ModeToggle({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  // Yalnızca yerleşim ve etkileşim durumları burada. Kenarlık/zemin bilinçli
  // olarak yok: düğmenin görünümünü çağıran taraf veriyor, böylece yanındaki
  // durum rozetiyle birebir aynı çemberi paylaşabiliyor.
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className
  );

  // Hidrasyon beklemeye gerek yok: güneş/ay seçimi artık JS state'iyle değil,
  // <html> üzerindeki `dark` sınıfına bakan CSS varyantlarıyla yapılıyor.
  // Sunucu ve istemci aynı DOM'u üretiyor, dolayısıyla uyuşmazlık olmuyor.
  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={setTheme}
      variant="circle"
      // Hareketi azaltma tercihinde geçiş anında tamamlanır.
      duration={reduceMotion ? 0 : 500}
      className={classes}
      style={style}
    />
  );
}
