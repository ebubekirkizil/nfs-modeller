import { cn } from "@/lib/utils";

/** Siteyi yapan kişi. Kullanıcı adı ve profil adresi tek yerde. */
const BUILDER = {
  handle: "SentientWire",
  url: "https://sentientwire.com",
};

/** Sayfa altındaki telif satırı. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "text-center text-xs text-muted-foreground",
        className
      )}
    >
      {/* Boşluk gerçek bir karakter — flex `gap` sınıfına bağlı değil. */}
      <span className="tabular-nums">© {new Date().getFullYear()}</span>{" "}
      {/* Bağlantı yalnızca kullanıcı adını sarar: bağlantı metni tek başına
          okunduğunda anlamlı olmalı ("yhcelebi"). */}
      <a
        href={BUILDER.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {BUILDER.handle}
      </a>
    </footer>
  );
}
