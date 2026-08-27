"use client";

import * as React from "react";
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  MessageSquare,
  CircleDot,
  Tag,
  ExternalLink,
} from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import type { GithubEvent } from "@/lib/github";

/** Icon + verb per GitHub event type. Pushes get the accent treatment. */
const EVENT_CONFIG: Record<
  string,
  { icon: typeof GitBranch; label: string; accent: boolean }
> = {
  PushEvent: { icon: GitCommit, label: "push", accent: true },
  PullRequestEvent: { icon: GitPullRequest, label: "pull request", accent: false },
  CreateEvent: { icon: GitBranch, label: "create", accent: false },
  ReleaseEvent: { icon: Tag, label: "release", accent: false },
  IssuesEvent: { icon: CircleDot, label: "issue", accent: false },
  IssueCommentEvent: { icon: MessageSquare, label: "comment", accent: false },
};

/** Format an ISO timestamp as a relative "3h ago" string. */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

/**
 * Recent public GitHub activity, fetched through /api/github so the call is
 * made server-side and cached for 10 minutes — the rate limit is spent once
 * per window for the whole site instead of once per visitor.
 *
 * There is no curated fallback: if GitHub is unreachable the section removes
 * itself rather than presenting invented commits as live activity.
 */
export default function GitHubActivity() {
  const [events, setEvents] = React.useState<GithubEvent[] | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    fetch("/api/github")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error("request failed");
        return Array.isArray(json.data) ? (json.data as GithubEvent[]) : [];
      })
      .then((list) => {
        if (!active) return;
        if (list.length > 0) setEvents(list);
        else setFailed(true);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (failed) return null;

  return (
    <section id="github" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label-mono text-primary">/ Live activity</span>
            <h2 className="heading-section mt-3 max-w-[18ch]">
              Currently shipping.
            </h2>
          </div>
          <a
            href="https://github.com/zdnemz"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-foreground hover:text-background hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <span className="label-mono">GitHub profile</span>
            <ExternalLink
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Reveal>

        {events === null ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 border-2 border-border bg-card p-4 shadow-brutal-sm"
              >
                <div className="size-10 border-2 border-border bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-muted" />
                  <div className="h-3 w-1/2 bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Stagger staggerDelay={0.08} className="space-y-3">
            {events.map((event) => {
              const config = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.PushEvent;
              const Icon = config.icon;
              return (
                <StaggerItem key={event.id}>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 border-2 border-border bg-card p-4 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal"
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center border-2 ${
                        config.accent
                          ? "border-border bg-primary text-primary-foreground"
                          : "border-border bg-foreground text-background"
                      }`}
                    >
                      <Icon size={16} strokeWidth={2.5} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="label-mono text-muted-foreground">
                          {config.label}
                        </span>
                        <span className="truncate font-display text-sm font-bold tracking-tight transition-colors duration-150 group-hover:text-primary">
                          {event.repo}
                        </span>
                      </div>
                      {event.detail && (
                        <p className="mt-1 truncate font-mono text-xs text-foreground/70">
                          {event.detail}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end justify-center gap-1">
                      <span className="label-mono border-2 border-border bg-background px-1.5 py-0.5 text-foreground">
                        {event.summary}
                      </span>
                      <span className="label-mono text-muted-foreground">
                        {timeAgo(event.created_at)}
                      </span>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </Container>
    </section>
  );
}
