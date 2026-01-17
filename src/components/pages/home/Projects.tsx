"use client";

import React, { useEffect, useState, forwardRef } from "react";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, StaggerContainer } from "@/components/ui/motion-wrapper";

const Projects = forwardRef<HTMLElement>((_, ref) => {
  // Use explicit type to avoid inference issues if needed
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    fetch("/api/projects?limit=3&featured=true")
      .then((res) => res.json())
      .then((data) => setProjects(data.data));
  }, []);

  const isLoading = projects === null;
  const skeletonArray = Array.from({ length: 3 });

  return (
    <section
      ref={ref}
      id="projects"
      className="relative flex flex-col py-24 md:py-32 items-center justify-center min-h-screen px-6 text-center"
    >
      <div className="container mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-glow">
            Selected <span className="text-primary">Works</span>
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(isLoading ? skeletonArray : projects!).map((project, idx) => {
            const isSkeleton = isLoading;
            const projectData = project as Project;

            const linkHref = isSkeleton ? "/" : `/projects/${projectData?.id}`;

            return (
              <FadeIn key={isSkeleton ? idx : projectData.id} className="h-full">
                <Link
                  href={linkHref}
                  className="block h-full group"
                >
                  <div className="relative h-full glass-card rounded-2xl overflow-hidden hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative w-full h-56 overflow-hidden">
                      {isSkeleton ? (
                        <Skeleton className="w-full h-full" />
                      ) : projectData.image ? (
                        <Image
                          src={projectData.image}
                          alt={projectData.name || "Project Image"}
                          fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transpose to-transparent opacity-60" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 text-left space-y-4">
                      {isSkeleton ? (
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : (
                        <>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                              {projectData.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {projectData.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {projectData.technologies.map((tech, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </StaggerContainer>

        <FadeIn delay={0.4} className="mt-16">
          <Link href="/projects">
            <button className="px-8 py-3 rounded-full border border-primary/20 bg-primary/5 text-primary font-medium hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all duration-300">
              View All Works
            </button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
});

Projects.displayName = "Projects";
export default Projects;
