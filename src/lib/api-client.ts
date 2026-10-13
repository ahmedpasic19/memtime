import { applyQueryParams, readErrorMessage } from "@/lib/http";
import { ApiError } from "@/lib/errors";

type Query = Record<string, string | number | boolean | undefined>;

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { query?: Query },
): Promise<T> {
  const { query, ...requestInit } = init ?? {};
  const url = new URL(path, window.location.origin);
  applyQueryParams(url, query);

  const response = await fetch(url.toString(), {
    ...requestInit,
    headers: {
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

export const browserApi = {
  get: <T>(path: string, query?: Query) =>
    apiFetch<T>(path, { method: "GET", query }),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
