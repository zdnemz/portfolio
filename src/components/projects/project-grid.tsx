"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { Stagger, StaggerItem } from "@/components/ui/motion-wrapper";

/**
 * ProjectGrid — client component that renders the archive grid with an
 * interactive tech-stack filter bar. Receives projects as props (from the
 * server page) and manages filter state locally. Cards re-stagger when the
 * filter changes via the `key` prop on Stagger.
 *
 * Accessibility: filter buttons are real <button>s with aria-pressed state.
 * The active filter count is announced via an aria-live region.
 */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  // Build the unique tech list from all projects, sorted alphabetically.
  const allTechs = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const [active, setActive] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (!active) return projects;
    return projects.filter((p) => p.technologies.includes(active));
  }, [projects, active]);

  return (
    <div>
      {/* Filter bar */}
      {allTechs.length > 0 && (
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="label-mono text-muted-foreground">/ Filter by tech</span>
            <span className="h-px flex-1 bg-border" />
            <span className="label-mono text-muted-foreground" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* "All" chip */}
            <button
              onClick={() => setActive(null)}
              aria-pressed={active === null}
              className={`border-2 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-all duration-150 ${
                active === null
                  ? "border-primary bg-primary text-primary-foreground shadow-brutal-sm"
                  : "border-border bg-card text-muted-foreground hover:border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              All
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActive(tech)}
                aria-pressed={active === tech}
                className={`border-2 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-all duration-150 ${
                  active === tech
                    ? "border-primary bg-primary text-primary-foreground shadow-brutal-sm"
                    : "border-border bg-card text-muted-foreground hover:border-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="border-t-2 border-border py-12">
          <div className="border-2 border-dashed border-border bg-muted p-10 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">
              No projects match this filter
            </p>
          </div>
        </div>
      ) : (
        <Stagger
          key={active ?? "all"}
          staggerDelay={0.06}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project, idx) => (
              <StaggerItem key={project.id}>
                <Link href={`/projects/${project.id}`} className="group block">
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-border bg-muted shadow-brutal transition-all duration-200 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-brutal-coral">
                    <div className="absolute left-0 top-0 z-10 border-b-2 border-r-2 border-border bg-foreground px-2.5 py-1">
                      <span className="label-mono text-primary">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={project.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        priority={idx < 3}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="stripes absolute inset-0" aria-hidden />
                    )}
                    {!project.images[0] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="label-mono border-2 border-border bg-background px-3 py-1.5 text-muted-foreground">
                          No preview
                        </span>
                      </div>
                    )}
                  </div>

                  <h2 className="mt-5 flex items-center gap-1.5 font-display text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
                    {project.name}
                    <ArrowUpRight
                      size={17}
                      strokeWidth={2.5}
                      className="-translate-y-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </h2>
                  <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className={`border-2 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] ${
                          active === tech
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </Link>
              </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
