export type Run = { ms: number; ok: boolean; at: number; target: string };

export const MAX_RUNS = 12;
export const TIMEOUT_MS = 10_000;

/**
 * Accepts same-origin paths ("/", "/api") and absolute http(s) URLs.
 * Bare hosts like "example.com" are treated as https.
 */
export function normalizeTarget(input: string, origin: string): { url: string; host: string } | { error: string } {
  const value = input.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").trim();
  if (!value) return { error: "Enter a URL or a path such as /." };
  // "localhost:3000" and "example.com:8080/health" are a host and port, not a
  // URL scheme called "localhost:" — only treat the prefix as a scheme when it
  // is not followed by a port number.
  const hostWithPort = /^[a-z0-9.-]+:\d+(?:[/?#]|$)/i.test(value);
  const hasScheme = !hostWithPort && /^[a-z][a-z0-9+.-]*:/i.test(value);
  const candidate = value.startsWith("/") || hasScheme ? value : `https://${value}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate, origin);
  } catch {
    return { error: "That does not look like a URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { error: "Only http and https targets can be measured." };
  return { url: parsed.href, host: parsed.host };
}

export type Summary = { count: number; ok: number; average: number; median: number; min: number; max: number };

/** Statistics over successful runs only; failed requests do not skew timing. */
export function summarize(runs: Run[]): Summary {
  const times = runs.filter((run) => run.ok).map((run) => run.ms).sort((a, b) => a - b);
  if (times.length === 0) return { count: runs.length, ok: 0, average: 0, median: 0, min: 0, max: 0 };
  const mid = Math.floor(times.length / 2);
  const median = times.length % 2 ? times[mid] : Math.round((times[mid - 1] + times[mid]) / 2);
  return {
    count: runs.length,
    ok: times.length,
    average: Math.round(times.reduce((sum, ms) => sum + ms, 0) / times.length),
    median,
    min: times[0],
    max: times[times.length - 1],
  };
}

export function addRun(runs: Run[], run: Run): Run[] {
  return [run, ...runs].slice(0, MAX_RUNS);
}
