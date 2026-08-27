"use client";

import * as React from "react";
import { Quote } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import type { Endorsement } from "@/types/endorsement";

/** "Adinda Wirawan" -> "AW". Falls back to a single letter for one-word names. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function Avatar({ initials, accent }: { initials: string; accent?: boolean }) {
  return (
    <div
      className={`grid size-12 shrink-0 place-items-center border-2 border-border font-display text-lg font-bold ${
        accent ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
      }`}
    >
      {initials}
    </div>
  );
}

/**
 * Endorsements from the Notion database. Nothing is hardcoded here: until a
 * published row exists in Notion this section removes itself from the page
 * entirely, rather than filling the gap with invented quotes.
 */
export default function Testimonials() {
  const [endorsements, setEndorsements] = React.useState<Endorsement[] | null>(
    null
  );

  React.useEffect(() => {
    let active = true;
    fetch("/api/endorsements")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error("request failed");
        return Array.isArray(json.data) ? (json.data as Endorsement[]) : [];
      })
      .then((list) => {
        if (active) setEndorsements(list);
      })
      .catch(() => {
        if (active) setEndorsements([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // Render nothing while loading and nothing when empty — an endorsements
  // heading over a blank grid reads worse than no section at all.
  if (!endorsements || endorsements.length === 0) return null;

  return (
    <section id="testimonials" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <span className="label-mono text-primary">/ Endorsements</span>
          <h2 className="heading-section mt-3 max-w-[20ch]">
            People I&rsquo;ve shipped with.
          </h2>
        </Reveal>

        <Stagger
          staggerDelay={0.1}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3"
        >
          {endorsements.map((t, idx) => {
            // The first card carries the coral accent so the grid has a
            // deliberate entry point instead of three identical blocks.
            const accent = idx === 0;
            return (
              <StaggerItem key={t.id} className="h-full">
                <figure
                  className={`group flex h-full flex-col border-2 border-border bg-card p-6 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal ${
                    accent ? "lg:p-7" : ""
                  }`}
                >
                  <Quote
                    size={28}
                    strokeWidth={2.5}
                    className={`mb-4 shrink-0 ${accent ? "text-primary" : "text-foreground"}`}
                    aria-hidden
                  />
                  <blockquote
                    className={`flex-1 leading-relaxed text-foreground ${
                      accent
                        ? "font-display text-lg font-medium md:text-xl"
                        : "text-base"
                    }`}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t-2 border-border pt-4">
                    <Avatar initials={initialsOf(t.name)} accent={accent} />
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-bold tracking-tight">
                        {t.name}
                      </div>
                      {(t.role || t.company) && (
                        <div className="label-mono truncate text-muted-foreground">
                          {[t.role, t.company].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
