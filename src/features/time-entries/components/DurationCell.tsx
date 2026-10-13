import { formatDuration } from "@/lib/format";

export function DurationCell({
  ms,
  maxMs,
}: {
  ms: number;
  maxMs: number;
}) {
  const ratio = maxMs > 0 ? Math.min(1, ms / maxMs) : 0;

  return (
    <div className="flex min-w-[120px] items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="font-mono tabular w-14 shrink-0 text-right text-xs text-foreground">
        {formatDuration(ms)}
      </span>
    </div>
  );
}
