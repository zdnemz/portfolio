"use client";

import React, { useEffect, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Container } from "../../container";
import type { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";

const Projects = forwardRef<HTMLElement>((_, ref) => {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    fetch("/api/projects?limit=3&featured=true")
      .then((res) => res.json())
      .then((data) => setProjects(data.data));
  }, []);

  const isLoading = projects === null;
  const skeletonArray = Array.from({ length: 3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative flex flex-col py-24 md:py-32 items-center justify-center min-h-screen px-6 text-center"
    >
      <Container>
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Selected Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(isLoading ? skeletonArray : projects!).map((project, idx) => {
            const isSkeleton = isLoading;
            const projectData = project as Project;

            const linkHref = isSkeleton ? "/" : projectData?.projectUrl || "/";

            return (
              <motion.div
                key={isSkeleton ? idx : projectData.id}
                whileHover={{ scale: 1.025 }}
                className="block"
              >
                <Link
                  target="_blank"
                  href={linkHref}
                  passHref
                  className="block h-full"
                >
                  <Card className="relative group overflow-hidden h-full bg-background/80 border border-border hover:border-primary/50 transition-all duration-300 rounded-xl shadow-md">
                    {/* Image */}
                    {isSkeleton ? (
                      <Skeleton className="w-full h-48" />
                    ) : projectData.image ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={projectData.image}
                          alt={projectData.name || "Project Image"}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay info */}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                          <div className="text-white text-center space-y-2">
                            <p className="font-semibold text-lg">
                              {projectData.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {projectData.description.slice(0, 80)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}

                    {/* Card Content */}
                    <CardContent className="p-4 space-y-3">
                      {isSkeleton ? (
                        <>
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-5/6" />
                          <div className="flex gap-1">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {projectData.technologies.map((tech, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="rounded-full text-xs px-3 py-1 bg-muted/40 backdrop-blur-sm border-border hover:border-primary/50"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </motion.section>
  );
});

Projects.displayName = "Projects";
export default Projects;
