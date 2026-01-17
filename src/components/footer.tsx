"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm mt-20">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/zdnemz"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              ZidaneMZ
            </a>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="https://github.com/zdnemz" target="_blank" className="text-muted-foreground hover:text-white transition-colors">
            <Github size={20} />
          </Link>
          <Link href="https://twitter.com/zdnemz" target="_blank" className="text-muted-foreground hover:text-white transition-colors">
            <Twitter size={20} />
          </Link>
          <Link href="https://linkedin.com/in/zidanemz" target="_blank" className="text-muted-foreground hover:text-white transition-colors">
            <Linkedin size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
