import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/notion/projects";
import { Container } from "@/components/container";
import ProjectGallery from "@/components/projects/project-gallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Reveal } from "@/components/ui/motion-wrapper";
import { Metadata } from "next";

// Force dynamic since we're fetching from a DB that might update
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} | Maulana Zidane`,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const meta = [
    ["Type", project.projectType || "Personal project"],
    ["Client", project.client || "Self-initiated"],
    ["Completed", project.completionDate || "Ongoing"],
  ] as const;

  const learnings = project.keyLearnings
    ? project.keyLearnings
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <article className="min-h-[100dvh] pt-32 pb-24">
      <Container className="max-w-5xl">
        <Reveal>
          <Link
            href="/projects"
            className="group mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Back to projects
          </Link>

          <h1 className="heading-section max-w-[20ch]">{project.name}</h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border px-2.5 py-1 text-[0.8rem] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {(project.projectUrl || project.repositoryUrl) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {project.projectUrl && (
                <Button asChild size="lg">
                  <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    Live demo <ExternalLink className="ml-1 size-4" />
                  </Link>
                </Button>
              )}
              {project.repositoryUrl && (
                <Button asChild variant="outline" size="lg">
                  <Link href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    View code <Github className="ml-1 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className="mt-16">
          <ProjectGallery media={project.images} title={project.name} />
        </Reveal>

        <Reveal delay={0.14}>
          <dl className="mt-16 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-border pt-10 sm:grid-cols-3">
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-primary">{label}</dt>
                <dd className="mt-2 font-display text-lg font-medium tracking-tight">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {learnings.length > 0 && (
          <Reveal delay={0.18} className="mt-16">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Challenges and learnings
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {learnings.map((learning, index) => (
                <p
                  key={index}
                  className="border-t border-border pt-4 leading-relaxed text-muted-foreground"
                >
                  {learning}
                </p>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </article>
  );
}
