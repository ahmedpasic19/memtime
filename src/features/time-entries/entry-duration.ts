import type { TimeEntry } from "@/types/memtime";

export function entryDurationMs(entry: TimeEntry): number {
  return Math.max(
    0,
    new Date(entry.end).getTime() - new Date(entry.start).getTime(),
  );
}
