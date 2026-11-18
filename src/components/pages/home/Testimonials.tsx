"use client";

import { Quote } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import type { SiteContent } from "@/lib/cms/types";

/** "Adinda Wirawan" -> "AW". Falls back to a single letter for one-word names. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?"
  );
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
 * Endorsements from the CMS. Nothing is hardcoded here: when no quote is
 * published the section removes itself from the page entirely, rather than
 * filling the gap with invented praise.
 */
export default function Testimonials({ site }: { site?: SiteContent }) {
  // Optional only for the pre-CMS home page S1 replaces. Render nothing when
  // empty — a heading over a blank grid reads worse than no section at all.
  if (!site || site.testimonials.items.length === 0) return null;
  const copy = site.testimonials;

  return (
    <section id="testimonials" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <span className="label-mono text-primary">{copy.eyebrow}</span>
          <h2 className="heading-section mt-3 max-w-[20ch]">{copy.heading}</h2>
        </Reveal>

        <Stagger
          staggerDelay={0.1}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3"
        >
          {copy.items.map((item, idx) => {
            // The first card carries the coral accent so the grid has a
            // deliberate entry point instead of identical blocks.
            const accent = idx === 0;
            return (
              <StaggerItem key={`${item.name}-${idx}`} className="h-full">
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
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t-2 border-border pt-4">
                    <Avatar initials={initialsOf(item.name)} accent={accent} />
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-bold tracking-tight">
                        {item.name}
                      </div>
                      {(item.role || item.company) && (
                        <div className="label-mono truncate text-muted-foreground">
                          {[item.role, item.company].filter(Boolean).join(" · ")}
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
