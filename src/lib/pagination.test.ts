import { describe, expect, it } from "vitest";

import {
  clampPageSize,
  hasNextPage,
  parsePagination,
} from "./pagination";

describe("parsePagination", () => {
  it("defaults limit and offset", () => {
    expect(parsePagination(new URLSearchParams())).toEqual({
      limit: 10,
      offset: 0,
    });
  });

  it("parses valid search params", () => {
    const params = new URLSearchParams("limit=20&offset=40");
    expect(parsePagination(params)).toEqual({ limit: 20, offset: 40 });
  });

  it("clamps invalid limit", () => {
    expect(parsePagination(new URLSearchParams("limit=999"))).toEqual({
      limit: 50,
      offset: 0,
    });
  });

  it("floors offset", () => {
    expect(parsePagination(new URLSearchParams("offset=10.9"))).toEqual({
      limit: 10,
      offset: 10,
    });
  });
});

describe("clampPageSize", () => {
  it("returns allowed sizes", () => {
    expect(clampPageSize(10)).toBe(10);
    expect(clampPageSize(20)).toBe(20);
    expect(clampPageSize(50)).toBe(50);
  });
});

describe("hasNextPage", () => {
  it("is true when a full page was returned", () => {
    expect(hasNextPage(10, 10)).toBe(true);
  });

  it("is false when fewer than limit items", () => {
    expect(hasNextPage(3, 10)).toBe(false);
  });
});
