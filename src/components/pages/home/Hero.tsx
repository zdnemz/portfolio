"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { useHomeContext } from "@/contexts/HomeContext";
import { MaskLine } from "@/components/ui/motion-wrapper";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { scrollToProjects, scrollToContact } = useHomeContext();
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-center pt-24 pb-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Type block, deliberately wider than the asset */}
          <div className="lg:col-span-7">
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-6 text-sm text-muted-foreground"
            >
              Maulana Zidane
            </motion.p>

            <h1 className="display text-foreground">
              <MaskLine delay={0.08}>Fullstack engineer</MaskLine>
              <MaskLine delay={0.18} className="text-primary">
                who ships to production.
              </MaskLine>
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="mt-8 max-w-[46ch] text-lg leading-relaxed text-muted-foreground"
            >
              Next.js on the front, Hono and PostgreSQL behind it. Tests and CI
              on every push.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <Button size="lg" onClick={scrollToProjects} className="cursor-pointer">
                View work
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToContact}
                className="cursor-pointer"
              >
                Get in touch
              </Button>
            </motion.div>
          </div>

          {/* Asset column, offset down to break the centre line */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="lg:col-span-5 lg:mt-24"
          >
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-border lg:ml-auto lg:max-w-none">
              <Image
                src="/images/me.jpg"
                alt="Maulana Zidane"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
