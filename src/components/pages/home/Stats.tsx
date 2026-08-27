"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";
import { Reveal } from "@/components/ui/motion-wrapper";

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
  suffix?: string;
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

type Stat = { value: number; suffix?: string; label: string };

/** Placeholder cell — same box, no number, while the API call is in flight. */
function StatCellSkeleton() {
  return (
    <div className="flex flex-col border-2 border-background bg-background p-5 text-foreground">
      <div className="flex h-[2.75rem] items-end sm:h-[3.25rem]">
        <div className="h-8 w-16 animate-pulse bg-muted sm:h-10 sm:w-20" />
      </div>
      <div className="mt-3 border-t-2 border-background pt-2">
        <div className="h-3 w-24 animate-pulse bg-muted" />
      </div>
    </div>
  );
}

/**
 * Headline numbers, all live: years shipping and public repos come from the
 * GitHub profile, project and tech counts from the Notion database. If the
 * API call fails the section removes itself rather than showing stale or
 * invented figures.
 */
export default function Stats() {
  const [stats, setStats] = React.useState<Stat[] | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    fetch("/api/stats")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error("request failed");
        return json.data as Stat[];
      })
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) setStats(data);
        else setFailed(true);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (failed) return null;

  return (
    <section className="rule-top bg-foreground py-14 text-background">
      <Container>
        <Reveal className="mb-6 flex items-center justify-between gap-4">
          <span className="label-mono text-primary">/ By the numbers</span>
          <span className="label-mono text-background/50">
            Live from GitHub &amp; Notion
          </span>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats
            ? stats.map((stat, i) => (
                <StatCell key={stat.label} {...stat} index={i} />
              ))
            : [0, 1, 2, 3].map((i) => <StatCellSkeleton key={i} />)}
        </div>
      </Container>
    </section>
  );
}
