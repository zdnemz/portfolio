"use client";

/*
 * Motion primitives. MOTION_INTENSITY 7.
 * Every animation here is motivated:
 *   MaskLine  -> hierarchy on first paint (headline arrives before supporting copy)
 *   Reveal    -> hierarchy on scroll (section content enters as it becomes relevant)
 *   Stagger   -> storytelling (list items arrive in reading order, not all at once)
 * All of them collapse to static under prefers-reduced-motion.
 * No scroll listeners: whileInView uses IntersectionObserver internally.
 *
 * viewport.amount is a fraction of the ELEMENT, not the viewport, so a
 * fractional amount silently never fires once the element grows taller than
 * `viewport / amount` — which is how a 12-card single-column grid on a phone
 * ends up stuck at opacity 0. Use amount "some" plus a px margin instead:
 * that fires a fixed distance into the element regardless of how tall it is.
 */

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}

/** Fade + rise as the element enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Parent that releases its children in reading order. */
export function Stagger({
  children,
  staggerDelay = 0.08,
  className,
  ...props
}: {
  children: React.ReactNode;
  staggerDelay?: number;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -48px 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/** Child of <Stagger>. Must share the same client tree as its parent. */
export function StaggerItem({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline line that slides up from behind its own overflow edge on mount.
 * The wrapper reserves descender space so `g j p q y` never clip.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <span className="block overflow-hidden pb-[0.09em]">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={reduce ? false : { y: "108%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}
