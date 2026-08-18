export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center" role="status">
      <span className="sr-only">Loading</span>
      <span className="h-px w-24 overflow-hidden bg-border">
        <span className="block h-px w-1/3 animate-[loadingSlide_1.1s_ease-in-out_infinite] bg-primary" />
      </span>
    </div>
  );
}
