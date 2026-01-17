"use client";

import * as React from "react";
import { FadeIn, StaggerContainer } from "@/components/ui/motion-wrapper";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Sparkles, Code2, Palette, Terminal } from "lucide-react";
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

  return (
    <section id="about" className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 item-center">

          {/* Left: Image Card */}
          <FadeIn direction="right" className="relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:mx-0 rounded-3xl overflow-hidden glass-card p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/images/me.jpg"
                  alt="Zidane"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <p className="text-white/90 font-medium italic">
                    &quot;Powering trust through code.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -left-6 glass px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg animate-bounce duration-[3000ms]">
              <Code2 className="text-primary w-4 h-4" />
              Smart Contract Engineer
            </div>
            <div className="absolute bottom-10 -right-10 glass px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg animate-bounce delay-700 duration-[3000ms]">
              <Palette className="text-accent w-4 h-4" />
              Web3 Builder
            </div>
          </FadeIn>

          {/* Right: Content */}
          <StaggerContainer className="flex flex-col justify-center space-y-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                <Sparkles size={16} />
                About Me
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                Protocol-driven <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Web3 Developer.
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I specialize in building secure, reliable smart contracts and decentralized applications with a strong focus on correctness, security, and long-term maintainability. I believe great blockchain systems should be <span className="text-foreground font-medium">trust-minimized</span> and <span className="text-foreground font-medium">permissionless</span>.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Terminal className="w-5 h-5 text-accent" />
                Tech Stack & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill) => (
                  <Link
                    key={skill.id}
                    href={skill.url || "/"}
                    target={skill.url ? "_blank" : undefined}
                  >
                    <Badge
                      variant="secondary"
                      className="text-sm py-1.5 px-3 rounded-md hover:bg-primary/20 hover:text-primary transition-colors cursor-default"
                    >
                      {skill.name}
                    </Badge>
                  </Link>
                )) : (
                  // Fallback skills if fetch fails or empty
                  ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Node.js", "Figma"].map(skill => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3 rounded-md">
                      {skill}
                    </Badge>
                  ))
                )}
              </div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
