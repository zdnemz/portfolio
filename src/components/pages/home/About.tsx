"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "../../container";
import { Badge } from "../../ui/badge";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Skill } from "@/types/skill";
import Link from "next/link";

export default function About() {
  const [skills, setSkills] = React.useState<Skill[]>([]);

  React.useEffect(() => {
    fetch("/api/skills")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        const text = await res.text();
        if (!text) return { data: [] };
        try {
          return JSON.parse(text);
        } catch {
          return { data: [] };
        }
      })
      .then((data) => setSkills(data.data))
      .catch((error) => {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
      });
  }, []);

  console.log(skills);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-b from-muted/10 to-background border-t border-border py-24 md:py-32 px-6 overflow-hidden"
    >
      <Container>
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left: Image / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative md:col-span-2 aspect-[4/5] w-full rounded-3xl border border-border overflow-hidden shadow-md"
          >
            <Image
              src="/images/me.jpg"
              alt="Zidane"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-muted backdrop-blur-sm opacity-50 flex items-end p-4 text-foreground text-sm">
              “I write code like I design – with clarity, flow, and function.”
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="md:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-wide"
            >
              <Sparkles size={18} />
              About Me
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-semibold tracking-tight"
            >
              Design-driven frontend developer.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              I specialize in building beautiful, performant interfaces with
              focus on experience, accessibility, and responsiveness. My tools
              of choice are Next.js, Tailwind, and Framer Motion.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              I believe great digital products should feel intuitive and
              empowering. Every line of code should serve the design — not
              distract from it.
            </motion.p>

            <div className="mt-6">
              <h4 className="font-medium mb-4 text-sm tracking-wide text-muted-foreground">
                Core skill Stack
              </h4>
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {skills.map((skill) => (
                  <Link
                    key={skill.id}
                    href={skill.url || "/"}
                    target={skill.url ? "_blank" : undefined}
                  >
                    <Badge
                      variant="outline"
                      className="text-sm rounded-full px-3 py-1 backdrop-blur-md bg-muted/20 border-border/30 hover:border-primary transition"
                    >
                      {skill.name}
                    </Badge>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </motion.section>
  );
}
