import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { Container } from "@/components/container";

export default function Footer() {
  return (
    <footer className="rule-top mt-24">
      <Container className="flex flex-col items-center justify-between gap-4 py-10 md:h-20 md:flex-row md:py-0">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Maulana Zidane
        </p>
        <div className="flex gap-6">
          <Link
            href="https://github.com/zdnemz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="GitHub"
          >
            <Github size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="https://linkedin.com/in/zdnemz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
