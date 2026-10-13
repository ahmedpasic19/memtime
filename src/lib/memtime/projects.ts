import type { PaginationParams, Task } from "@/types/memtime";

import { memtimeFetch } from "./http";

export async function listProjectTasks(
  projectId: number,
  params: PaginationParams = {},
): Promise<Task[]> {
  return memtimeFetch<Task[]>(`/projects/${projectId}/tasks`, {
    query: { ...params },
    dataCache: "hierarchy",
  });
}
