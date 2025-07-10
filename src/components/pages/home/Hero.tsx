"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Container } from "../../container";
import { useHomeContext } from "@/contexts/HomeContext";

export default function Hero() {
  const { scrollToProjects } = useHomeContext();

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative flex py-24 md:py-32 items-center justify-center min-h-screen px-6 overflow-hidden"
    >
      <Container className="flex flex-col items-center justify-center text-center">
        {/* Gradient Background Blur */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-muted to-background opacity-30 blur-3xl" />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground"
        >
          {"Hi, I'm Zidane"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl"
        >
          Frontend Developer & UI/UX Enthusiast — I craft responsive,
          interactive, and scalable interfaces with modern stack.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg">
            <Link href="/">Let’s Work Together</Link>
          </Button>
          <Button
            size="lg"
            className="cursor-pointer"
            variant="outline"
            onClick={scrollToProjects}
          >
            See My Work
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-20 text-muted-foreground"
        >
          <ChevronDown size={28} />
        </motion.div>
      </Container>
    </motion.section>
  );
}
