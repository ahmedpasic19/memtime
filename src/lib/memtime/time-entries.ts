import type {
  MemtimeTimeEntry,
  PaginationParams,
  TimeEntry,
  TimeEntryInput,
} from "@/types/memtime";

import { memtimeFetch } from "./http";

function toPublicTimeEntry(raw: MemtimeTimeEntry): TimeEntry {
  return {
    id: raw.id,
    taskId: raw.taskId,
    comment: raw.comment,
    start: raw.start,
    end: raw.end,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function mapEntries(raw: MemtimeTimeEntry[]): TimeEntry[] {
  return raw.map(toPublicTimeEntry);
}

export async function listTimeEntries(
  params: PaginationParams = {},
): Promise<TimeEntry[]> {
  const raw = await memtimeFetch<MemtimeTimeEntry[]>("/time-entries", {
    query: { ...params },
  });
  return mapEntries(raw);
}

export async function getTimeEntry(id: number): Promise<TimeEntry> {
  const raw = await memtimeFetch<MemtimeTimeEntry>(`/time-entries/${id}`);
  return toPublicTimeEntry(raw);
}

export async function createTimeEntry(
  input: TimeEntryInput,
): Promise<TimeEntry> {
  const raw = await memtimeFetch<MemtimeTimeEntry>("/time-entries", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return toPublicTimeEntry(raw);
}

export async function updateTimeEntry(
  id: number,
  input: TimeEntryInput,
): Promise<TimeEntry> {
  const raw = await memtimeFetch<MemtimeTimeEntry>(`/time-entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return toPublicTimeEntry(raw);
}

export async function deleteTimeEntry(id: number): Promise<{ message: string }> {
  return memtimeFetch<{ message: string }>(`/time-entries/${id}`, {
    method: "DELETE",
  });
}
