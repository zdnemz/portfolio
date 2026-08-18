import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center pt-24 pb-16">
      <Container>
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="display mt-6 max-w-[14ch]">Nothing lives here.</h1>
        <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
          That route does not exist. The work is this way instead.
        </p>
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
