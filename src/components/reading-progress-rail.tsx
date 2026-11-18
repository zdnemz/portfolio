"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { SECTION_IDS } from "@/lib/section-ids";
import type { SiteContent } from "@/lib/cms/types";

/**
 * ReadingProgressRail — a fixed vertical progress indicator on the right edge
 * of the viewport (desktop only, hidden on mobile to save space). Combines:
 *  - A thin vertical scroll-progress bar (fills top→bottom as you scroll).
 *  - Dots for each tracked section; the active one expands + turns coral.
 *
 * Complements the top scroll-progress bar (which shows page-wide progress)
 * with section-level navigation feedback.
 *
 * Reduced-motion: the dots still highlight the active section (no animation).
 */

export default function ReadingProgressRail({ site }: { site?: SiteContent }) {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });
  const activeSection = useActiveSection(SECTION_IDS);
  const pathname = usePathname();
  const sectionHref = (href: string) => (pathname === "/" ? href : "/" + href);

  // Endorsements and Activity only render once their data arrives, and drop
  // out entirely when it doesn't. Track which sections are actually mounted
  // so the rail never shows a dot that scrolls nowhere.
  const [present, setPresent] = React.useState<readonly string[]>(SECTION_IDS);

  React.useEffect(() => {
    const sync = () =>
      setPresent(SECTION_IDS.filter((id) => document.getElementById(id)));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!site) return null;

  const sections = SECTION_IDS.map((id) => {
    const navLabel = site.nav.items.find((item) => item.href === `#${id}`)?.label;
    return {
      id,
      label: navLabel ?? (id === "top" ? site.identity.name : id),
    };
  }).filter((s) => present.includes(s.id));

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <nav aria-label="Section navigation">
        <div className="flex flex-col items-center gap-3">
          {/* Vertical scroll progress — thin coral bar */}
          <div className="relative h-40 w-0.5 bg-border">
            <motion.div
              style={{ scaleY }}
              className="absolute inset-0 origin-top bg-primary"
            />
          </div>

          {/* Section dots */}
          <div className="flex flex-col items-center gap-2.5">
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={sectionHref(`#${s.id}`)}
                  className="group pointer-events-auto flex items-center gap-2"
                  aria-label={s.label}
                  aria-current={isActive ? "true" : undefined}
                >
                  {/* Label — appears on hover */}
                  <span
                    className={`label-mono origin-right whitespace-nowrap opacity-0 transition-all duration-150 group-hover:opacity-100 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    style={{ transform: "translateX(4px)" }}
                  >
                    {s.label}
                  </span>
                  {/* Dot */}
                  <span
                    aria-hidden
                    className={`block transition-all duration-200 ${
                      isActive
                        ? "size-3 bg-primary"
                        : "size-2 border border-border bg-background group-hover:bg-foreground"
                    }`}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
