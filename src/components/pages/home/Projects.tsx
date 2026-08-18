"use client";

import React, { useEffect, useState, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";

/** Row skeleton mirrors the loaded row's shape, so nothing shifts on arrival. */
function ProjectRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-10">
      <div className="space-y-4 md:col-span-7">
        <Skeleton className="h-8 w-2/3" />
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

const Projects = forwardRef<HTMLElement>((_, ref) => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [failed, setFailed] = useState(false);

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
        if (active) setProjects(list);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section ref={ref} id="projects" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="heading-section max-w-[16ch]">Selected work</h2>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            All projects
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>

        {failed && (
          <p className="border-t border-border py-10 text-muted-foreground">
            Projects could not be loaded right now.{" "}
            <Link href="/projects" className="text-primary hover:underline">
              Browse the full list
            </Link>
            .
          </p>
        )}

        {!failed && projects === null && (
          <div>
            <ProjectRowSkeleton />
            <ProjectRowSkeleton />
            <ProjectRowSkeleton />
          </div>
        )}

        {!failed && projects?.length === 0 && (
          <p className="border-t border-border py-10 text-muted-foreground">
            No featured projects yet.
          </p>
        )}

        {!failed && projects && projects.length > 0 && (
          <Stagger staggerDelay={0.1}>
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="group grid grid-cols-1 items-center gap-6 border-t border-border py-10 transition-colors duration-300 md:grid-cols-12 md:gap-10"
                >
                  <div className="md:col-span-7">
                    <h3 className="font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-primary md:text-3xl">
                      {project.name}
                      <ArrowUpRight
                        size={20}
                        className="ml-1.5 inline-block -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:opacity-100"
                      />
                    </h3>
                    <p className="mt-3 max-w-[52ch] leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border px-2.5 py-1 text-[0.8rem] text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 90vw, 40vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No preview
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  );
});

Projects.displayName = "Projects";
export default Projects;
