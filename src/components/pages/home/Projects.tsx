"use client";

import { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Wrench } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import type { ProjectCard, SiteContent } from "@/lib/cms/types";

/** Project row — one featured project, already fetched by the page. */
function ProjectRow({
  project,
  idx,
  inProgressLabel,
}: {
  project: ProjectCard;
  idx: number;
  inProgressLabel: string;
}) {
  const cover = project.media[0];
  const inProgress = project.status === "in-progress";

  return (
    <StaggerItem>
      <Link
        href={`/projects/${project.slug}`}
        className="group grid grid-cols-1 items-center gap-6 border-t-2 border-border py-8 transition-colors duration-200 md:grid-cols-12 md:gap-10 hover:bg-muted/40"
      >
        <div className="md:col-span-7">
          <div className="flex items-baseline gap-3">
            <span className="label-mono text-primary">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary md:text-3xl">
              {project.title}
              <ArrowUpRight
                size={20}
                strokeWidth={2.5}
                className="ml-1.5 inline-block -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:opacity-100"
              />
            </h3>
          </div>
          <p className="mt-3 max-w-[52ch] pl-8 leading-relaxed text-muted-foreground md:pl-10">
            {project.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 pl-8 md:pl-10">
            {project.stack.slice(0, 5).map((tech) => (
              <span
                key={tech.label}
                className="border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground transition-colors duration-150 group-hover:border-primary/50"
              >
                {tech.label}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative aspect-video w-full overflow-hidden border-2 border-border bg-muted shadow-brutal transition-all duration-200 group-hover:shadow-brutal-coral group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]">
            {cover ? (
              <Image
                src={cover.url}
                alt={cover.alt || project.title}
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="stripes absolute inset-0" aria-hidden />
            )}
            {!cover && inProgress && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-1.5 border-2 border-border bg-background px-3 py-1.5 shadow-brutal-sm">
                  <Wrench size={12} strokeWidth={2.5} className="text-primary" />
                  <span className="label-mono text-foreground">{inProgressLabel}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </StaggerItem>
  );
}

/**
 * `site`/`projects` are optional only so the pre-CMS home page still
 * type-checks until S1 replaces it; with no data the section renders nothing.
 * S1 always passes both.
 */
const Projects = forwardRef<
  HTMLElement,
  { site?: SiteContent; projects?: ProjectCard[] }
>(function Projects({ site, projects = [] }, ref) {
  if (!site) return null;
  const copy = site.projectsSection;

  return (
    <section ref={ref} id="projects" className="section-pad rule-top">
      <Container>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="label-mono text-primary">{copy.eyebrow}</span>
            <h2 className="heading-section mt-3 max-w-[16ch]">{copy.heading}</h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-foreground hover:text-background hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <span className="label-mono">{copy.browseLabel}</span>
            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>

        {/* Nothing is substituted when the list is empty — the visitor is told
            the archive is empty instead of shown stand-in work. */}
        {projects.length === 0 && (
          <Reveal delay={0.05}>
            <p className="border-t-2 border-border py-10 text-muted-foreground">
              {copy.emptyMessage}
            </p>
          </Reveal>
        )}

        {projects.length > 0 && (
          <Stagger staggerDelay={0.1}>
            {projects.map((project, idx) => (
              <ProjectRow
                key={project.id}
                project={project}
                idx={idx}
                inProgressLabel={copy.inProgressLabel}
              />
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  );
});

Projects.displayName = "Projects";
export default Projects;
