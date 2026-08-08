import { ImageResponse } from "next/og";
import { DATA } from "@/data/resume";

export const alt = DATA.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const styles = {
  outer: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "#ffffff",
    padding: "40px",
  },
  card: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#fafafa",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "56px",
  },
  name: {
    fontSize: "64px",
    fontWeight: 600,
    lineHeight: 1.1,
    color: "#0a0a0a",
    letterSpacing: "-0.03em",
    marginBottom: "16px",
    maxWidth: "900px",
  },
  description: {
    fontSize: "28px",
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#525252",
    maxWidth: "820px",
  },
  location: {
    fontSize: "22px",
    color: "#a3a3a3",
    marginTop: "32px",
  },
} as const;

export default function Image() {
  return new ImageResponse(
    (
      <div style={styles.outer}>
        <div style={styles.card}>
          <div style={styles.name}>{DATA.name}</div>
          <div style={styles.description}>{DATA.description}</div>
          <div style={styles.location}>{DATA.location}</div>
        </div>
      </div>
    ),
    size
  );
}
