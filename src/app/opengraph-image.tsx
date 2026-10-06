import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #06060f 0%, #1e1b4b 60%, #0f766e 100%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 36, color: "#5eead4", fontFamily: "monospace" }}>{"> hello, world"}</div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 16 }}>{profile.name}</div>
        <div style={{ fontSize: 40, color: "#cbd5e1", marginTop: 12 }}>
          {`${profile.role} — ${profile.headline}`}
        </div>
        <div style={{ fontSize: 28, color: "#a78bfa", marginTop: 48 }}>Step into my 3D developer room →</div>
      </div>
    ),
    size,
  );
}
