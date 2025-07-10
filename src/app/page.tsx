"use client";

import * as React from "react";
import About from "@/components/pages/home/About";
import Hero from "@/components/pages/home/Hero";
import Projects from "@/components/pages/home/Projects";
import Contact from "@/components/pages/home/Contact";
import { HomeProvider } from "@/contexts/HomeContext";

export default function Home() {
  const projectsRef = React.useRef<HTMLElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HomeProvider value={{ scrollToProjects }}>
      <main>
        <Hero />
        <Projects ref={projectsRef} />
        <About />
        <Contact />
      </main>
    </HomeProvider>
  );
}
