"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";

export type LinkItem = {
  label: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Vurgulu (dolu) satır — sayfada tek bir tane olmalı. */
  primary?: boolean;
  /**
   * Gezinme yerine dosya indirir (örn. vCard). Next yönlendirmesini atlayıp
   * düz bir <a download> kullanır.
   */
  download?: boolean;
};

const enterVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

/**
 * Kartvizit sayfasındaki tek bir bağlantı satırı.
 * Giriş animasyonu üst listedeki `staggerChildren` tarafından sürülür;
 * bu yüzden burada sadece `variants` tanımlanır, `animate` verilmez.
 */
export function LinkCard({ item }: { item: LinkItem }) {
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;
  const isExternal = item.href.startsWith("http");
  const ArrowIcon = item.download
    ? Download
    : item.primary
      ? ArrowRight
      : ArrowUpRight;

  // İndirme satırlarında Next yönlendirmesi devreye girmemeli.
  const Anchor = item.download ? "a" : Link;

  return (
    <motion.li
      variants={reduceMotion ? reducedVariants : enterVariants}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Anchor
        href={item.href}
        download={item.download ? "" : undefined}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={cn(
          "group flex h-14 w-full items-center gap-3 rounded-xl border px-4",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          item.primary
            ? // Vurgulu satırın rengi. Tek yerden değiştirilir; emerald-700
              // seçildi çünkü beyaz metinle 5.5:1 kontrast verir (emerald-600
              // 3.9:1'de kalıp WCAG AA'yı geçemiyor).
              "border-emerald-700 bg-emerald-700 text-white shadow-sm hover:bg-emerald-600"
            : // Yarı saydam: arkadaki gökkuşağı hafifçe geçsin, metin okunur kalsın.
              "border-border/70 bg-card/70 text-card-foreground shadow-xs backdrop-blur-md hover:bg-card/90"
        )}
      >
        <Icon className="size-5 flex-none" />
        <span className="flex min-w-0 flex-1 flex-col text-left">
          <span className="truncate text-sm font-medium leading-tight">
            {item.label}
          </span>
          {item.description && (
            <span
              className={cn(
                "truncate text-xs leading-tight",
                item.primary ? "text-white/80" : "text-muted-foreground"
              )}
            >
              {item.description}
            </span>
          )}
        </span>
        <ArrowIcon
          className={cn(
            "size-4 flex-none transition-transform duration-200",
            item.primary
              ? "group-hover:translate-x-0.5"
              : item.download
                ? "text-muted-foreground group-hover:translate-y-0.5"
                : "text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          )}
          aria-hidden
        />
      </Anchor>
    </motion.li>
  );
}
