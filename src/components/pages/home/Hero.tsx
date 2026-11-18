"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { MaskLine } from "@/components/ui/motion-wrapper";
import MagneticButton from "@/components/magnetic-button";
import type { SiteContent } from "@/lib/cms/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Props are optional only so the pre-CMS home page still type-checks until S1
 * replaces it; without site data the section renders nothing rather than
 * inventing copy. S1 always passes the full object.
 */
export default function Hero({
  site,
  onScrollToProjects,
  onScrollToContact,
}: {
  site?: SiteContent;
  onScrollToProjects?: () => void;
  onScrollToContact?: () => void;
}) {
  const reduce = useReducedMotion();
  if (!site) return null;

  const marquee = site.hero.marquee.map((item) => item.label);

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
            <span
              className={site.identity.available ? "size-2 bg-primary" : "size-2 bg-muted-foreground"}
              aria-hidden
            />
            <span className="label-mono text-foreground">{site.identity.name}</span>
          </span>
          {site.identity.available && site.identity.availabilityLabel && (
            <span className="inline-flex items-center border-2 border-primary bg-card px-2.5 py-1 shadow-brutal-sm">
              <span className="label-mono text-primary">
                {site.identity.availabilityLabel}
              </span>
            </span>
          )}
          <span className="label-mono text-muted-foreground">
            {[site.identity.location, site.identity.timezone]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </motion.div>

        {/* Type runs the full container now that the portrait is gone. */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.04, ease: EASE }}
          className="label-mono mb-3 text-primary"
        >
          {site.hero.eyebrow}
        </motion.p>
        <h1 className="display text-foreground">
          <MaskLine delay={0.08}>{site.hero.headline}</MaskLine>
          <MaskLine delay={0.18}>
            <span className="hl-coral">{site.hero.headlineAccent}</span>
          </MaskLine>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-8 max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          {site.hero.intro}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <MagneticButton strength={10} className="inline-flex">
            <Button size="lg" onClick={onScrollToProjects} className="cursor-pointer">
              {site.hero.primaryCta}
            </Button>
          </MagneticButton>
          <MagneticButton strength={10} className="inline-flex">
            <Button
              size="lg"
              variant="outline"
              onClick={onScrollToContact}
              className="cursor-pointer"
            >
              {site.hero.secondaryCta}
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
            {marquee.concat(marquee).map((item, i) => (
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
