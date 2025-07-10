"use client";

import { Container } from "./container";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding & Copyright */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-lg font-semibold">ZidaneMZ</p>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <Link
              href="https://github.com/zdnemz"
              target="_blank"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 hover:text-foreground transition-colors" />
            </Link>
            <Link
              href="https://linkedin.com/in/zdnemz"
              target="_blank"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 hover:text-foreground transition-colors" />
            </Link>
            <Link
              href="https://instagram/zdnemz"
              target="_blank"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 hover:text-foreground transition-colors" />
            </Link>
            <Link
              href="mailto:zidanemz.freelance@gmail.com"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 hover:text-foreground transition-colors" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
