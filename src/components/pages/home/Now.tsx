"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/container";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * "Now" status — a small live block that rotates through current activities.
 * Gives the portfolio a sense of momentum without fake metrics.
 * Rotates client-side every 4s; reduced-motion shows only the first item.
 */
const NOW_ITEMS = [
  { label: "Currently building", value: "ShardVeil — on-chain card game" },
  { label: "Based in", value: "Banjarmasin, Indonesia (WITA)" },
  { label: "Open to", value: "Full-time & contract roles" },
  { label: "Local time", value: "" }, // value filled live, below
];

export default function Now() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [clock, setClock] = useState("--:--");

  // Rotate the now-items (skipped under reduced motion).
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % NOW_ITEMS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [reduce]);

  // Live local clock for the last slot.
  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Makassar",
        hour12: false,
      });
      setClock(fmt.format(new Date()));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const current = NOW_ITEMS[idx];
  const displayValue = current.label === "Local time" ? clock : current.value;

  return (
    <section className="rule-top bg-card">
      <Container className="py-6">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-start gap-3 border-2 border-border bg-background p-4 shadow-brutal-sm sm:flex-row sm:items-center sm:gap-5"
        >
          {/* Pulsing status dot */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-none bg-primary opacity-60" />
              <span className="relative inline-flex size-3 bg-primary" />
            </span>
            <span className="label-mono text-foreground">/ Now</span>
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />

          {/* Rotating label */}
          <div className="flex min-h-[1.75rem] flex-1 items-center gap-3">
            <Sparkles size={15} strokeWidth={2.5} className="shrink-0 text-primary" />
            <motion.div
              key={idx}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <span className="label-mono text-muted-foreground">{current.label}</span>
              <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                {displayValue || "—"}
              </span>
            </motion.div>
          </div>

          {/* Pager dots */}
          <div className="flex items-center gap-1.5" aria-hidden>
            {NOW_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show: ${NOW_ITEMS[i].label}`}
                className={`size-2 transition-colors duration-150 ${
                  i === idx ? "bg-primary" : "bg-border hover:bg-foreground"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
