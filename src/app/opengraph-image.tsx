import { DATA } from "@/data/resume";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * WhatsApp / Twitter / LinkedIn önizlemesinde görünen kart.
 *
 * Fotoğraf derleme anında diskten okunup data URI olarak gömülüyor: böylece
 * görsel üretmek için sitenin yayında olmasına ya da ağ isteğine gerek kalmıyor
 * (henüz alan adı bağlanmamışken de doğru çalışır).
 */

export const alt = `${DATA.name} — ${DATA.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadAvatar(): Promise<string | null> {
  if (!DATA.avatarUrl) return null;
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", DATA.avatarUrl.replace(/^\//, ""))
    );
    const ext = path.extname(DATA.avatarUrl).toLowerCase();
    const mime = ext === ".png" ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${file.toString("base64")}`;
  } catch {
    // Fotoğraf yoksa kart yazıyla üretilmeye devam etsin.
    return null;
  }
}

export default async function Image() {
  const avatar = await loadAvatar();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          backgroundColor: "#0b0c10",
          padding: "0 80px",
        }}
      >
        {avatar && (
          <img
            src={avatar}
            alt=""
            width={300}
            height={300}
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              objectFit: "cover",
              border: "8px solid #1c1e22",
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#f4f5f7",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {DATA.name}
          </div>
          <div style={{ fontSize: 36, color: "#9ca0a8", marginTop: 16 }}>
            {DATA.description}
          </div>
          {/* Tek metin düğümü: Satori, birden çok çocuğu olan div'de açık
              `display: flex` istiyor. */}
          <div style={{ fontSize: 28, color: "#6b7280", marginTop: 28 }}>
            {`${DATA.company} · ${DATA.location}`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
