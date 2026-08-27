/**
 * Skip-to-content link — invisible until focused, then surfaces as a
 * brutalist pill that jumps keyboard users straight to #main-content.
 * Server component (no client interactivity needed; pure anchor + CSS).
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[70] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:items-center focus:border-2 focus:border-border focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-[0.7rem] focus:uppercase focus:tracking-[0.14em] focus:text-primary-foreground focus:shadow-brutal"
    >
      Skip to content
    </a>
  );
}
