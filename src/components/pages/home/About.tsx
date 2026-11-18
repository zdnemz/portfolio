"use client";

import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import type { SiteContent } from "@/lib/cms/types";

/** CMS span value → the bento column span it has always used on desktop. */
const SPAN_CLASS: Record<string, string> = {
  "2": "lg:col-span-2",
  "3": "lg:col-span-3",
  "4": "lg:col-span-4",
};

export default function About({ site }: { site?: SiteContent }) {
  // Optional only for the pre-CMS home page S1 replaces.
  if (!site) return null;
  const copy = site.about;

  return (
    <section id="about" className="section-pad rule-top">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <span className="label-mono text-primary">{copy.eyebrow}</span>
            <h2 className="heading-section mt-3 max-w-[18ch]">{copy.heading}</h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7 lg:pt-2">
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {copy.bio}
            </p>
          </Reveal>
        </div>

        {/* Stack spec-sheet header */}
        <Reveal delay={0.12} className="mt-16 border-t-2 border-border pt-6">
          <div className="flex items-center justify-between">
            <span className="label-mono text-muted-foreground">
              {copy.stackEyebrow}
            </span>
            <span className="label-mono text-muted-foreground">{copy.stackNote}</span>
          </div>
        </Reveal>

        <Stagger
          staggerDelay={0.07}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6"
        >
          {site.about.groups.map((group) => (
            <StaggerItem
              key={group.title}
              className={SPAN_CLASS[group.span] ?? "lg:col-span-3"}
            >
              <div className="group h-full border-2 border-border bg-card p-5 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal">
                <div className="flex items-center justify-between border-b-2 border-border pb-3">
                  <h3 className="label-mono text-primary">{group.title}</h3>
                  <span className="label-mono text-muted-foreground">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item.label}
                      className="border-2 border-border bg-background px-2.5 py-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-foreground transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
