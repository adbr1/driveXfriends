import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Drive x Friends — Club automobile au Luxembourg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(ellipse at 30% 0%, #0a1224 0%, #050505 60%), #050505",
          color: "#f4f1ea",
          fontFamily: "ui-sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(244,241,234,0.85), transparent)",
            boxShadow: "0 0 32px rgba(244,241,234,0.6)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#b8c0cc",
          }}
        >
          <span>I — Prologue</span>
          <span>49.6116°N · 6.1319°E</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 168,
              lineHeight: 0.92,
              letterSpacing: -4,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Drive</span>
            <span style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ color: "#b8c0cc", fontSize: 130, marginRight: 16 }}>×</span>
              <span>Friends</span>
            </span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              color: "#b8c0cc",
              letterSpacing: 0.4,
            }}
          >
            Le club automobile de référence au Luxembourg.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8a92a0",
          }}
        >
          <span>Luxembourg Automotive Club</span>
          <span>DXF · MMXXVI</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
