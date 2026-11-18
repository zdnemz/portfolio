import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import type { ProjectCard } from "@/lib/cms/types";
import { Stagger, StaggerItem } from "@/components/ui/motion-wrapper";

/**
 * ProjectGrid — the archive grid. Receives cards from the server page and
 * renders the site's brutalist card language: hard border, offset shadow,
 * numbered corner badge.
 *
 * `unoptimized` is deliberate: CMS media may point at an external CDN host,
 * and the image loader refuses hosts that are not listed in next.config.
 */
export default function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  return (
    <Stagger
      staggerDelay={0.06}
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project, idx) => {
        const cover = project.media[0];

        return (
          <StaggerItem key={project.id}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-border bg-muted shadow-brutal transition-all duration-200 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-brutal-coral">
                <div className="absolute left-0 top-0 z-10 border-b-2 border-r-2 border-border bg-foreground px-2.5 py-1">
                  <span className="label-mono text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                {project.featured && (
                  <div
                    className="absolute right-0 top-0 z-10 grid place-items-center border-b-2 border-l-2 border-border bg-primary px-2.5 py-1.5 text-primary-foreground"
                    aria-hidden
                  >
                    <Star size={13} fill="currentColor" strokeWidth={0} />
                  </div>
                )}
                {cover ? (
                  <Image
                    src={cover.url}
                    alt={cover.alt || project.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    priority={idx < 3}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="stripes absolute inset-0" aria-hidden />
                )}
              </div>

              <h2 className="mt-5 flex items-center gap-1.5 font-display text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
                {project.title}
                <ArrowUpRight
                  size={17}
                  strokeWidth={2.5}
                  className="-translate-y-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
              </h2>
              <p className="mt-2 max-w-[50ch] text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {project.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="border-2 border-foreground bg-foreground px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-background">
                  {project.status.replace(/-/g, " ")}
                </span>
                {project.stack.slice(0, 3).map((item) => (
                  <span
                    key={item.label}
                    className="border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {item.label}
                  </span>
                ))}
                {project.stack.length > 3 && (
                  <span className="border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
                    +{project.stack.length - 3}
                  </span>
                )}
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
