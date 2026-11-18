import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Printer } from "lucide-react";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/cms/get-projects";
import { getSite } from "@/lib/cms/get-site";
import { Container } from "@/components/container";
import ProjectGallery from "@/components/projects/project-gallery";
import { Reveal } from "@/components/ui/motion-wrapper";

// Content is edited in the CMS, so a case study is never frozen at build time.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary.slice(0, 160),
  };
}

/** "in-progress" -> "In progress" — data, not copy. */
function statusLabel(status: string): string {
  const words = status.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [site, project] = await Promise.all([
    getSite(),
    getProjectBySlug(slug),
  ]);

  if (!project) notFound();

  const copy = site.projectPage;
  const metric = project.outcomeMetric;
  const hasMeta = Boolean(project.client || project.projectType || project.status);

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
            {copy.backToProjectsLabel}
          </Link>

          <span className="border-2 border-foreground bg-foreground px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-background">
            {statusLabel(project.status)}
          </span>

          <h1 className="heading-section mt-4 max-w-[20ch]">{project.title}</h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
            {project.summary}
          </p>
        </Reveal>

        {/* Business-POV order: the problem, what I owned, then the result. */}
        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 border-t-2 border-border pt-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="label-mono text-primary">{copy.problemLabel}</h2>
            <p className="mt-3 max-w-[62ch] leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.problem}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <h2 className="label-mono text-primary">{copy.roleLabel}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.role}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <div className="border-2 border-border bg-card p-6 shadow-brutal sm:p-8">
            <h2 className="label-mono text-primary">{copy.outcomeLabel}</h2>
            {metric && (
              <p className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {metric.value}
                {metric.unit && (
                  <span className="text-primary">{metric.unit}</span>
                )}
              </p>
            )}
            <p className="mt-4 max-w-[62ch] leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.outcome}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 border-t-2 border-border pt-8 sm:grid-cols-2">
          <Reveal>
            <h2 className="label-mono text-primary">{copy.timelineLabel}</h2>
            <p className="mt-2 font-display text-lg font-medium tracking-tight">
              {project.timeline}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="label-mono text-primary">{copy.stackLabel}</h2>
            {project.stack.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item.label}
                    className="border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
        </div>

        {hasMeta && (
          <Reveal className="mt-12">
            <dl className="grid grid-cols-1 gap-x-10 gap-y-6 border-t-2 border-border pt-8 sm:grid-cols-3">
              {project.client && (
                <div>
                  <dt className="label-mono text-primary">
                    {copy.metaClientLabel}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-medium tracking-tight">
                    {project.client}
                  </dd>
                </div>
              )}
              {project.projectType && (
                <div>
                  <dt className="label-mono text-primary">
                    {copy.metaTypeLabel}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-medium tracking-tight">
                    {project.projectType}
                  </dd>
                </div>
              )}
              {project.status && (
                <div>
                  <dt className="label-mono text-primary">
                    {copy.metaStatusLabel}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-medium tracking-tight">
                    {statusLabel(project.status)}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-16">
          <ProjectGallery
            media={project.media}
            title={project.title}
            emptyLabel={copy.galleryEmpty}
          />
        </Reveal>

        {(project.projectUrl || project.repositoryUrl) && (
          <Reveal delay={0.14} className="mt-12">
            <div className="flex flex-wrap gap-3">
              {project.projectUrl && (
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-2 border-border bg-foreground px-4 py-2 text-background shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <span className="label-mono">{copy.liveLabel}</span>
                  <ExternalLink size={14} strokeWidth={2.5} />
                </Link>
              )}
              {project.repositoryUrl && (
                <Link
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-foreground hover:text-background hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <Github size={14} strokeWidth={2.5} />
                  <span className="label-mono">{copy.codeLabel}</span>
                </Link>
              )}
            </div>
          </Reveal>
        )}

        <div className="mt-16 border-t-2 border-border pt-8 print:hidden">
          <Link
            href="/projects/print"
            className="label-mono inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Printer size={13} strokeWidth={2.5} />
            {site.projectPage.printLabel}
          </Link>
        </div>
      </Container>
    </article>
  );
}
