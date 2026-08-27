"use client";

import * as React from "react";
import About from "@/components/pages/home/About";
import Hero from "@/components/pages/home/Hero";
import Projects from "@/components/pages/home/Projects";
import Contact from "@/components/pages/home/Contact";
import Stats from "@/components/pages/home/Stats";
import Process from "@/components/pages/home/Process";
import Now from "@/components/pages/home/Now";
import Testimonials from "@/components/pages/home/Testimonials";
import GitHubActivity from "@/components/pages/home/GitHubActivity";
import Faq from "@/components/pages/home/Faq";
import { HomeProvider } from "@/contexts/HomeContext";

export default function Home() {
  const projectsRef = React.useRef<HTMLElement>(null);
  const contactRef = React.useRef<HTMLElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HomeProvider value={{ scrollToProjects, scrollToContact }}>
      <main>
        <Hero />
        <Stats />
        <Projects ref={projectsRef} />
        <Process />
        <About />
        <Testimonials />
        <GitHubActivity />
        <Faq />
        <Now />
        <Contact ref={contactRef} />
      </main>
    </HomeProvider>
  );
}
