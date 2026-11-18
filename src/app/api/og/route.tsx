import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getSite } from "@/lib/cms/get-site";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const site = await getSite();

  const title =
    searchParams.get("title") ||
    site.seo.title ||
    site.identity.name ||
    "Portfolio";
  const kicker =
    site.identity.wordmark || site.identity.name || "Fullstack Developer";
  const description = site.seo.description || site.identity.name || "Portfolio";

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
          {kicker}
        </div>
        <div>{title}</div>
        <div style={{ color: "#a1a1aa", fontSize: 26, marginTop: 24, fontWeight: 400, letterSpacing: 0 }}>
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
