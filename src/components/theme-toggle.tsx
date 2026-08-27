"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Theme toggle — brutalist square button that flips between light (Sun) and
 * dark (Moon).
 *
 * Avoids the mounted-gate `useEffect(setMounted)` pattern (which trips the
 * react-hooks/set-state-in-effect lint rule). Instead both icons render and
 * CSS visibility is driven by the `.dark` class on <html> (set by
 * next-themes). On the server (no .dark class) the Moon icon shows as the
 * "switch to dark" affordance; once the client hydrates and next-themes
 * resolves, the correct icon appears. No hydration mismatch because both
 * icons exist in the DOM — only visibility flips.
 *
 * The click handler reads the current resolved theme from the <html> class
 * list at click time (not from React state), so it works correctly regardless
 * of hydration timing.
 */
export default function ThemeToggle() {
  const { setTheme } = useTheme();

  function toggle() {
    // Read the live DOM state — robust against hydration timing.
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle theme"
      className="grid size-10 place-items-center border-2 border-border bg-card text-foreground shadow-brutal-sm transition-all duration-150 hover:-translate-y-[1px] hover:bg-foreground hover:text-background hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      {/* Light-mode affordance: show Moon (click → go dark). Hidden in dark. */}
      <Moon size={18} strokeWidth={2.5} className="dark:hidden" />
      {/* Dark-mode affordance: show Sun (click → go light). Hidden in light. */}
      <Sun size={18} strokeWidth={2.5} className="hidden dark:block" />
    </button>
  );
}
