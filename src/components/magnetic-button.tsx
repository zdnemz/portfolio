"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * MagneticButton — wraps a child and makes it gently pull toward the cursor
 * on hover, then spring back on leave. Pure transform animation via
 * useMotionValue/useSpring (no React state, no render-cycle cost) per
 * SKILL.md motion guidance. Collapses to a static wrapper under reduced motion.
 *
 * Strength = max pixel pull. Spread = how far from center the influence reaches.
 */
export default function MagneticButton({
  children,
  strength = 12,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // Normalise by half-size so the pull is proportional and bounded.
    const maxDist = Math.max(rect.width, rect.height) / 2 || 1;
    x.set((relX / maxDist) * strength);
    y.set((relY / maxDist) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
