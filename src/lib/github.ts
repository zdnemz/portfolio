/**
 * Live GitHub data for the portfolio. Fetched server-side and cached so the
 * unauthenticated rate limit (60/hour) is spent per-server rather than per
 * visitor. Set GITHUB_TOKEN to raise it to 5000/hour.
 *
 * Every value here is real. When the API fails these functions throw and the
 * calling route returns an error — the sections render nothing rather than
 * showing invented activity.
 */

const GITHUB_USER = "zdnemz";
const API = "https://api.github.com";

/** Cache window shared by every GitHub call, in seconds. */
const REVALIDATE = 600;

export type GithubEvent = {
  id: string;
  /** Raw GitHub event type, e.g. "PushEvent" */
  type: string;
  /** "owner/repo" */
  repo: string;
  /** Short headline, e.g. "Merged PR #3" */
  summary: string;
  /** Optional second line — branch name, PR title, issue title */
  detail?: string;
  created_at: string;
  /** Where the event links to */
  url: string;
};

export type GithubProfile = {
  /** Whole years since the account was created */
  yearsShipping: number;
  publicRepos: number;
  followers: number;
};

async function gh<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": `${GITHUB_USER}-portfolio`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`GitHub ${path} failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: {
    ref?: string;
    ref_type?: string;
    action?: string;
    number?: number;
    pull_request?: { title?: string; head?: { ref?: string } };
    issue?: { title?: string; number?: number };
    release?: { name?: string; tag_name?: string; html_url?: string };
  };
};

/**
 * Map one raw event to display shape. Returns null for event types that carry
 * no signal on a portfolio (deleted branches, stars given, forks), so the feed
 * stays short without padding it out.
 *
 * Note: the aggregated user-events endpoint ships a stripped payload —
 * verified against the live feed, a push carries no commit list and a pull
 * request carries no title or html_url, only url/id/number/head/base. So a
 * push shows its branch, a PR shows its head branch, and links are built from
 * the repo and number rather than read off the payload.
 */
function mapEvent(e: RawEvent): GithubEvent | null {
  const repo = e.repo?.name;
  if (!repo) return null;

  const p = e.payload ?? {};
  const repoUrl = `https://github.com/${repo}`;
  const branch = p.ref?.replace(/^refs\/heads\//, "");
  const base = { id: e.id, type: e.type, repo, created_at: e.created_at };

  switch (e.type) {
    case "PushEvent":
      return { ...base, summary: "Pushed", detail: branch, url: repoUrl };

    case "PullRequestEvent": {
      const action =
        p.action === "closed"
          ? "Closed"
          : p.action === "merged"
            ? "Merged"
            : "Opened";
      return {
        ...base,
        summary: `${action} PR #${p.number ?? ""}`.trim(),
        detail: p.pull_request?.title ?? p.pull_request?.head?.ref,
        url: p.number ? `${repoUrl}/pull/${p.number}` : repoUrl,
      };
    }

    case "CreateEvent":
      return {
        ...base,
        summary: `Created ${p.ref_type ?? "branch"}`,
        detail: branch ?? p.ref,
        url: repoUrl,
      };

    case "ReleaseEvent":
      return {
        ...base,
        summary: "Released",
        detail: p.release?.name ?? p.release?.tag_name,
        url: p.release?.html_url ?? repoUrl,
      };

    case "IssuesEvent":
      return {
        ...base,
        summary:
          `${p.action === "closed" ? "Closed" : "Opened"} issue #${p.issue?.number ?? ""}`.trim(),
        detail: p.issue?.title,
        url: p.issue?.number ? `${repoUrl}/issues/${p.issue.number}` : repoUrl,
      };

    case "IssueCommentEvent":
      return {
        ...base,
        summary: "Commented",
        detail: p.issue?.title,
        url: p.issue?.number ? `${repoUrl}/issues/${p.issue.number}` : repoUrl,
      };

    default:
      return null;
  }
}

/**
 * Recent public activity, newest first. The GitHub endpoint does not
 * guarantee ordering, so sort explicitly.
 */
export async function getGithubEvents(limit = 5): Promise<GithubEvent[]> {
  const raw = await gh<RawEvent[]>(
    `/users/${GITHUB_USER}/events/public?per_page=100`
  );

  return raw
    .map(mapEvent)
    .filter((e): e is GithubEvent => e !== null)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, limit);
}

export async function getGithubProfile(): Promise<GithubProfile> {
  const user = await gh<{
    created_at: string;
    public_repos: number;
    followers: number;
  }>(`/users/${GITHUB_USER}`);

  const ageMs = Date.now() - Date.parse(user.created_at);
  const yearsShipping = Math.floor(ageMs / (365.25 * 24 * 3600_000));

  return {
    yearsShipping,
    publicRepos: user.public_repos,
    followers: user.followers,
  };
}
