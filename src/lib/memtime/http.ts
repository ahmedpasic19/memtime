import "server-only";

import { buildUrl, readErrorMessage } from "@/lib/http";
import { ApiError } from "@/lib/errors";

function getConfig() {
  const baseUrl = process.env.MEMTIME_API_URL;
  const apiKey = process.env.MEMTIME_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing MEMTIME_API_URL or MEMTIME_API_KEY environment variables.",
    );
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
}

export type MemtimeQuery = Record<
  string,
  string | number | boolean | undefined
>;

export type MemtimeDataCache = "live" | "hierarchy";

export type MemtimeFetchInit = RequestInit & {
  query?: MemtimeQuery;
  dataCache?: MemtimeDataCache;
};

function cacheInit(dataCache: MemtimeDataCache | undefined): RequestInit {
  if (dataCache === "hierarchy") {
    return { next: { revalidate: 300 } };
  }
  return { cache: "no-store" };
}

export async function memtimeFetch<T>(
  path: string,
  init?: MemtimeFetchInit,
): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const { query, dataCache, ...requestInit } = init ?? {};
  const url = buildUrl(baseUrl, path, query);

  const response = await fetch(url.toString(), {
    ...cacheInit(dataCache),
    ...requestInit,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
      ...requestInit.headers,
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
