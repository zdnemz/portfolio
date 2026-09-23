"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { useHomeContext } from "@/contexts/HomeContext";
import { MaskLine } from "@/components/ui/motion-wrapper";
import MagneticButton from "@/components/magnetic-button";

const EASE = [0.16, 1, 0.3, 1] as const;

const MARQUEE_ITEMS = [
  "TypeScript",
  "Next.js",
  "Hono",
  "PostgreSQL",
  "Drizzle ORM",
  "Redis",
  "React",
  "Tailwind",
  "Docker",
  "CI/CD",
];

export default function Hero() {
  const { scrollToProjects, scrollToContact } = useHomeContext();
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative flex min-h-[100dvh] flex-col pt-24 pb-0">
      <Container className="flex-1 flex flex-col justify-center py-10">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 border-2 border-border bg-card px-2.5 py-1 shadow-brutal-sm">
            <span className="size-2 bg-primary" aria-hidden />
            <span className="label-mono text-foreground">Maulana Zidane</span>
          </span>
          <span className="label-mono text-muted-foreground">
            Banjarmasin, South Kalimantan, ID · UTC+8
          </span>
        </motion.div>

        {/* Type runs the full container now that the portrait is gone. */}
        <h1 className="display text-foreground">
          <MaskLine delay={0.08}>Fullstack</MaskLine>
          <MaskLine delay={0.18}>
            <span className="hl-coral">developer.</span>
          </MaskLine>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-8 max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          I build production web systems where correctness and security
          matter. Next.js and Hono on the front, PostgreSQL behind it,
          Solidity on-chain where trust needs proving.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <MagneticButton strength={10} className="inline-flex">
            <Button size="lg" onClick={scrollToProjects} className="cursor-pointer">
              View work
            </Button>
          </MagneticButton>
          <MagneticButton strength={10} className="inline-flex">
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToContact}
              className="cursor-pointer"
            >
              Get in touch
            </Button>
          </MagneticButton>
        </motion.div>
      </Container>

      {/* Kinetic marquee — tech stack scrolling band. Sits at the foot of the hero. */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
        className="relative mt-6 border-y-2 border-border bg-foreground text-background"
      >
        <div className="flex overflow-hidden py-2.5">
          <div className="animate-marquee flex shrink-0 items-center gap-6 pr-6">
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, i) => (
              <span key={i} className="flex items-center gap-6">
                <span className="label-mono text-background">{item}</span>
                <span className="text-primary" aria-hidden>/</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
