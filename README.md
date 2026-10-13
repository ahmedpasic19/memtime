# Memtime Time Tracking (Interview Task)

Next.js application for browsing **Clients → Projects → Tasks** and managing **time entries** against the Memtime interview API.

## Setup

```bash
pnpm install
cp .env.example .env.local   # add your API key
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/time-entries`).

### Environment

| Variable          | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `MEMTIME_API_URL` | Base URL, default `https://interview-api.memtime-demo.deno.net/api/v1` |
| `MEMTIME_API_KEY` | Bearer token for API requests (server-side only)                       |

## Scripts

| Command          | Description           |
| ---------------- | --------------------- |
| `pnpm dev`       | Development server    |
| `pnpm build`     | Production build      |
| `pnpm start`     | Run production server |
| `pnpm lint`      | ESLint                |
| `pnpm typecheck` | TypeScript            |
| `pnpm test`      | Vitest unit tests     |

## Architecture

```
Browser → /api/* Route Handlers → lib/memtime (server-only) → Memtime API
         ↳ TanStack Query (client caching & mutations)
```

- **API key safety:** The browser never calls the external API. Route Handlers attach `Authorization` on the server and strip `userId` (the upstream API key) from time entry responses before sending JSON to the client.
- **Rate limit (15 req/min):** The hierarchy tree lazy-loads projects and tasks on expand. Hierarchy reads are cached on the server for 5 minutes (`revalidate: 300`). TanStack Query caches client results for 5 minutes and does not retry on `429`.
- **Pagination:** Time entries use URL `limit` and `offset`. Each page requests exactly `limit` rows from the API; **Next** is enabled when a full page is returned. Changing pages keeps the previous page visible while fetching (`keepPreviousData`).

### Routes

- `/clients` — expandable client / project / task tree with paginated “Load more”
- `/time-entries` — paginated list, create/edit dialog, delete with confirmation

### Project layout

- `src/lib/memtime/` — typed server HTTP client
- `src/app/api/` — BFF proxies
- `src/features/hierarchy/` — tree UI and hooks
- `src/features/time-entries/` — list, form, validation, mutations
