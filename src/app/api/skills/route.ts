import { getSkills } from "@/lib/notion/skills";
import { response } from "@/lib/utils";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const limitParam = searchParams.get("limit");

    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const techs = await getSkills({
      limit,
    });

    return response(true, 200, techs);
  } catch (error) {
    console.error("Techs GET error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
