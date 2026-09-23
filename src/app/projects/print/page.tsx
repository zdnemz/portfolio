import Link from "next/link";
import { getProjects } from "@/lib/notion/projects";
import PrintButton from "./print-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio Export | Maulana Zidane",
  robots: { index: false, follow: false },
};

const EMAIL = "business.zidanemz@gmail.com";
const SITE = "https://zdnemz.vercel.app";
const GITHUB = "https://github.com/zdnemz";
const LINKEDIN = "https://linkedin.com/in/zdnemz";
const LOCATION = "Banjarmasin, South Kalimantan, Indonesia";

const SUMMARY =
  "Fullstack developer with three years of mostly self-directed freelance experience, building production web systems and security-focused applications. I work primarily with Next.js, Hono, PostgreSQL, and TypeScript, with additional experience in cryptography and blockchain development using Solidity. I enjoy working on systems where correctness, security, and trust boundaries matter.";

const year = (d: string | null) => (d ? d.slice(0, 4) : null);

function dateRange(start: string | null, end: string | null) {
  const s = start ? year(start) : null;
  const e = end ? year(end) : null;
  if (s && e) return s === e ? s : `${s} — ${e}`;
  return e ?? s ?? "Ongoing";
}

export default async function PrintPage() {
  const projects = await getProjects({
    limit: 100,
    filter: { property: "Featured", checkbox: { equals: true } },
  });

  // ponytail: in-memory sort, Notion wrapper has no sorts param
  const sorted = [...projects].sort((a, b) =>
    (b.completionDate ?? "").localeCompare(a.completionDate ?? "")
  );

  const stack = Array.from(
    new Set(sorted.flatMap((p) => p.technologies))
  ).sort();

  return (
    <>
      {/* Custom paged-media chrome: replaces browser date/title/URL/1/4 defaults.
          Requires one manual step in Chrome print dialog: uncheck "Headers and footers". */}
      <style>{`@page {
  size: A4;
  margin: 16mm 12mm 16mm;
  @top-right {
    content: "Maulana Zidane";
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
          {/* Screen-only toolbar — sits below the fixed navbar (pt-28 clears h-16) */}
          <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-widest text-neutral-500 underline underline-offset-4"
            >
              ← Back to projects
            </Link>
            <PrintButton />
          </div>
          <p className="mb-8 border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 font-mono text-xs leading-relaxed text-neutral-600 print:hidden">
            Di dialog print: Destination → Save as PDF, uncheck “Headers and
            footers”. Header/footer custom (Maulana Zidane + 1,2,3) sudah diatur
            dari CSS.
          </p>

        {/* NOTE: <div>, not <header> — global print CSS hides header/footer elements */}
        <div className="border-b-2 border-black pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Maulana Zidane
          </h1>
          <p className="mt-1 text-sm font-medium">
            Fullstack Developer — {LOCATION}
          </p>
          {/* Plain text, not links: global print CSS appends " (url)" to every http link */}
          <p className="mt-3 font-mono text-xs break-all text-neutral-700">
            {EMAIL} · {SITE} · {GITHUB} · {LINKEDIN}
          </p>
        </div>

        <div className="border-b border-neutral-300 py-5">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
            Profile
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{SUMMARY}</p>
        </div>

        {stack.length > 0 && (
          <div className="border-b border-neutral-300 py-5">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
              Core stack
            </h2>
            <p className="mt-2 text-sm leading-relaxed">{stack.join(" · ")}</p>
          </div>
        )}

        <div className="py-5">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
            Selected work — {sorted.length}{" "}
            {sorted.length === 1 ? "project" : "projects"}
          </h2>

          {sorted.length === 0 ? (
            <p className="py-6 text-sm text-neutral-600">
              No featured projects published yet.
            </p>
          ) : (
            <div>
              {sorted.map((p, i) => {
                const learnings = p.keyLearnings
                  ? p.keyLearnings
                      .split(",")
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .slice(0, 3)
                  : [];
                return (
                  <section
                    key={p.id}
                    className="border-b border-neutral-300 py-6 break-inside-auto last:border-0"
                  >
                    <p className="font-mono text-xs text-neutral-500">
                      {String(i + 1).padStart(2, "0")} / {p.projectType || "Personal project"} /{" "}
                      {dateRange(p.startDate, p.completionDate)}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs text-neutral-600">
                      Client: {p.client || "Self-initiated"} · Status:{" "}
                      {p.status || p.completionDate ? "Completed" : "Ongoing"}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">
                      {p.description}
                    </p>
                    {p.images[0] && (
                      // ponytail: plain img, Notion signed URLs skip next/image optimization
                      <img
                        src={p.images[0]}
                        alt=""
                        loading="lazy"
                        className="mt-4 max-h-48 w-full border border-neutral-300 object-cover"
                      />
                    )}
                    {p.technologies.length > 0 && (
                      <p className="mt-3 font-mono text-xs">
                        <span className="font-bold">Stack: </span>
                        {p.technologies.join(" · ")}
                      </p>
                    )}
                    {learnings.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                        {learnings.map((l, idx) => (
                          <li key={idx}>{l}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-2 space-y-1 font-mono text-xs break-all text-neutral-700">
                      {p.projectUrl && <p>Live: {p.projectUrl}</p>}
                      {p.repositoryUrl && <p>Code: {p.repositoryUrl}</p>}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-2 font-mono text-xs text-neutral-500">
          <p>
            Generated {new Date().toISOString().slice(0, 10)} · Featured
            projects only · Full archive: {SITE}/projects
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
