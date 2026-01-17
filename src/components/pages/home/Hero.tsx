"use client";

import { Button } from "@/components/ui/button";

import { useHomeContext } from "@/contexts/HomeContext";
import ThreeCanvas from "@/components/ui/3d-canvas";
import HeroScene from "@/components/3d/HeroScene";
import { FadeIn, StaggerContainer } from "@/components/ui/motion-wrapper";


export default function Hero() {
  const { scrollToProjects, scrollToContact } = useHomeContext();

  return (
    <section className="relative flex py-24 md:py-32 items-center justify-center min-h-screen px-6 overflow-hidden">
      {/* 3D Background */}
      <ThreeCanvas>
        <HeroScene />
      </ThreeCanvas>

      {/* Content */}
      <StaggerContainer className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">

        {/* Heading */}
        <FadeIn delay={0.2} className="mb-6">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight text-glow">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
              Hi, I&apos;m Zidane
            </span>
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.4}>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            Web3 Developer & Smart Contract Engineer. <br />
            Building <span className="text-primary font-semibold">secure</span> and
            <span className="text-accent font-semibold"> decentralized</span> blockchain solutions.
          </p>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.6} className="mt-10 flex flex-col sm:flex-row gap-6">
          <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300 cursor-pointer" onClick={scrollToContact}>
            Let’s Work Together
          </Button>
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg cursor-pointer backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10"
            variant="ghost"
            onClick={scrollToProjects}
          >
            See My Work
          </Button>
        </FadeIn>
      </StaggerContainer>
    </section>
  );
}
