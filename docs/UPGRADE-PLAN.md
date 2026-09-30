# Upgrade plan

## Current state

Score: 7/10 (was 4/10) — measurements now work for cross-origin targets, input is validated, stats are tested; results are tab-only.

## Backlog

- P1: Optional "ping N times" burst with a small distribution chart.
- P1: Use the Resource Timing API to split DNS/connect/TTFB when the target sends `Timing-Allow-Origin`.
- P2: Persist the last session in localStorage; export log as CSV.
- P2: Playwright smoke test against a local route.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- `/api/mcp` uses a typed JSON-RPC handler (`lib/mcp.ts`, tested) with proper error codes and an honest `get_app_info` tool; this fixed the template's lint errors.
- `/more-projects` renders from `lib/related-projects.ts` (was ~980 lines of unrolled links plus an unused data copy) and no longer links to itself; removed the stale `app/page.tsx.backup`.
- Measurement logic moved to `lib/latency.ts` (tested): target normalisation rejects non-http(s) schemes, stats ignore failed requests, log capped at 12.
- Cross-origin probes previously always failed (`mode: cors`); they now use `no-cors` with a 10 s abort timeout. Added median/min/max, a real form (Enter to ping), inline validation errors, and `role=img` on the radar readout.
