export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center" role="status">
      <span className="sr-only">Loading</span>
      <div className="flex flex-col items-center gap-4">
        <div className="h-1 w-32 overflow-hidden border-2 border-border bg-card">
          <span className="block h-full w-1/3 animate-[loadingSlide_1.1s_ease-in-out_infinite] bg-primary" />
        </div>
        <span className="label-mono text-muted-foreground">Loading</span>
      </div>
    </div>
  );
}
