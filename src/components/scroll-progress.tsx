"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Scroll progress indicator — a hard-edged coral bar pinned to the very top
 * of the viewport, above the navbar. Fills left→right as the page scrolls.
 *
 * Uses Framer's useScroll + useSpring (transform-only, no layout thrash).
 * `useScroll` is SSR-safe (returns 0 on the server) so no mounted gate is
 * needed — the bar simply starts empty and fills as the user scrolls.
 *
 * Collapses to hidden under reduced motion.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary"
    />
  );
}
