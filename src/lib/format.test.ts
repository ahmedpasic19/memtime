import { describe, expect, it } from "vitest";

import { formatDuration } from "./format";

describe("formatDuration", () => {
  it("formats minutes only", () => {
    expect(formatDuration(30 * 60_000)).toBe("30m");
  });

  it("formats hours only", () => {
    expect(formatDuration(2 * 60 * 60_000)).toBe("2h");
  });

  it("formats hours and minutes", () => {
    expect(formatDuration(90 * 60_000)).toBe("1h 30m");
  });

  it("never returns negative duration", () => {
    expect(formatDuration(-1000)).toBe("0m");
  });
});
