"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "./video-player";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i;

/**
 * Media carousel for a project's Notion files.
 *
 * Scrolling is the native thing: a scroll-snap track that already works with
 * a finger, a trackpad, and the arrow keys. The buttons and dots drive that
 * same scroll rather than a parallel index state, so a swipe and a click can
 * never disagree about which slide is current.
 */
export default function ProjectGallery({
  media,
  title,
}: {
  media: string[];
  title: string;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);

  // Derive the active slide from scroll position — the track is the source
  // of truth, whether it was moved by a swipe or by a button.
  const onScroll = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.clientWidth;
    if (slide === 0) return;
    setIndex(Math.round(track.scrollLeft / slide));
  }, []);

  const goTo = React.useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }, []);

  if (media.length === 0) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No preview available
        </div>
      </div>
    );
  }

  const single = media.length === 1;

  return (
    <div
      className="group/gallery relative"
      role={single ? undefined : "region"}
      aria-roledescription={single ? undefined : "carousel"}
      aria-label={single ? undefined : `${title} media`}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={single ? -1 : 0}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-lg border border-border bg-muted [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {media.map((src, i) => (
          <div
            key={`${i}-${src}`}
            className="relative aspect-video w-full shrink-0 snap-center"
            aria-label={`${i + 1} of ${media.length}`}
          >
            {VIDEO_EXT.test(src) ? (
              <VideoPlayer
                src={src}
                active={i === index}
                label={
                  single
                    ? title
                    : `${title} — media ${i + 1} of ${media.length}`
                }
              />
            ) : (
              <Image
                src={src}
                alt={
                  single ? title : `${title} — media ${i + 1} of ${media.length}`
                }
                fill
                sizes="(max-width: 1024px) 92vw, 64rem"
                className="object-cover"
                priority={i === 0}
              />
            )}
          </div>
        ))}
      </div>

      {!single && (
        <>
          {/* Vertically centred so they never overlap the video control bar
              at the bottom. Hidden on small screens — swiping is the natural
              gesture there and the dots still show position. */}
          <button
            type="button"
            onClick={() => goTo(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label="Previous media"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 p-2 backdrop-blur transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-0 sm:grid"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => goTo(Math.min(media.length - 1, index + 1))}
            disabled={index === media.length - 1}
            aria-label="Next media"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 p-2 backdrop-blur transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-0 sm:grid"
          >
            <ChevronRight size={18} />
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            {media.map((src, i) => (
              <button
                key={`${i}-${src}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to media ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === index
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
