import { describe, expect, it } from "vitest";

import {
  timeEntryFormSchema,
  toApiPayload,
  toDatetimeLocalValue,
} from "./schema";

describe("timeEntryFormSchema", () => {
  it("rejects end before start", () => {
    const result = timeEntryFormSchema.safeParse({
      taskId: 1,
      comment: "Work",
      startLocal: "2024-01-15T10:00",
      endLocal: "2024-01-15T09:00",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid values", () => {
    const result = timeEntryFormSchema.safeParse({
      taskId: 1,
      comment: "Work",
      startLocal: "2024-01-15T09:00",
      endLocal: "2024-01-15T17:00",
    });
    expect(result.success).toBe(true);
  });
});

describe("toApiPayload", () => {
  it("converts local datetimes to ISO strings", () => {
    const payload = toApiPayload({
      taskId: 2,
      comment: "  Done  ",
      startLocal: "2024-01-15T09:00",
      endLocal: "2024-01-15T17:00",
    });
    expect(payload.taskId).toBe(2);
    expect(payload.comment).toBe("Done");
    expect(payload.start).toMatch(/T/);
    expect(payload.end).toMatch(/T/);
    expect(new Date(payload.end).getTime()).toBeGreaterThan(
      new Date(payload.start).getTime(),
    );
  });
});

describe("toDatetimeLocalValue", () => {
  it("formats ISO date for datetime-local input", () => {
    const value = toDatetimeLocalValue("2024-01-15T08:30:00.000Z");
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});
