"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { browserApi } from "@/lib/api-client";
import type { Client, Project, Task } from "@/types/memtime";

const STALE_TIME = 5 * 60 * 1000;
const HIERARCHY_PAGE_SIZE = 50;

function nextOffset(lastPage: unknown[], lastPageParam: number): number | undefined {
  return lastPage.length === HIERARCHY_PAGE_SIZE
    ? lastPageParam + HIERARCHY_PAGE_SIZE
    : undefined;
}

export function useClients() {
  return useInfiniteQuery({
    queryKey: ["clients"],
    queryFn: ({ pageParam }) =>
      browserApi.get<Client[]>("/api/clients", {
        limit: HIERARCHY_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      nextOffset(lastPage, lastPageParam),
    staleTime: STALE_TIME,
  });
}

export function useProjects(clientId: number | null, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["clients", clientId, "projects"],
    queryFn: ({ pageParam }) =>
      browserApi.get<Project[]>(`/api/clients/${clientId}/projects`, {
        limit: HIERARCHY_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      nextOffset(lastPage, lastPageParam),
    enabled: enabled && clientId !== null,
    staleTime: STALE_TIME,
  });
}

export function useTasks(projectId: number | null, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: ({ pageParam }) =>
      browserApi.get<Task[]>(`/api/projects/${projectId}/tasks`, {
        limit: HIERARCHY_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      nextOffset(lastPage, lastPageParam),
    enabled: enabled && projectId !== null,
    staleTime: STALE_TIME,
  });
}

export function useTask(taskId: number | null) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => browserApi.get<Task>(`/api/tasks/${taskId}`),
    enabled: taskId !== null,
    staleTime: STALE_TIME,
  });
}
