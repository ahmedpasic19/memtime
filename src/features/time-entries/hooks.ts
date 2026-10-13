"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { browserApi } from "@/lib/api-client";
import type { ParsedPagination } from "@/lib/pagination";
import type { TimeEntry, TimeEntryInput } from "@/types/memtime";

const STALE_TIME = 60 * 1000;

export function timeEntriesQueryKey(pagination: ParsedPagination) {
  return ["time-entries", pagination] as const;
}

export function useTimeEntries(pagination: ParsedPagination) {
  return useQuery({
    queryKey: timeEntriesQueryKey(pagination),
    queryFn: () =>
      browserApi.get<TimeEntry[]>("/api/time-entries", {
        limit: pagination.limit,
        offset: pagination.offset,
        sortBy: "start",
        order: "desc",
      }),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TimeEntryInput) =>
      browserApi.post<TimeEntry>("/api/time-entries", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["time-entries"] });
    },
  });
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: TimeEntryInput;
    }) => browserApi.put<TimeEntry>(`/api/time-entries/${id}`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["time-entries"] });
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      browserApi.delete<{ message: string }>(`/api/time-entries/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["time-entries"] });
    },
  });
}
