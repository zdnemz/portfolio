"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

/** Seconds -> "1:34". Guards NaN, which is what duration is before metadata. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Video slide with its own controls.
 *
 * Autoplay only happens when this slide is the active one AND at least half
 * of it is on screen — otherwise every video in the carousel would be
 * decoding at once, off screen, on someone's phone data. It is muted because
 * browsers refuse to autoplay audio, and it stops autoplaying for good once
 * the visitor presses pause: their intent outranks the effect.
 *
 * prefers-reduced-motion disables autoplay entirely; the video still plays on
 * demand.
 */
export default function VideoPlayer({
  src,
  active,
  label,
}: {
  src: string;
  /** Is this the slide the carousel is currently showing? */
  active: boolean;
  label: string;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  const reduce = useReducedMotion();
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [onScreen, setOnScreen] = React.useState(false);
  const [userPaused, setUserPaused] = React.useState(false);

  // The element can finish loading metadata before React hydrates and attaches
  // onLoadedMetadata, in which case that event never reaches us and duration
  // stays 0 — which also clamps the seek bar's max to 0. Read it straight off
  // the element once on mount.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      setDuration(video.duration);
    }
    setPlaying(!video.paused);
  }, []);

  // Half-visible is the threshold for "the visitor is actually looking at it".
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldAutoplay = active && onScreen && !reduce && !userPaused;

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldAutoplay) {
      // Rejects when the browser blocks autoplay; the controls still work,
      // so there is nothing to recover from.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldAutoplay]);

  const toggle = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  }, []);

  const seek = (value: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = value;
    setTime(value);
  };

  const progress = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div ref={wrapRef} className="group/video relative h-full w-full bg-black">
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        className="h-full w-full cursor-pointer object-cover"
      />

      {/* Centre play badge — only while paused, so it never covers content
          that is actually moving. */}
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play video"
          className="absolute inset-0 grid place-items-center"
        >
          <span className="grid size-16 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur transition-transform duration-200 hover:scale-105">
            <Play size={26} className="ml-0.5" fill="currentColor" />
          </span>
        </button>
      )}

      {/* Control bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="shrink-0 text-white/90 transition-colors hover:text-white"
          >
            {playing ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            // touch-action none keeps a drag on the slider from scrolling the
            // carousel track underneath it.
            style={{
              touchAction: "none",
              background: `linear-gradient(to right, var(--color-primary, #fff) ${progress}%, rgba(255,255,255,0.25) ${progress}%)`,
            }}
            className="h-1 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />

          <span className="shrink-0 font-mono text-xs tabular-nums text-white/80">
            {formatTime(time)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            className="shrink-0 text-white/90 transition-colors hover:text-white"
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          <button
            type="button"
            onClick={() => videoRef.current?.requestFullscreen?.()}
            aria-label="Fullscreen"
            className="shrink-0 text-white/90 transition-colors hover:text-white"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
