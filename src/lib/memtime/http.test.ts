import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { memtimeFetch } from "./http";

describe("memtimeFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sends Authorization header and returns JSON", async () => {
    vi.stubEnv("MEMTIME_API_URL", "https://api.test/api/v1");
    vi.stubEnv("MEMTIME_API_KEY", "secret-key");

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: 1 }]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const data = await memtimeFetch<{ id: number }[]>("/clients");

    expect(data).toEqual([{ id: 1 }]);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.test/api/v1/clients");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer secret-key",
    });
  });

  it("throws ApiError on failure", async () => {
    vi.stubEnv("MEMTIME_API_URL", "https://api.test/api/v1");
    vi.stubEnv("MEMTIME_API_KEY", "secret-key");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
        }),
      ),
    );

    await expect(memtimeFetch("/missing")).rejects.toMatchObject({
      status: 404,
      message: "Not found",
    });
  });
});
