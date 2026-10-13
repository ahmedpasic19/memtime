import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const memtimeFetch = vi.fn();

vi.mock("./http", () => ({
  memtimeFetch: (...args: unknown[]) => memtimeFetch(...args),
}));

import { listTimeEntries } from "./time-entries";

describe("time-entries", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("strips userId from list responses", async () => {
    memtimeFetch.mockResolvedValue([
      {
        id: 0,
        taskId: 1,
        userId: "secret-api-key",
        comment: "Work",
        start: "2024-01-15T09:00:00.000Z",
        end: "2024-01-15T17:00:00.000Z",
        createdAt: "2024-01-15T17:05:00.000Z",
        updatedAt: "2024-01-15T17:05:00.000Z",
      },
    ]);

    const entries = await listTimeEntries({ limit: 10 });
    expect(entries[0]).not.toHaveProperty("userId");
    expect(entries[0]?.id).toBe(0);
  });
});
