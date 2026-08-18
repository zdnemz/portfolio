import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Maulana Zidane | Fullstack Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#111114",
          color: "#f4f4f6",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 80,
          fontSize: 60,
          fontWeight: 600,
          letterSpacing: -2,
        }}
      >
        <div style={{ color: "#7aa2f7", fontSize: 26, marginBottom: 24, fontWeight: 400 }}>
          Fullstack Engineer
        </div>
        <div>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
