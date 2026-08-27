"use client";

import React, { useEffect, useState, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Wrench } from "lucide-react";
import type { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";

type LoadState = "loading" | "failed" | "empty" | "ready";

/** Row skeleton mirrors the loaded row's shape, so nothing shifts on arrival. */
function ProjectRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 border-t-2 border-border py-8 md:grid-cols-12 md:gap-10">
      <div className="space-y-4 md:col-span-7">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-7 w-2/3" />
        </div>
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>
      <div className="md:col-span-5">
        <Skeleton className="aspect-video w-full" />
      </div>
    </div>
  );
}

/** Project row — one featured project from the Notion database. */
function ProjectRow({ project, idx }: { project: Project; idx: number }) {
  return (
    <StaggerItem>
      <Link
        href={`/projects/${project.id}`}
        className="group grid grid-cols-1 items-center gap-6 border-t-2 border-border py-8 transition-colors duration-200 md:grid-cols-12 md:gap-10 hover:bg-muted/40"
      >
        <div className="md:col-span-7">
          <div className="flex items-baseline gap-3">
            <span className="label-mono text-primary">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary md:text-3xl">
              {project.name}
              <ArrowUpRight
                size={20}
                strokeWidth={2.5}
                className="ml-1.5 inline-block -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:opacity-100"
              />
            </h3>
          </div>
          <p className="mt-3 max-w-[52ch] pl-8 leading-relaxed text-muted-foreground md:pl-10">
            {project.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 pl-8 md:pl-10">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground transition-colors duration-150 group-hover:border-primary/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative aspect-video w-full overflow-hidden border-2 border-border bg-muted shadow-brutal transition-all duration-200 group-hover:shadow-brutal-coral group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]">
            {project.images[0] ? (
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="stripes absolute inset-0" aria-hidden />
            )}
            {!project.images[0] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-1.5 border-2 border-border bg-background px-3 py-1.5 shadow-brutal-sm">
                  <Wrench size={12} strokeWidth={2.5} className="text-primary" />
                  <span className="label-mono text-foreground">In progress</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </StaggerItem>
  );
}

const Projects = forwardRef<HTMLElement>((_, ref) => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/projects?limit=3&featured=true")
      .then(async (res) => {
        // fetch resolves on 4xx/5xx, so status and the success flag are both
        // checked here. Otherwise a failed request renders as "no projects".
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error("request failed");
        return Array.isArray(json.data) ? (json.data as Project[]) : [];
      })
      .then((list) => {
        if (!active) return;
        if (list.length === 0) {
          setState("empty");
        } else {
          setProjects(list);
          setState("ready");
        }
      })
      .catch(() => {
        if (active) setState("failed");
      });
    return () => {
      active = false;
    };
  }, []);


  return (
    <section ref={ref} id="projects" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label-mono text-primary">/ Selected work</span>
            <h2 className="heading-section mt-3 max-w-[16ch]">
              Things I&rsquo;ve shipped.
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-foreground hover:text-background hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <span className="label-mono">All projects</span>
            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>

        {/* Nothing is substituted when Notion is unreachable — the visitor
            is told the list is unavailable instead of shown stand-in work. */}
        {(state === "failed" || state === "empty") && (
          <Reveal delay={0.05}>
            <p className="border-t-2 border-border py-10 text-muted-foreground">
              {state === "failed"
                ? "The project database is unreachable right now. Try the full archive, or come back in a minute."
                : "No featured projects published yet."}
            </p>
          </Reveal>
        )}

        {state === "loading" && (
          <div>
            <ProjectRowSkeleton />
            <ProjectRowSkeleton />
            <ProjectRowSkeleton />
          </div>
        )}

        {/* Render real Notion projects when available */}
        {state === "ready" && projects && projects.length > 0 && (
          <Stagger staggerDelay={0.1}>
            {projects.map((project, idx) => (
              <ProjectRow key={project.id} project={project} idx={idx} />
            ))}
          </Stagger>
        )}

      </Container>
    </section>
  );
});

Projects.displayName = "Projects";
export default Projects;
