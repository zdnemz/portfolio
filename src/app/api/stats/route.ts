import { getGithubProfile } from "@/lib/github";
import { getProjects } from "@/lib/notion/projects";
import { response } from "@/lib/utils";

export const dynamic = "force-dynamic";

export type Stat = { value: number; suffix?: string; label: string };

/**
 * The four headline numbers. Every one is derived from a live source — the
 * GitHub profile and the Notion project database — so none of them can drift
 * away from the truth.
 */
export async function GET() {
  try {
    const [profile, projects] = await Promise.all([
      getGithubProfile(),
      getProjects({ limit: 100 }),
    ]);

    const technologies = new Set(projects.flatMap((p) => p.technologies));

    const stats: Stat[] = [
      { value: profile.yearsShipping, suffix: "+", label: "Years shipping" },
      { value: projects.length, label: "Projects shipped" },
      { value: profile.publicRepos, label: "Public repos" },
      { value: technologies.size, label: "Tech in stack" },
    ];

    return response(true, 200, stats);
  } catch (error) {
    console.error("Stats GET error:", error);
    return response(false, 502, "Stats unavailable");
  }
}
