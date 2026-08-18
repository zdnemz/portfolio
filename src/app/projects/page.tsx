import { getProjects } from "@/lib/notion/projects";
import { Container } from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion-wrapper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Maulana Zidane",
  description:
    "Fullstack web applications and systems I have built and shipped.",
};

export default async function ProjectsPage() {
  const projects = await getProjects({ limit: 100 });

  return (
    <main className="min-h-[100dvh] pt-32 pb-24">
      <Container>
        <Reveal className="mb-16">
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Back to home
          </Link>
          <h1 className="heading-section max-w-[14ch]">All projects</h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted-foreground">
            Systems I have built and shipped, from client work to personal
            projects.
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <p className="border-t border-border py-12 text-muted-foreground">
            No projects published yet.
          </p>
        ) : (
          <Stagger
            staggerDelay={0.06}
            className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-6"
          >
            {projects.map((project, idx) => {
              /* Asymmetric rhythm: every 5th pair leads with a wide tile
                 so the grid never reads as a uniform card wall. */
              const isWide = idx % 5 === 0;
              return (
                <StaggerItem
                  key={project.id}
                  className={isWide ? "lg:col-span-4" : "lg:col-span-2"}
                >
                  <Link href={`/projects/${project.id}`} className="group block">
                    <div
                      className={`relative w-full overflow-hidden rounded-lg border border-border bg-muted ${
                        isWide ? "aspect-[16/9]" : "aspect-[4/3]"
                      }`}
                    >
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No preview
                        </div>
                      )}
                    </div>

                    <h2 className="mt-5 font-display text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-primary">
                      {project.name}
                      <ArrowUpRight
                        size={17}
                        className="ml-1 inline-block -translate-y-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </h2>
                    <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border px-2.5 py-1 text-[0.8rem] text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="rounded-md border border-border px-2.5 py-1 text-[0.8rem] text-muted-foreground">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </Container>
    </main>
  );
}
