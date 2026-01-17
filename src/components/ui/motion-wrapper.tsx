"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className,
  ...props
}: FadeInProps) {
  const directionOffset =
    direction === "up"
      ? { y: 40 }
      : direction === "down"
      ? { y: -40 }
      : direction === "left"
      ? { x: 40 }
      : direction === "right"
      ? { x: -40 }
      : {};

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: {
  children: React.ReactNode;
  staggerDelay?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};
