import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Zidane | Frontend Developer";

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0f0f0f",
          color: "white",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        <div>{title}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
