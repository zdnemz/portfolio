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

export default function About() {
  return (
    <section id="about" className="section-pad rule-top">
      <Container>
        <Reveal>
          <h2 className="heading-section max-w-[18ch]">
            I own the system, not just the screen.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            3 years building production web applications. Next.js App Router on
            the front, Hono APIs and Drizzle/PostgreSQL on the back, Redis where
            it earns its place. I write tests and CI for the things that matter,
            and I&apos;m used to owning a system from schema to deploy without
            hand-holding.
          </p>
        </Reveal>

        <Stagger
          staggerDelay={0.07}
          className="mt-20 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2"
        >
          {STACK.map(([category, items]) => (
            <StaggerItem key={category}>
              <h3 className="text-sm font-medium text-primary">{category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((name) => (
                  <span
                    key={name}
                    className="rounded-md border border-border px-2.5 py-1 text-[0.85rem] text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
