"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/ui/motion-wrapper";
import type { SiteContent } from "@/lib/cms/types";

const EASE = [0.16, 1, 0.3, 1] as const;

type QA = { question: string; answer: string };

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
            {qa.question}
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
              {qa.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq({ site }: { site?: SiteContent }) {
  // Optional only for the pre-CMS home page S1 replaces.
  if (!site) return null;
  const copy = site.faq;

  return (
    <section id="faq" className="section-pad rule-top">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <span className="label-mono text-primary">{copy.eyebrow}</span>
            <h2 className="heading-section mt-3 max-w-[16ch]">{copy.heading}</h2>
            <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
              {copy.intro}
            </p>
            <a
              href="#contact"
              className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-2 hover:no-underline"
            >
              {copy.contactPrompt}
            </a>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="border-t-2 border-border">
              {site.faq.items.map((qa, i) => (
                <FaqItem key={qa.question} qa={qa} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
