import { NextResponse } from "next/server";
import type { ZodType } from "zod";

import { ApiError } from "@/lib/errors";
import type { PaginationParams } from "@/types/memtime";

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function parseIntParam(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new ApiError(400, `Invalid ${label}`);
  }
  return parsed;
}

export function parseListParams(searchParams: URLSearchParams): PaginationParams {
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const sortBy = searchParams.get("sortBy") ?? undefined;
  const orderRaw = searchParams.get("order");
  const order =
    orderRaw === "asc" || orderRaw === "desc" ? orderRaw : undefined;

  const params: PaginationParams = {};
  if (limit !== null && limit !== "") {
    params.limit = Number(limit);
  }
  if (offset !== null && offset !== "") {
    params.offset = Number(offset);
  }
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  return params;
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(400, "Invalid JSON body");
    }
    throw error;
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    throw new ApiError(400, first?.message ?? "Invalid request body");
  }
  return result.data;
}
