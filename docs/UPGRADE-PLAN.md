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

## Done in this pass (pass 2)

- Canonical host is config-driven: `lib/site.ts` resolves `NEXT_PUBLIC_SITE_URL` (validated, clear error on a non-http(s) value) and feeds `metadataBase`, generated `app/sitemap.ts` / `app/robots.ts` and the MCP `get_app_info` URL; removed the stale template `public/sitemap.xml` / `robots.txt` (they pointed at `bookchaowalit.com` and a `*.vercel.app` name that differs from the project URL). Tested in `lib/site.test.ts`.

## Done in this pass (pass 3)
- Edge-case pass on `normalizeTarget` in `lib/latency.ts` (regression tests in
  `lib/latency.test.ts`):
  - `localhost:3000` and `example.com:8080/health` matched the "has a scheme"
    regex, were parsed as the schemes `localhost:` / `example.com:` and were
    rejected with "Only http and https targets can be measured". Host:port
    input is now prefixed with https like other bare hosts.
  - Zero-width characters / BOM pasted around a target are stripped, so an
    invisible-only input reports "Enter a URL" instead of probing `https:///`.
- Security deps: `next` 16.1.6 -> 16.3.8 (and `eslint-config-next`) clears critical GHSA-2xp9-vwfh-vxw4 (Image Optimization RCE) plus bundled postcss/sharp highs; lockfile regenerated with same-major `npm audit fix`. `npm audit --omit=dev`: C1/H3/M1/L0 [nanoid:h,next:c,postcss:h,sharp:h] -> C0/H0/M0/L0.
