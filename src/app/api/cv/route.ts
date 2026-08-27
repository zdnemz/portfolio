import { getAssetUrl } from "@/lib/notion/assets";
import { response } from "@/lib/utils";

/** Notion's signed URLs are short-lived, so never cache this. */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = await getAssetUrl("CV");

    if (!url) {
      return response(false, 404, "No CV uploaded");
    }

    return response(true, 200, { url });
  } catch (error) {
    console.error("CV GET error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
