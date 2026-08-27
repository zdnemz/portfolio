"use client";

import * as React from "react";

/**
 * useActiveSection — tracks which section id is currently in the viewport
 * via IntersectionObserver. Returns the active section id (or null).
 *
 * Pass the list of section ids to observe. The observer uses a rootMargin
 * that favours the top of the viewport (so the active section updates as
 * the user scrolls past it, not when it's centered). SSR-safe (returns null
 * on the server, resolves on mount).
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio that's currently
        // intersecting. This handles overlapping sections cleanly.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        // Bias toward the top of the viewport — the section that crosses the
        // top third becomes active.
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
