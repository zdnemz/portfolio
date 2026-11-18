import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Printer } from "lucide-react";
import { getAllProjects } from "@/lib/cms/get-projects";
import { getSite } from "@/lib/cms/get-site";
import { Container } from "@/components/container";
import ProjectGrid from "@/components/projects/project-grid";
import { Reveal } from "@/components/ui/motion-wrapper";

// Content is edited in the CMS, so the archive is never frozen at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies from shipped client and personal work.",
};

export default async function ProjectsPage() {
  const [site, projects] = await Promise.all([getSite(), getAllProjects()]);
  const copy = site.projectPage;

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
            {copy.backLabel}
          </Link>
          <p className="label-mono text-primary">{copy.archiveEyebrow}</p>
          <h1 className="heading-section mt-3 max-w-[14ch]">
            {copy.archiveHeading}
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
            {copy.archiveIntro}
          </p>
          <div className="mt-6 print:hidden">
            <Link
              href="/projects/print"
              className="group inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-foreground hover:text-background hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <Printer size={15} strokeWidth={2.5} />
              <span className="label-mono">{copy.printLabel}</span>
            </Link>
          </div>
        </Reveal>

        <section aria-label={copy.archiveHeading}>
          {projects.length === 0 ? (
            <div className="border-2 border-dashed border-border bg-muted p-10 text-center">
              <p className="label-mono text-muted-foreground whitespace-pre-line">
                {copy.emptyMessage}
              </p>
            </div>
          ) : (
            <ProjectGrid
              projects={projects}
              emptyMessage={site.projectsSection.emptyMessage}
            />
          )}
        </section>
      </Container>
    </main>
  );
}
