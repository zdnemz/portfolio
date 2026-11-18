"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Container } from "@/components/container";
import { useActiveSection } from "@/hooks/use-active-section";
import { SECTION_IDS } from "@/lib/section-ids";
import type { SiteContent } from "@/lib/cms/types";

/** Dispatch a synthetic Cmd/Ctrl+K to open the global CommandPalette. */
function openPalette() {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: navigator.platform.toLowerCase().includes("mac") ? false : true,
      bubbles: true,
    }),
  );
}

export default function Navbar({ site }: { site?: SiteContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  // Optional only for the pre-S1 layout, which mounts chrome before site data
  // exists. S1 always passes `site`; render nothing until it does.
  if (!site) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b-2 border-border bg-background/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between">
        {/* Brand lockup: ink square badge + wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-[0.95rem] font-bold tracking-tight transition-transform duration-150 active:translate-y-[1px]"
        >
          <span className="grid size-7 place-items-center border-2 border-border bg-foreground text-primary shadow-brutal-sm transition-transform duration-150 group-hover:-translate-y-[1px] group-hover:shadow-brutal">
            <span className="text-sm font-bold leading-none">
              {site.identity.initials}
            </span>
          </span>
          <span className="hidden sm:inline">
            {site.identity.wordmark}
            <span className="text-primary">{site.identity.wordmarkAccent}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {site.nav.items.map((item) => {
            const sectionId = item.href.replace(/^#/, "");
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`label-mono border-2 px-3 py-1.5 transition-all duration-150 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-brutal-sm"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-foreground hover:text-background"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {/* Command palette trigger */}
          <button
            onClick={openPalette}
            className="ml-3 inline-flex h-9 items-center gap-2 border-2 border-border bg-card px-2.5 shadow-brutal-sm transition-all duration-150 hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            aria-label="Open command palette (Cmd+K)"
            title="Search — Cmd+K"
          >
            <Search size={14} strokeWidth={2.5} />
            <kbd className="border-2 border-border bg-background px-1 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          {site.identity.available && (
            <span className="ml-2 inline-flex items-center gap-2 border-2 border-border bg-primary px-3 py-1.5 shadow-brutal-sm">
              <span className="size-2 bg-foreground" aria-hidden />
              <span className="label-mono text-primary-foreground">
                {site.identity.availabilityLabel}
              </span>
            </span>
          )}
        </nav>

        {/* Mobile: search + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={openPalette}
            className="grid size-10 place-items-center border-2 border-border bg-card text-foreground shadow-brutal-sm transition-all duration-150 hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            aria-label="Open command palette"
          >
            <Search size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="grid size-10 place-items-center border-2 border-border bg-foreground text-background shadow-brutal-sm transition-all duration-150 hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <Menu size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b-2 border-border bg-background md:hidden"
          >
            <Container className="flex flex-col py-4">
              {site.nav.items.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between border-2 border-transparent py-3 font-display text-2xl font-bold tracking-tight transition-all duration-150 hover:border-border hover:bg-foreground hover:px-3 hover:text-background"
                >
                  {item.label}
                  <span className="label-mono text-muted-foreground">
                    0{index + 1}
                  </span>
                </Link>
              ))}
              {site.identity.available && (
                <div className="mt-3 inline-flex items-center gap-2 self-start border-2 border-border bg-primary px-3 py-1.5 shadow-brutal-sm">
                  <span className="size-2 bg-foreground" aria-hidden />
                  <span className="label-mono text-primary-foreground">
                    {site.identity.availabilityLabel}
                  </span>
                </div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
