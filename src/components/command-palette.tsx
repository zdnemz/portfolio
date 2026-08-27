"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import type { Project } from "@/types/project";

/**
 * CommandPalette — a brutalist Cmd+K / Ctrl+K palette for quick navigation.
 * Searches sections and the live project list from Notion. Keyboard-first:
 * ArrowUp/Down to move, Enter to run, Esc to close. Fade+scale mount, no
 * React state for the open/close flag (driven by a global keydown listener +
 * a CSS-driven visible state to avoid the set-state-in-effect lint rule).
 *
 * Reduced-motion: instant show/hide.
 */

type CmdItem = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Projects";
  onSelect: () => void;
  keywords?: string;
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [projects, setProjects] = React.useState<Project[]>([]);

  // Global Cmd/Ctrl+K to toggle. Mounted once on the client.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);

  // Load the real project list the first time the palette is opened — no
  // point spending a request on visitors who never press Cmd+K.
  React.useEffect(() => {
    if (!open || projects.length > 0) return;
    let active = true;
    fetch("/api/projects?limit=100")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success) throw new Error("request failed");
        return Array.isArray(json.data) ? (json.data as Project[]) : [];
      })
      .then((list) => {
        if (active) setProjects(list);
      })
      .catch(() => {
        // Palette still navigates sections; the project group stays empty.
      });
    return () => {
      active = false;
    };
  }, [open, projects.length]);

  const items: CmdItem[] = React.useMemo(() => {
    const nav = (label: string, href: string, hint: string): CmdItem => ({
      id: `nav-${href}`,
      label,
      hint,
      group: "Navigate",
      onSelect: () => {
        close();
        if (href.startsWith("#")) {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(href);
        }
      },
    });
    return [
      nav("Home", "/", "Top of page"),
      nav("Work", "#projects", "Selected work"),
      nav("Process", "#process", "How I work"),
      nav("About", "#about", "Stack reference"),
      nav("Testimonials", "#testimonials", "Endorsements"),
      nav("Activity", "#github", "Recent GitHub activity"),
      nav("Contact", "#contact", "Get in touch"),
      nav("All projects", "/projects", "Full archive"),
      ...projects.map(
        (p): CmdItem => ({
          id: `project-${p.id}`,
          label: p.name,
          hint: [p.projectType, p.status].filter(Boolean).join(" · "),
          group: "Projects",
          keywords: p.technologies.join(" "),
          onSelect: () => {
            close();
            router.push(`/projects/${p.id}`);
          },
        })
      ),
    ];
  }, [router, close, projects]);

  // Group items for rendering
  const groups = React.useMemo(() => {
    const map = new Map<string, CmdItem[]>();
    for (const it of items) {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return Array.from(map.entries());
  }, [items]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[18vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop — click to close */}
      <button
        aria-label="Close command palette"
        onClick={close}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        tabIndex={-1}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl border-2 border-border bg-card shadow-brutal-lg animate-in fade-in slide-in-from-top-4 duration-200">
        <Command
          label="Command palette"
          className="flex flex-col"
          shouldFilter={true}
          value={search}
          onValueChange={setSearch}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b-2 border-border px-4">
            <Search size={16} strokeWidth={2.5} className="shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Search projects and sections…"
              className="h-14 flex-1 bg-transparent font-display text-base font-medium outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="hidden border-2 border-border bg-background px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground sm:inline">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {groups.map(([group, groupItems]) => (
              <Command.Group key={group} heading={group} className="mb-2">
                <div className="label-mono px-2 py-1.5 text-muted-foreground">/ {group}</div>
                {groupItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.hint} ${item.group} ${item.keywords ?? ""}`}
                    onSelect={() => item.onSelect()}
                    className="group flex cursor-pointer items-center justify-between border-2 border-transparent px-3 py-2.5 font-display text-sm font-medium transition-colors duration-100 data-[selected=true]:border-border data-[selected=true]:bg-foreground data-[selected=true]:text-background"
                  >
                    <span className="flex items-center gap-3">
                      <span className="label-mono text-primary opacity-0 transition-opacity data-[selected=true]:opacity-100 group-data-[selected=true]:opacity-100">
                        →
                      </span>
                      {item.label}
                    </span>
                    <span className="label-mono text-muted-foreground group-data-[selected=true]:text-background/60">
                      {item.hint}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </div>

          {/* Footer — keyboard hints */}
          <div className="flex items-center justify-between border-t-2 border-border px-4 py-2.5">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 label-mono text-muted-foreground">
                <ArrowUp size={11} strokeWidth={2.5} />
                <ArrowDown size={11} strokeWidth={2.5} />
                Navigate
              </span>
              <span className="flex items-center gap-1.5 label-mono text-muted-foreground">
                <CornerDownLeft size={11} strokeWidth={2.5} />
                Open
              </span>
            </div>
            <span className="label-mono text-muted-foreground">
              {items.length} commands
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
