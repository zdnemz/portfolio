"use client";

import Link from "next/link";
import { Github, Linkedin, Link as LinkIcon, Keyboard } from "lucide-react";
import { Container } from "@/components/container";
import type { SiteContent } from "@/lib/cms/types";

/** Map a CMS social label to its icon. Unknown labels get a generic link. */
function socialIcon(label: string) {
  switch (label.toLowerCase()) {
    case "github":
      return Github;
    case "linkedin":
      return Linkedin;
    default:
      return LinkIcon;
  }
}

/** Dispatch a synthetic `?` keydown to open the KeyboardShortcuts modal. */
function openShortcuts() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
}

export default function Footer({ site }: { site?: SiteContent }) {
  // Optional only for the pre-S1 layout, which mounts chrome before site data
  // exists. S1 always passes `site`; render nothing until it does.
  if (!site) return null;

  const copyright =
    site.footer.copyright.trim() ||
    `${new Date().getFullYear()} ${site.identity.name}`;

  return (
    <footer className="rule-top mt-24">
      <Container className="flex flex-col items-center justify-between gap-4 py-10 md:h-20 md:flex-row md:py-0">
        <p className="text-sm text-muted-foreground">{copyright}</p>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={openShortcuts}
            aria-label="Keyboard shortcuts"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Keyboard size={20} strokeWidth={1.5} />
          </button>
          {site.footer.socials.map((social) => {
            const Icon = socialIcon(social.label);
            return (
              <Link
                key={`${social.label}-${social.href}`}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label={social.label}
              >
                <Icon size={20} strokeWidth={1.5} />
              </Link>
            );
          })}
        </div>
      </Container>
    </footer>
  );
}
