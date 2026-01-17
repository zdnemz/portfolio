import { getProjectById } from "@/lib/notion/projects";
import { response } from "@/lib/utils";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return response(false, 400, "Missing project ID");
    }

    const project = await getProjectById(id);

    if (!project) {
      return response(false, 404, "Project not found");
    }

    return response(true, 200, project);
  } catch (error) {
    console.error("Project details API error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
