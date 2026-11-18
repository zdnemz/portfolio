import Link from "next/link";
import type { Metadata } from "next";
import { getAllProjects, getProjectBySlug } from "@/lib/cms/get-projects";
import { getSite } from "@/lib/cms/get-site";
import PrintButton from "./print-button";

// Content is edited in the CMS, so the export is never frozen at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio export",
  robots: { index: false, follow: false },
};

/** "in-progress" -> "In progress" — data, not copy. */
function statusLabel(value: string): string {
  const words = value.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const year = (value: string | null) => (value ? value.slice(0, 4) : null);

function dateRange(start: string | null, end: string | null) {
  const s = year(start);
  const e = year(end);
  if (s && e) return s === e ? s : `${s} — ${e}`;
  return e ?? s ?? "";
}

export default async function PrintPage() {
  const [site, cards] = await Promise.all([getSite(), getAllProjects()]);
  // ponytail: one detail fetch per card — the CMS layer exposes no bulk detail
  // read, and this page prints a handful of projects. Add a bulk fetcher if the
  // archive ever gets large.
  const projects = (
    await Promise.all(cards.map((card) => getProjectBySlug(card.slug)))
  ).flatMap((project) => (project ? [project] : []));
  const copy = site.projectsPrint;
  const labels = site.projectPage;
  const { identity } = site;

  return (
    <>
      {/* Custom paged-media chrome: replaces the browser's date/title/URL/page
          defaults. Requires one manual step in the print dialog: uncheck
          "Headers and footers". */}
      <style>{`@page {
  size: A4;
  margin: 16mm 12mm 16mm;
  @top-right {
    content: ${JSON.stringify(identity.name)};
    font-family: ui-monospace, monospace;
    font-size: 9px;
    color: #525252;
  }
  @bottom-center {
    content: counter(page);
    font-family: ui-monospace, monospace;
    font-size: 9px;
    color: #525252;
  }
}`}</style>
      <main className="min-h-[100dvh] bg-white pt-28 pb-16 text-black print:pt-0 print:pb-0">
        <div className="mx-auto max-w-3xl px-6">
          {/* Screen-only toolbar — pt-28 clears the fixed navbar */}
          <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-widest text-neutral-500 underline underline-offset-4"
            >
              {labels.backLabel}
            </Link>
            <PrintButton label={labels.printLabel} />
          </div>

          {/* NOTE: <div>, not <header> — global print CSS hides header elements */}
          <div className="border-b-2 border-black pb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              {copy.eyebrow}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {copy.headline}
            </h1>
            <p className="mt-3 text-base font-bold">{identity.name}</p>
            <p className="mt-1 text-sm font-medium">{identity.role}</p>
            {/* Plain text, not links: global print CSS appends " (url)" to links */}
            <p className="mt-2 font-mono text-xs break-all text-neutral-700">
              {[identity.email, identity.location]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div className="border-b border-neutral-300 py-5">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
              {copy.profileHeading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
              {site.about.bio}
            </p>
          </div>

          {site.about.groups.length > 0 && (
            <div className="border-b border-neutral-300 py-5">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
                {copy.stackHeading}
              </h2>
              <dl className="mt-2 space-y-1 text-sm leading-relaxed">
                {site.about.groups.map((group) => (
                  <div key={group.title}>
                    <dt className="inline font-medium">{group.title}: </dt>
                    <dd className="inline">
                      {group.items.map((item) => item.label).join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="py-5">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
              {copy.workHeading}
            </h2>

            {projects.length === 0 ? (
              <p className="py-6 text-sm text-neutral-600 whitespace-pre-line">
                {labels.emptyMessage}
              </p>
            ) : (
              <div>
                {projects.map((project, i) => {
                  const range = dateRange(project.startDate, project.endDate);
                  const metric = project.outcomeMetric;

                  return (
                    <section
                      key={project.id}
                      className="border-b border-neutral-300 py-6 break-inside-auto last:border-0"
                    >
                      <p className="font-mono text-xs text-neutral-500">
                        {String(i + 1).padStart(2, "0")}
                        {project.projectType && ` / ${project.projectType}`}
                        {range && ` / ${range}`}
                      </p>
                      <h3 className="mt-1 text-xl font-bold">{project.title}</h3>
                      <p className="mt-1 font-mono text-xs text-neutral-600">
                        {labels.metaClientLabel}: {project.client} ·{" "}
                        {labels.metaStatusLabel}: {statusLabel(project.status)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                        {project.summary}
                      </p>

                      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
                        <span className="font-bold">{labels.outcomeLabel}: </span>
                        {metric && (
                          <span className="font-mono font-bold">
                            {metric.value}
                            {metric.unit}{" "}
                          </span>
                        )}
                        {project.outcome}
                      </p>

                      {project.timeline && (
                        <p className="mt-2 font-mono text-xs">
                          <span className="font-bold">{labels.timelineLabel}: </span>
                          {project.timeline}
                        </p>
                      )}

                      {project.stack.length > 0 && (
                        <p className="mt-1 font-mono text-xs">
                          <span className="font-bold">{labels.stackLabel}: </span>
                          {project.stack.map((item) => item.label).join(" · ")}
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 font-mono text-xs text-neutral-500">
            <p className="whitespace-pre-line">{copy.footerNote}</p>
          </div>
        </div>
      </main>
    </>
  );
}
