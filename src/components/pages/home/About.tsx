"use client";

import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";

// Synced with the "About Me" and "Stack" sections of github.com/zdnemz/zdnemz
const STACK: [string, string[]][] = [
  ["Languages", ["TypeScript", "JavaScript", "PHP", "Python", "Rust", "Solidity"]],
  ["Frontend", ["Next.js", "React", "Tailwind CSS"]],
  ["Backend & Data", ["Node.js", "Hono", "Drizzle ORM", "PostgreSQL", "Redis", "Zod"]],
  ["DevOps & Tooling", ["Docker", "Linux", "Vercel", "Git", "GitHub Actions"]],
  ["Development", ["pnpm", "Bun", "Prettier", "Playwright", "Claude Code"]],
  ["Web3", ["Ethereum", "Hardhat", "OpenZeppelin", "Wagmi", "Viem"]],
];

// Asymmetric bento spans on desktop — avoids the banned uniform card wall.
const STACK_SPAN: Record<string, string> = {
  Languages: "lg:col-span-3",
  Frontend: "lg:col-span-3",
  "Backend & Data": "lg:col-span-2",
  "DevOps & Tooling": "lg:col-span-2",
  Development: "lg:col-span-2",
  Web3: "lg:col-span-6",
};

export default function About() {
  return (
    <section id="about" className="section-pad rule-top">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <span className="label-mono text-primary">/ About</span>
            <h2 className="heading-section mt-3 max-w-[18ch]">
              I own the system, not just the screen.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7 lg:pt-2">
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              3 years building production web applications. Next.js App Router on
              the front, Hono APIs and Drizzle/PostgreSQL on the back, Redis where
              it earns its place. I write tests and CI for the things that matter,
              and I&apos;m used to owning a system from schema to deploy without
              hand-holding.
            </p>
          </Reveal>
        </div>

        {/* Stack spec-sheet header */}
        <Reveal delay={0.12} className="mt-16 border-t-2 border-border pt-6">
          <div className="flex items-center justify-between">
            <span className="label-mono text-muted-foreground">/ Stack reference</span>
            <span className="label-mono text-muted-foreground">6 categories · 28 tools</span>
          </div>
        </Reveal>

        <Stagger
          staggerDelay={0.07}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6"
        >
          {STACK.map(([category, items]) => (
            <StaggerItem
              key={category}
              className={STACK_SPAN[category] ?? "lg:col-span-3"}
            >
              <div className="group h-full border-2 border-border bg-card p-5 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal">
                <div className="flex items-center justify-between border-b-2 border-border pb-3">
                  <h3 className="label-mono text-primary">{category}</h3>
                  <span className="label-mono text-muted-foreground">
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((name) => (
                    <span
                      key={name}
                      className="border-2 border-border bg-background px-2.5 py-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-foreground transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {name}
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
