"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/ui/motion-wrapper";

const EASE = [0.16, 1, 0.3, 1] as const;

type QA = { q: string; a: string };

// Anti-slop per SKILL.md: concrete answers, real numbers, no filler.
const FAQS: QA[] = [
  {
    q: "What's your availability?",
    a: "Open to full-time roles and contract work. For contracts, I batch 2-3 concurrent engagements so a new project typically starts within 2-3 weeks. Full-time roles can start within 4 weeks of an offer — I don't ghost my current clients.",
  },
  {
    q: "Do you work remotely or on-site?",
    a: "Remote-first, based in Banjarmasin, Indonesia (UTC+8). I've shipped with teams across UTC-8 to UTC+2 and I'm comfortable async. On-site is possible for the right role in Singapore, Jakarta, or KL — anywhere a direct flight gets me home for the weekend.",
  },
  {
    q: "What's your typical project size?",
    a: "Greenfield fullstack builds in the 6-16 week range are my sweet spot — Next.js + Hono + Postgres, schema to deploy. Smaller engagements (1-3 weeks) work for focused work: a performance audit, a CI overhaul, or an architecture review. I don't take pure-design work.",
  },
  {
    q: "How do you handle estimates and pricing?",
    a: "Fixed scope, fixed price for well-defined work. Time-and-materials for discovery-heavy or evolving scopes. I write estimates as a range (best case / likely / worst case) with the assumptions behind each, not a single number. No surprises mid-project.",
  },
  {
    q: "Can you work with an existing team?",
    a: "Yes — I've slotted into teams of 3-12 as both an IC and a tech lead. I write code that matches the existing style, not my preference. PRs are small, reviewed, and mergeable within a day. I document the why, not just the what.",
  },
  {
    q: "What if the project needs a stack you don't know?",
    a: "I'll tell you upfront. I won't bill learning time for a core skill on a fixed-price contract. For adjacent stacks (e.g. Remix if you use Next.js), ramp-up is ~1 week and I absorb it. For something genuinely new, I'll recommend someone from my network instead of pretending.",
  },
];

function FaqItem({ qa, index }: { qa: QA; index: number }) {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="border-b-2 border-border">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-150 hover:text-primary"
      >
        <div className="flex items-center gap-4">
          <span className="font-display text-sm font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-base font-bold tracking-tight sm:text-lg">
            {qa.q}
          </span>
        </div>
        <span
          className={`grid size-8 shrink-0 place-items-center border-2 border-border transition-all duration-150 ${
            open
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground group-hover:bg-foreground group-hover:text-background"
          }`}
        >
          {open ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-5 pl-10 pr-12 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {qa.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="section-pad rule-top">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <span className="label-mono text-primary">/ FAQ</span>
            <h2 className="heading-section mt-3 max-w-[16ch]">
              Questions I get asked.
            </h2>
            <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
              The short version of the conversations I have with recruiters and
              founders. If your question isn't here,{" "}
              <a
                href="#contact"
                className="font-semibold text-primary underline underline-offset-2 hover:no-underline"
              >
                ask me directly
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="border-t-2 border-border">
              {FAQS.map((qa, i) => (
                <FaqItem key={i} qa={qa} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
