export type HttpQuery = Record<string, string | number | boolean | undefined>;

export function applyQueryParams(url: URL, query?: HttpQuery): void {
  if (!query) return;
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }
}

export function buildUrl(base: string, path: string, query?: HttpQuery): URL {
  const normalizedBase = base.replace(/\/$/, "");
  const fullPath = path.startsWith("/")
    ? `${normalizedBase}${path}`
    : `${normalizedBase}/${path}`;
  const url = new URL(fullPath);
  applyQueryParams(url, query);
  return url;
}

export async function readErrorMessage(response: Response): Promise<string> {
  let message = response.statusText;
  try {
    const body = (await response.json()) as { error?: string };
    if (body?.error) message = body.error;
  } catch {
    // ignore JSON parse errors
  }
  return message;
}
