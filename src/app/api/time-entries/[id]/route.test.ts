import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getTimeEntry = vi.fn();
const updateTimeEntry = vi.fn();
const deleteTimeEntry = vi.fn();

vi.mock("@/lib/memtime/time-entries", () => ({
  getTimeEntry: (...args: unknown[]) => getTimeEntry(...args),
  updateTimeEntry: (...args: unknown[]) => updateTimeEntry(...args),
  deleteTimeEntry: (...args: unknown[]) => deleteTimeEntry(...args),
}));

import { ApiError } from "@/lib/errors";

import { GET, PUT } from "./route";

const context = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/api/time-entries/[id]", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for non-numeric id", async () => {
    const response = await GET(new Request("http://localhost"), context("abc"));
    expect(response.status).toBe(400);
  });

  it("accepts id 0", async () => {
    getTimeEntry.mockResolvedValue({
      id: 0,
      taskId: 1,
      comment: "Work",
      start: "2024-01-15T09:00:00.000Z",
      end: "2024-01-15T17:00:00.000Z",
      createdAt: "2024-01-15T17:05:00.000Z",
      updatedAt: "2024-01-15T17:05:00.000Z",
    });

    const response = await GET(new Request("http://localhost"), context("0"));
    expect(response.status).toBe(200);
    expect(getTimeEntry).toHaveBeenCalledWith(0);
  });

  it("passes through upstream 404", async () => {
    getTimeEntry.mockRejectedValue(new ApiError(404, "Time entry not found"));

    const response = await GET(new Request("http://localhost"), context("99"));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Time entry not found" });
  });

  it("returns 400 for malformed JSON on PUT", async () => {
    const request = new Request("http://localhost/api/time-entries/1", {
      method: "PUT",
      body: "{",
      headers: { "Content-Type": "application/json" },
    });

    const response = await PUT(request, context("1"));
    expect(response.status).toBe(400);
    expect(updateTimeEntry).not.toHaveBeenCalled();
  });
});
