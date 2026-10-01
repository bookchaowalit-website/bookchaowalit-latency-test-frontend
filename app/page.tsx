"use client";

import { useMemo, useState } from "react";
import { addRun, MAX_RUNS, normalizeTarget, summarize, TIMEOUT_MS, type Run } from "@/lib/latency";

const presets = ["/", "https://example.com", "https://bookchaowalit.com"];

export default function Home() {
  const [url, setUrl] = useState("/");
  const [runs, setRuns] = useState<Run[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const summary = useMemo(() => summarize(runs), [runs]);
  const average = summary.average;
  const latest = runs[0];
  const visualLatency = Math.min(100, Math.max(5, latest ? latest.ms / 3 : 5));
  const status = busy ? "MEASURING" : latest ? (latest.ok ? "RESPONDED" : "NO RESPONSE") : "READY";
  const host = useMemo(() => {
    const target = normalizeTarget(url, "http://localhost");
    return "error" in target ? "invalid target" : target.host;
  }, [url]);

  async function ping() {
    const target = normalizeTarget(url, window.location.origin);
    if ("error" in target) { setError(target.error); return; }
    setError("");
    setBusy(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    const started = performance.now();
    let ok = false;
    try {
      // Same-origin targets get a normal request; cross-origin targets use no-cors so an
      // opaque response still counts as a completed round trip without reading its body.
      const sameOrigin = new URL(target.url).origin === window.location.origin;
      await fetch(target.url, { cache: "no-store", mode: sameOrigin ? "same-origin" : "no-cors", signal: controller.signal });
      ok = true;
    } catch {
      ok = false;
    } finally {
      window.clearTimeout(timer);
      const ms = Math.round(performance.now() - started);
      setRuns((previous) => addRun(previous, { ms, ok, at: Date.now(), target: target.host }));
      setBusy(false);
    }
  }

  return (
    <main className="instrument-shell">
      <header className="instrument-topbar">
        <span className="instrument-brand"><i /> ROUND-TRIP</span>
        <span className="instrument-mode">BROWSER INSTRUMENT / LOCAL SESSION</span>
        <span className="instrument-clock">SESSION / LOCAL</span>
      </header>

      <section className="instrument-hero">
        <div className="instrument-copy">
          <p className="instrument-kicker">Packet timing laboratory</p>
          <h1>How long does<br /><em>the signal take?</em></h1>
          <p>Measure a URL from this browser. One request, one round trip, no server-side fiction.</p>
        </div>
        <div className="instrument-radar" role="img" aria-label={`Average latency ${average} milliseconds`}>
          <div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-ring ring-three" />
          <div className="radar-cross cross-x" /><div className="radar-cross cross-y" /><div className="radar-sweep" />
          <strong>{average}</strong><span>MS AVG</span>
        </div>
      </section>

      <section className="probe-panel" aria-label="Latency probe">
        <div className="probe-label"><span>01</span><b>Set a target</b><small>HTTP request from your current browser</small></div>
        <form className="probe-controls" onSubmit={(event) => { event.preventDefault(); void ping(); }}>
          <label className="target-input"><span>↳</span><input value={url} onChange={(event) => setUrl(event.target.value)} aria-label="URL to ping" placeholder="https://your-target.test" /></label>
          <button className="probe-button" type="submit" disabled={busy}>{busy ? "WORKING…" : "PING TARGET"}<span aria-hidden="true">↗</span></button>
        </form>
        {error ? <p className="probe-error" role="alert">{error}</p> : null}
        <div className="preset-row"><span>Try a station:</span>{presets.map((preset) => <button type="button" key={preset} onClick={() => setUrl(preset)}>{preset}</button>)}</div>
      </section>

      <section className="readout-grid">
        <div className="readout-card readout-primary"><div className="readout-heading"><span>02 / Current reading</span><b className={busy ? "live-dot pulse" : "live-dot"} />{status}</div><div className="big-reading">{latest ? latest.ms : "—"}<small>ms</small></div><div className="signal-track"><i style={{ width: `${visualLatency}%` }} /></div><div className="readout-meta"><span>{latest ? latest.target : host}</span><span>{latest ? new Date(latest.at).toLocaleTimeString() : "Awaiting probe"}</span></div></div>
        <div className="readout-card"><div className="readout-heading"><span>03 / Session average</span><b>{MAX_RUNS} max</b></div><div className="average-reading">{average}<small>ms</small></div><p>{summary.ok} of {runs.length} {runs.length === 1 ? "request" : "requests"} responded in this tab.{summary.ok > 1 ? ` Median ${summary.median} ms · min ${summary.min} · max ${summary.max}.` : ""} Failed requests are excluded from timing.</p></div>
      </section>

      <section className="log-section"><div className="log-title"><span>04 / Measurement log</span><span>{runs.length ? "newest first" : "no readings yet"}</span></div>{runs.length > 0 ? <div className="log-list">{runs.map((run, index) => <div className="log-row" key={`${run.at}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{run.ms}<small>ms</small></strong><span>{run.ok ? "response received" : "failed or timed out"}</span><span>{run.target}</span><time>{new Date(run.at).toLocaleTimeString()}</time></div>)}</div> : <div className="log-empty">Run a probe to leave the first trace in this session.</div>}</section>

      <footer className="instrument-footer"><span>HONEST DEMO / CORS AND NETWORK CONDITIONS APPLY</span><span>R-T / 001</span></footer>
    </main>
  );
}
