import { getGithubEvents } from "@/lib/github";
import { response } from "@/lib/utils";

/**
 * Dynamic on purpose: the GitHub call itself is cached for 10 minutes in the
 * Data Cache (see lib/github.ts), so the rate limit is spent once per window
 * for the whole site — without a build-time failure getting baked into a
 * prerendered response.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await getGithubEvents(5);
    return response(true, 200, events);
  } catch (error) {
    console.error("GitHub events GET error:", error);
    return response(false, 502, "GitHub API unavailable");
  }
}
