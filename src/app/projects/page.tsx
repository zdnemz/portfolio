import { getProjects } from "@/lib/notion/projects";
import { Container } from "@/components/container";
import ProjectGrid from "@/components/projects/project-grid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/ui/motion-wrapper";
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
          <div className="border-2 border-dashed border-border bg-muted p-10 text-center">
            <p className="label-mono text-muted-foreground">
              No projects published yet
            </p>
          </div>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </Container>
    </main>
  );
}
