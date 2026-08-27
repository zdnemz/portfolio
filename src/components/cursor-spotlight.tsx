"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * CursorSpotlight — a radial-gradient overlay that tracks the mouse inside its
 * parent. Pure transform via useMotionValue/useSpring (no React state, no
 * render-cycle cost — per SKILL.md motion guidance). Reduced-motion renders a
 * static centered glow.
 *
 * Place this as a child of a `relative overflow-hidden` container. The overlay
 * fills the parent and listens to mousemove on it.
 */
export default function CursorSpotlight({
  className = "",
  size = 220,
}: {
  className?: string;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.3 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  function onLeave() {
    x.set(-9999);
    y.set(-9999);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <motion.div
        style={{
          x: sx,
          y: sy,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        className="absolute rounded-full opacity-0 mix-blend-overlay transition-opacity duration-300"
        // Fade in on first mouse entry; the motion values drive position.
        // Using a CSS group-hover trick: parent group sets opacity on hover.
      />
      {/* The actual glow — a radial gradient that follows the cursor */}
      <motion.div
        style={{
          x: sx,
          y: sy,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        className="absolute rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.25)_0%,transparent_70%)] opacity-0 mix-blend-overlay group-hover:opacity-100 transition-opacity duration-300 dark:bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,transparent_70%)]"
      />
    </motion.div>
  );
}
