"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Database, Layout, Server, ShieldCheck, Rocket } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";

const STEPS = [
  {
    no: "01",
    icon: Database,
    title: "Schema first",
    body: "I model the data before the UI. Prisma/Drizzle migrations, constraints, and indexes land before a single component. If the schema is wrong, the product is wrong.",
    tools: ["PostgreSQL", "Drizzle", "Zod"],
  },
  {
    no: "02",
    icon: Server,
    title: "API contract",
    body: "Hono routes with typed inputs and outputs. I write the client SDK against the contract, not the implementation, so frontend and backend can move in parallel.",
    tools: ["Hono", "Zod", "tRPC"],
  },
  {
    no: "03",
    icon: Layout,
    title: "Frontend build",
    body: "Next.js App Router, server components by default, client islands only where interactivity demands it. Design tokens, not magic numbers. Accessibility from the first commit.",
    tools: ["Next.js", "Tailwind", "Radix"],
  },
  {
    no: "04",
    icon: ShieldCheck,
    title: "Tests & CI",
    body: "Vitest for units, Playwright for the flows that matter. CI runs on every push — type-check, lint, tests, build. A red main branch is a bug, not a Tuesday.",
    tools: ["Vitest", "Playwright", "GH Actions"],
  },
  {
    no: "05",
    icon: Rocket,
    title: "Ship & observe",
    body: "Deploy to Vercel/Fly with feature flags where it counts. Logs, traces, and error boundaries so I know it broke before the user emails me. Iterate on real signal.",
    tools: ["Vercel", "Sentry", "Flags"],
  },
] as const;

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section id="process" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <span className="label-mono text-primary">/ How I work</span>
          <h2 className="heading-section mt-3 max-w-[18ch]">
            From schema to deploy, owned.
          </h2>
        </Reveal>

        {/* Timeline — uses a consistent left-rail on mobile and a centered rail
            on desktop. The rail and node badges share the same horizontal
            axis via a dedicated column, eliminating the center-offset drift. */}
        <div className="relative">
          <Stagger staggerDelay={0.08} className="space-y-4 md:space-y-8">
            {STEPS.map((step, i) => {
              const isRight = i % 2 === 1;
              const Icon = step.icon;
              return (
                <StaggerItem key={step.no}>
                  <div className="relative grid grid-cols-[2.25rem_1fr] gap-4 md:grid-cols-2 md:gap-0">
                    {/* Rail + node column (fixed width on mobile, half-width on desktop) */}
                    <div className="relative md:flex md:justify-end md:pr-8">
                      {/* The rail: a full-height vertical line. On mobile it sits
                          in the center of this 2.25rem column; on desktop it's
                          pushed to the right edge (which is the page center). */}
                      <div
                        className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-border md:left-auto md:right-0 md:translate-x-1/2"
                        aria-hidden
                      />
                      {/* Node badge — centered on the rail */}
                      <motion.div
                        initial={reduce ? false : { scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 18,
                          delay: 0.1,
                        }}
                        className="relative z-10 my-2 grid size-9 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-brutal-sm md:my-0"
                      >
                        <Icon size={16} strokeWidth={2.5} />
                      </motion.div>
                    </div>

                    {/* Card column */}
                    <div
                      className={`md:pl-8 ${
                        isRight ? "md:col-start-1 md:row-start-1 md:pr-8 md:pl-0 md:text-right" : ""
                      }`}
                    >
                      <div className="group border-2 border-border bg-card p-5 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal">
                        <div
                          className={`flex items-center gap-3 border-b-2 border-border pb-3 ${
                            isRight ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <span className="font-display text-3xl font-bold text-primary">
                            {step.no}
                          </span>
                          <h3 className="font-display text-xl font-bold tracking-tight">
                            {step.title}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                        <div
                          className={`mt-4 flex flex-wrap gap-2 ${
                            isRight ? "md:justify-end" : ""
                          }`}
                        >
                          {step.tools.map((tool) => (
                            <span
                              key={tool}
                              className="border-2 border-border bg-background px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted-foreground"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
