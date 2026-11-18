"use client";

import * as React from "react";
import { Keyboard, X } from "lucide-react";
import type { SiteContent } from "@/lib/cms/types";

/**
 * KeyboardShortcuts — a help modal triggered by the `?` key (and a button in
 * the footer). Shows all available keyboard shortcuts. Brutalist-styled.
 * Complements the CommandPalette (Cmd+K). Esc to close, click backdrop to close.
 *
 * Shortcut descriptions are UI chrome, not marketing copy, so they stay here.
 */
const SHORTCUTS = [
  { keys: ["⌘", "K"], description: "Open command palette", group: "Navigation" },
  { keys: ["?"], description: "Show this shortcuts help", group: "Navigation" },
  { keys: ["Esc"], description: "Close any open modal", group: "Navigation" },
  { keys: ["↑", "↓"], description: "Move selection in palette", group: "Palette" },
  { keys: ["↵"], description: "Run selected command", group: "Palette" },
  { keys: ["Tab"], description: "Move focus to next element", group: "Accessibility" },
  { keys: ["⇧", "Tab"], description: "Move focus to previous element", group: "Accessibility" },
] as const;

const HEADING_ID = "keyboard-shortcuts-heading";

export default function KeyboardShortcuts({ site }: { site?: SiteContent }) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previousFocus = React.useRef<HTMLElement | null>(null);

  // Listen for a synthetic `?` from the footer trigger as well as real keys.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Don't trigger when typing in an input/textarea.
        const target = e.target as HTMLElement | null;
        if (
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus the close button on open; restore the previously focused element on
  // close. The close button is the first control inside the panel, so this also
  // satisfies the trap's "first" check.
  React.useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => previousFocus.current?.focus();
  }, [open]);

  // Escape closes; Tab cycles inside the panel.
  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open || !site) return null;

  // Group shortcuts by group
  const groups = SHORTCUTS.reduce((acc, s) => {
    const arr = acc.get(s.group) ?? [];
    arr.push(s);
    acc.set(s.group, arr);
    return acc;
  }, new Map<string, (typeof SHORTCUTS)[number][]>());

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[18vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={HEADING_ID}
    >
      {/* Backdrop */}
      <button
        aria-label="Close shortcuts help"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        tabIndex={-1}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
        className="relative w-full max-w-lg border-2 border-border bg-card shadow-brutal-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-border bg-foreground px-5 py-3">
          <div className="flex items-center gap-2">
            <Keyboard size={16} strokeWidth={2.5} className="text-primary" />
            <h2 id={HEADING_ID} className="label-mono text-background">
              / Keyboard shortcuts
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            data-autofocus
            className="grid size-7 place-items-center border-2 border-background bg-background text-foreground transition-all duration-150 hover:bg-primary hover:text-primary-foreground active:translate-y-[1px]"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[55vh] overflow-y-auto p-5">
          {Array.from(groups.entries()).map(([group, shortcuts]) => (
            <div key={group} className="mb-5 last:mb-0">
              <div className="label-mono mb-2 text-muted-foreground">/ {group}</div>
              <div className="space-y-2">
                {shortcuts.map((s) => (
                  <div
                    key={s.description}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-foreground">{s.description}</span>
                    <div className="flex shrink-0 items-center gap-1">
                      {s.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="border-2 border-border bg-background px-1.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-foreground shadow-brutal-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-border px-5 py-3">
          <p className="label-mono text-muted-foreground">
            Press{" "}
            <kbd className="border-2 border-border bg-background px-1 py-0.5 font-mono text-[0.6rem]">?</kbd>{" "}
            anytime to open this help for {site.identity.name}
          </p>
        </div>
      </div>
    </div>
  );
}
