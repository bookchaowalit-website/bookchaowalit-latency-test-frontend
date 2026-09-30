import { describe, expect, it } from "vitest";
import { addRun, MAX_RUNS, normalizeTarget, summarize, type Run } from "./latency";

const origin = "https://latency.test";

describe("normalizeTarget", () => {
  it("resolves paths against the current origin", () => {
    expect(normalizeTarget("/", origin)).toEqual({ url: "https://latency.test/", host: "latency.test" });
  });

  it("adds https to bare hosts and keeps explicit schemes", () => {
    expect(normalizeTarget("example.com", origin)).toEqual({ url: "https://example.com/", host: "example.com" });
    expect(normalizeTarget(" http://example.com/a ", origin)).toEqual({ url: "http://example.com/a", host: "example.com" });
  });

  it("rejects empty input and non-http schemes", () => {
    expect(normalizeTarget("  ", origin)).toHaveProperty("error");
    expect(normalizeTarget("javascript:alert(1)", origin)).toHaveProperty("error");
    expect(normalizeTarget("ftp://example.com", origin)).toHaveProperty("error");
  });
});

describe("summarize", () => {
  const run = (ms: number, ok = true): Run => ({ ms, ok, at: 0, target: "t" });

  it("returns zeros when nothing succeeded", () => {
    expect(summarize([run(50, false)])).toEqual({ count: 1, ok: 0, average: 0, median: 0, min: 0, max: 0 });
  });

  it("ignores failed runs and computes median for even counts", () => {
    expect(summarize([run(10), run(30), run(20), run(40), run(9999, false)])).toEqual({ count: 5, ok: 4, average: 25, median: 25, min: 10, max: 40 });
  });
});

describe("addRun", () => {
  it("keeps the newest runs first and caps the log", () => {
    let runs: Run[] = [];
    for (let i = 0; i < MAX_RUNS + 3; i++) runs = addRun(runs, { ms: i, ok: true, at: i, target: "t" });
    expect(runs).toHaveLength(MAX_RUNS);
    expect(runs[0].ms).toBe(MAX_RUNS + 2);
  });
});

describe("normalizeTarget edge cases", () => {
  it("treats host:port as a host, not as a URL scheme", () => {
    expect(normalizeTarget("localhost:3000", "http://x")).toEqual({ url: "https://localhost:3000/", host: "localhost:3000" });
    expect(normalizeTarget("example.com:8080/health", "http://x")).toEqual({ url: "https://example.com:8080/health", host: "example.com:8080" });
    expect(normalizeTarget("http://localhost:3000", "http://x")).toEqual({ url: "http://localhost:3000/", host: "localhost:3000" });
    expect(normalizeTarget("javascript:alert(1)", "http://x")).toHaveProperty("error");
  });

  it("treats zero-width-only input as empty", () => {
    expect(normalizeTarget("​﻿ ", "http://x")).toEqual({ error: "Enter a URL or a path such as /." });
  });
});
