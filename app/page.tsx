"use client";

import { useMemo, useState } from "react";

type Run = { ms: number; ok: boolean; at: number; target: string };

const presets = ["/", "https://example.com", "https://bookchaowalit.com"];

export default function Home() {
  const [url, setUrl] = useState("/");
  const [runs, setRuns] = useState<Run[]>([]);
  const [busy, setBusy] = useState(false);
  const average = runs.length ? Math.round(runs.reduce((sum, run) => sum + run.ms, 0) / runs.length) : 0;
  const latest = runs[0];
  const visualLatency = Math.min(100, Math.max(5, latest ? latest.ms / 3 : 5));
  const status = busy ? "MEASURING" : latest ? (latest.ok ? "RESPONDED" : "NO RESPONSE") : "READY";
  const host = useMemo(() => {
    try { return new URL(url, "http://localhost").host; } catch { return "invalid target"; }
  }, [url]);

  async function ping() {
    setBusy(true);
    const started = performance.now();
    try {
      await fetch(url, { cache: "no-store", mode: "cors" });
      setRuns((previous) => [{ ms: Math.round(performance.now() - started), ok: true, at: Date.now(), target: host }, ...previous].slice(0, 12));
    } catch {
      setRuns((previous) => [{ ms: Math.round(performance.now() - started), ok: false, at: Date.now(), target: host }, ...previous].slice(0, 12));
    } finally {
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
        <div className="instrument-radar" aria-label={`Current latency ${average} milliseconds`}>
          <div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-ring ring-three" />
          <div className="radar-cross cross-x" /><div className="radar-cross cross-y" /><div className="radar-sweep" />
          <strong>{average}</strong><span>MS AVG</span>
        </div>
      </section>

      <section className="probe-panel" aria-label="Latency probe">
        <div className="probe-label"><span>01</span><b>Set a target</b><small>HTTP request from your current browser</small></div>
        <div className="probe-controls">
          <label className="target-input"><span>↳</span><input value={url} onChange={(event) => setUrl(event.target.value)} aria-label="URL to ping" placeholder="https://your-target.test" /></label>
          <button className="probe-button" onClick={() => void ping()} disabled={busy}>{busy ? "WORKING…" : "PING TARGET"}<span>↗</span></button>
        </div>
        <div className="preset-row"><span>Try a station:</span>{presets.map((preset) => <button key={preset} onClick={() => setUrl(preset)}>{preset}</button>)}</div>
      </section>

      <section className="readout-grid">
        <div className="readout-card readout-primary"><div className="readout-heading"><span>02 / Current reading</span><b className={busy ? "live-dot pulse" : "live-dot"} />{status}</div><div className="big-reading">{latest ? latest.ms : "—"}<small>ms</small></div><div className="signal-track"><i style={{ width: `${visualLatency}%` }} /></div><div className="readout-meta"><span>{latest ? latest.target : host}</span><span>{latest ? new Date(latest.at).toLocaleTimeString() : "Awaiting probe"}</span></div></div>
        <div className="readout-card"><div className="readout-heading"><span>03 / Session average</span><b>12 max</b></div><div className="average-reading">{average}<small>ms</small></div><p>Across the most recent {runs.length} {runs.length === 1 ? "measurement" : "measurements"} in this tab.</p></div>
      </section>

      <section className="log-section"><div className="log-title"><span>04 / Measurement log</span><span>{runs.length ? "newest first" : "no readings yet"}</span></div>{runs.length > 0 ? <div className="log-list">{runs.map((run, index) => <div className="log-row" key={`${run.at}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{run.ms}<small>ms</small></strong><span>{run.ok ? "response received" : "request failed"}</span><span>{run.target}</span><time>{new Date(run.at).toLocaleTimeString()}</time></div>)}</div> : <div className="log-empty">Run a probe to leave the first trace in this session.</div>}</section>

      <footer className="instrument-footer"><span>HONEST DEMO / CORS AND NETWORK CONDITIONS APPLY</span><span>R-T / 001</span></footer>
    </main>
  );
}
