"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed min-h-screen w-full inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative w-24 h-24">
        <motion.span
          className="absolute inset-0 border-4 border-primary/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.span
          className="absolute inset-0 border-t-4 border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
