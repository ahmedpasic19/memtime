export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export interface ParsedPagination {
  limit: number;
  offset: number;
}

export function parsePagination(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): ParsedPagination {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const rawLimit = Number(get("limit") ?? DEFAULT_PAGE_SIZE);
  const rawOffset = Number(get("offset") ?? 0);

  const limit = clampPageSize(rawLimit);
  const offset =
    Number.isFinite(rawOffset) && rawOffset >= 0
      ? Math.floor(rawOffset)
      : 0;

  return { limit, offset };
}

export function clampPageSize(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PAGE_SIZE;
  const rounded = Math.floor(value);
  if (PAGE_SIZE_OPTIONS.includes(rounded as (typeof PAGE_SIZE_OPTIONS)[number])) {
    return rounded;
  }
  if (rounded <= 10) return 10;
  if (rounded <= 20) return 20;
  return 50;
}

export function hasNextPage(itemCount: number, limit: number): boolean {
  return itemCount === limit;
}

export function buildPaginationSearchParams(
  limit: number,
  offset: number,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return params;
}
