import type { Client, PaginationParams, Project } from "@/types/memtime";

import { memtimeFetch } from "./http";

export async function listClients(
  params: PaginationParams = {},
): Promise<Client[]> {
  return memtimeFetch<Client[]>("/clients", {
    query: { ...params },
    dataCache: "hierarchy",
  });
}

export async function listClientProjects(
  clientId: number,
  params: PaginationParams = {},
): Promise<Project[]> {
  return memtimeFetch<Project[]>(`/clients/${clientId}/projects`, {
    query: { ...params },
    dataCache: "hierarchy",
  });
}
