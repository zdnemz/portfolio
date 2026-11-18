"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] items-center pt-28 pb-16">
      <Container>
        <span className="label-mono text-primary">/ Error</span>
        <h1 className="display mt-4 max-w-[16ch]">That page broke.</h1>
        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          Something went wrong while rendering this page. The data source may be
          unreachable, or the route hit an unexpected error. Try again, or head
          back to safer ground.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
