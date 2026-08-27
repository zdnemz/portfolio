"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { useHomeContext } from "@/contexts/HomeContext";
import { MaskLine } from "@/components/ui/motion-wrapper";
import MagneticButton from "@/components/magnetic-button";
import CursorSpotlight from "@/components/cursor-spotlight";

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
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Type block — deliberately wider than the asset */}
          <div className="lg:col-span-8">
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
                Banjarmasin, ID · UTC+8
              </span>
            </motion.div>

            <h1 className="display text-foreground">
              <MaskLine delay={0.08}>Fullstack</MaskLine>
              <MaskLine delay={0.18}>
                <span className="hl-coral">engineer.</span>
              </MaskLine>
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="mt-8 max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              I ship production web apps end to end. Next.js on the front, Hono
              and PostgreSQL behind it.
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
          </div>

          {/* Asset column — offset down to break the centre line */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="lg:col-span-4 lg:mt-20"
          >
            <div className="group relative aspect-[4/5] w-full max-w-[18rem] overflow-hidden border-2 border-border bg-muted shadow-brutal lg:ml-auto lg:max-w-none">
              <Image
                src="/images/me.jpg"
                alt="Maulana Zidane"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              {/* Cursor-follow spotlight — premium micro-interaction */}
              <CursorSpotlight size={200} />
              {/* Tape-tag corner label */}
              <div className="absolute left-0 top-0 z-10 border-b-2 border-r-2 border-border bg-primary px-2.5 py-1">
                <span className="label-mono text-primary-foreground">/01</span>
              </div>
            </div>
          </motion.div>
        </div>
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
