import { getProjects } from "@/lib/notion/projects";
import { response } from "@/lib/utils";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const limitParam = searchParams.get("limit");
    const featuredParam = searchParams.get("featured");

    const limit = limitParam ? parseInt(limitParam, 10) : 6;
    const isFeatured = featuredParam === "true";

    if (isNaN(limit) || limit <= 0) {
      return response(
        false,
        400,
        "Invalid 'limit' parameter. Must be a positive number."
      );
    }

    const filter = isFeatured
      ? {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        }
      : undefined;

    const projects = await getProjects({ limit, filter });

    return response(true, 200, projects);
  } catch (error) {
    console.error("Contact POST error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
