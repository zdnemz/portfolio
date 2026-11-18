"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Cable, FileSearch, Workflow } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import type { SiteContent } from "@/lib/cms/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Structural icons by position — the CMS owns the words, not the glyphs. */
const SERVICE_ICONS = [FileSearch, Workflow, Cable];

/**
 * What I offer — three offers, each with the tools that back it up. Sits
 * between the selected work and the process so the pitch follows the proof.
 */
export default function Services({ site }: { site?: SiteContent }) {
  const reduce = useReducedMotion();
  // Optional only for the pre-CMS home page S1 replaces.
  if (!site) return null;
  const copy = site.services;

  return (
    <section id="services" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="label-mono text-primary">{copy.eyebrow}</span>
            <h2 className="heading-section mt-3 max-w-[18ch]">{copy.heading}</h2>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </Reveal>

        <Stagger
          staggerDelay={0.08}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {copy.items.map((offer, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <StaggerItem key={offer.title} className="h-full">
                <div className="group flex h-full flex-col border-2 border-border bg-card p-6 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal">
                  <div className="flex items-center justify-between border-b-2 border-border pb-3">
                    <motion.span
                      initial={reduce ? false : { rotate: -8, opacity: 0 }}
                      whileInView={{ rotate: 0, opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                      className="grid size-9 place-items-center border-2 border-border bg-foreground text-background"
                    >
                      <Icon size={16} strokeWidth={2.5} />
                    </motion.span>
                    <span className="label-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight transition-colors duration-150 group-hover:text-primary">
                    {offer.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {offer.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 border-t-2 border-border pt-4">
                    {offer.tools.map((tool) => (
                      <span
                        key={tool.label}
                        className="border-2 border-border bg-background px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted-foreground"
                      >
                        {tool.label}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
