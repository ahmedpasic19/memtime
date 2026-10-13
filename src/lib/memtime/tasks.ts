import type { Task } from "@/types/memtime";

import { memtimeFetch, type MemtimeFetchInit } from "./http";

export async function getTask(
  taskId: number,
  init?: Pick<MemtimeFetchInit, "dataCache">,
): Promise<Task> {
  return memtimeFetch<Task>(`/tasks/${taskId}`, {
    dataCache: init?.dataCache ?? "hierarchy",
  });
}
