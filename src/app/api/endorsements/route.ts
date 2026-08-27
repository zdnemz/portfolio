import { getEndorsements } from "@/lib/notion/endorsements";
import { response } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const endorsements = await getEndorsements();
    return response(true, 200, endorsements);
  } catch (error) {
    console.error("Endorsements GET error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
