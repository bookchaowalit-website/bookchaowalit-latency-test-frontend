# Latency Test

Ping a URL from the browser.

## Features
- Ping a same-origin path or any http(s) URL (bare hosts get https)
- Cross-origin targets use `no-cors`, so an opaque response still counts as a round trip; 10 s timeout
- Average, median, min and max over successful requests; failures are logged but excluded from timing
- Last 12 readings kept in the tab (not persisted)

## Limitations
- Browser fetch timing includes DNS/TLS/connection setup and is affected by caching, extensions and CORS; it is not ICMP ping

## Run
```bash
npm install
npm run dev
```

## Honesty
Portfolio demo. Not multi-tenant SaaS. Prefer local-only state over fake production claims.

## Checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks on every push (`.github/workflows/ci.yml`).
