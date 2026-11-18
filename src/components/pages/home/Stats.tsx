"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";
import { Reveal } from "@/components/ui/motion-wrapper";
import type { SiteContent } from "@/lib/cms/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Animated count-up hook — transform-free, rAF-driven, reduced-motion safe. */
function useCountUp(target: number, skip: boolean | null) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (skip) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo — premium deceleration
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, skip]);
  return val;
}

function StatCell({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix?: string | null;
  label: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const display = useCountUp(value, reduce);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="flex flex-col border-2 border-background bg-background p-5 text-foreground"
    >
      {/* Number row — fixed height + tabular-nums so all stats align
          regardless of digit count (3 vs 1,180). items-end + leading-none
          pins the baseline. */}
      <div className="flex h-[2.75rem] items-end gap-0.5 font-display text-4xl font-bold leading-none tracking-tight tabular-nums sm:h-[3.25rem] sm:text-5xl">
        <span>{display.toLocaleString()}</span>
        {suffix && <span className="text-primary">{suffix}</span>}
      </div>
      <div className="mt-3 border-t-2 border-background pt-2">
        <span className="label-mono text-muted-foreground">{label}</span>
      </div>
    </motion.div>
  );
}

/** Headline numbers, edited in the CMS. Renders nothing when none exist. */
export default function Stats({ site }: { site?: SiteContent }) {
  // Optional only for the pre-CMS home page S1 replaces; it renders nothing.
  if (!site || site.stats.items.length === 0) return null;

  return (
    <section className="rule-top bg-foreground py-14 text-background">
      <Container>
        <Reveal className="mb-6 flex items-center justify-between gap-4">
          <span className="label-mono text-primary">{site.stats.eyebrow}</span>
          <span className="label-mono text-background/50">{site.stats.note}</span>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {site.stats.items.map((stat, i) => (
            <StatCell key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
