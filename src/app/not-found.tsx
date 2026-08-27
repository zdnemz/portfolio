import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { ArrowLeft, Terminal, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center pt-28 pb-16">
      <Container>
        {/* Terminal-style error header */}
        <div className="mb-8 border-2 border-border bg-card shadow-brutal">
          <div className="flex items-center gap-2 border-b-2 border-border bg-foreground px-4 py-2">
            <span className="size-2.5 border-2 border-background bg-destructive" aria-hidden />
            <span className="size-2.5 border-2 border-background bg-primary" aria-hidden />
            <span className="size-2.5 border-2 border-background bg-muted" aria-hidden />
            <span className="ml-3 label-mono text-background">/ error.tsx</span>
            <span className="ml-auto label-mono text-primary">404</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-foreground sm:p-6">
            <code>{`> GET ${"`"}{pathname}${"`"}
${"✗"} route not found
${"✓"} 0 modules matched
${"→"} suggestion: try the links below`}</code>
          </pre>
        </div>

        <span className="label-mono text-primary">/ 404 — Lost</span>
        <h1 className="display mt-4 max-w-[16ch]">
          Nothing lives{" "}
          <span className="hl-coral">here.</span>
        </h1>
        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          That route does not exist. The page may have moved, been renamed, or
          never existed at all. The work is this way instead.
        </p>

        {/* Quick-nav grid — help the lost visitor find something useful */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/"
            className="group border-2 border-border bg-card p-4 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2.5}
              className="mb-3 text-primary transition-transform duration-150 group-hover:-translate-x-0.5"
            />
            <div className="font-display text-base font-bold tracking-tight">Home</div>
            <div className="label-mono mt-1 text-muted-foreground">Start over</div>
          </Link>
          <Link
            href="/projects"
            className="group border-2 border-border bg-card p-4 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal"
          >
            <Terminal
              size={16}
              strokeWidth={2.5}
              className="mb-3 text-primary"
            />
            <div className="font-display text-base font-bold tracking-tight">All projects</div>
            <div className="label-mono mt-1 text-muted-foreground">Browse the archive</div>
          </Link>
          <Link
            href="/#projects"
            className="group border-2 border-border bg-card p-4 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal"
          >
            <ArrowUpRight
              size={16}
              strokeWidth={2.5}
              className="mb-3 text-primary transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <div className="font-display text-base font-bold tracking-tight">Selected work</div>
            <div className="label-mono mt-1 text-muted-foreground">Featured projects</div>
          </Link>
          <Link
            href="/#contact"
            className="group border-2 border-border bg-card p-4 shadow-brutal-sm transition-all duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal"
          >
            <ArrowUpRight
              size={16}
              strokeWidth={2.5}
              className="mb-3 text-primary transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <div className="font-display text-base font-bold tracking-tight">Contact</div>
            <div className="label-mono mt-1 text-muted-foreground">Get in touch</div>
          </Link>
        </div>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/projects">View projects</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
