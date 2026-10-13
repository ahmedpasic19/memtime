import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const listTimeEntries = vi.fn();
const createTimeEntry = vi.fn();

vi.mock("@/lib/memtime/time-entries", () => ({
  listTimeEntries: (...args: unknown[]) => listTimeEntries(...args),
  createTimeEntry: (...args: unknown[]) => createTimeEntry(...args),
}));

import { GET, POST } from "./route";

describe("POST /api/time-entries", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for malformed JSON", async () => {
    const request = new Request("http://localhost/api/time-entries", {
      method: "POST",
      body: "{ not-json",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON body" });
    expect(createTimeEntry).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid body", async () => {
    const request = new Request("http://localhost/api/time-entries", {
      method: "POST",
      body: JSON.stringify({ taskId: 1, comment: "" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(createTimeEntry).not.toHaveBeenCalled();
  });

  it("returns 201 without userId", async () => {
    createTimeEntry.mockResolvedValue({
      id: 5,
      taskId: 1,
      comment: "Done",
      start: "2024-01-15T09:00:00.000Z",
      end: "2024-01-15T17:00:00.000Z",
      createdAt: "2024-01-15T17:05:00.000Z",
      updatedAt: "2024-01-15T17:05:00.000Z",
    });

    const request = new Request("http://localhost/api/time-entries", {
      method: "POST",
      body: JSON.stringify({
        taskId: 1,
        comment: "Done",
        start: "2024-01-15T09:00:00.000Z",
        end: "2024-01-15T17:00:00.000Z",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).not.toHaveProperty("userId");
    expect(body.id).toBe(5);
  });
});

describe("GET /api/time-entries", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("passes pagination to listTimeEntries", async () => {
    listTimeEntries.mockResolvedValue([]);
    const request = new Request(
      "http://localhost/api/time-entries?limit=20&offset=40&sortBy=start&order=desc",
    );

    await GET(request);
    expect(listTimeEntries).toHaveBeenCalledWith({
      limit: 20,
      offset: 40,
      sortBy: "start",
      order: "desc",
    });
  });
});
