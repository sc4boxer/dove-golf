"use client";

import { useEffect, useState } from "react";
import type { Shot } from "@/lib/putting/physics";
import ScoreShare from "@/components/putting/ScoreShare";
import styles from "./PuttingGame.module.css";

type Entry = {id: string; initials: string; score: number; rank: number; achievedAt: string; courseVersion: string};
type Result = {strokes: number; points: number; sunk: boolean};

export function PuttingLeaderboard({results, shots, complete, getToken}: {results: Result[]; shots: Shot[][]; complete: boolean; getToken: () => Promise<string>}) {
  const [period, setPeriod] = useState("weekly");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [initials, setInitials] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState<Entry | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setLoadError("");
      try {
        const response = await fetch(`/api/putting/scores?period=${period}`, {signal: controller.signal});
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Leaderboard unavailable. Your game still works.");
        setEntries(data.entries);
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(error instanceof Error ? error.message : "Could not load scores.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [period, refresh]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || saved || !complete) return;
    setSaving(true); setSaveError("");
    try {
      const token = await getToken();
      const response = await fetch("/api/putting/scores", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({token, initials, shots})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not post your score. Try again.");
      setSaved(data.entry); setRefresh(value => value + 1);
    } catch (error) { setSaveError(error instanceof Error ? error.message : "Could not post your score. Try again."); }
    finally { setSaving(false); }
  }

  return <div className={styles.leaderboard}>
    {complete && <section id="round-scorecard" className={styles.panel} aria-labelledby="round-score-title">
      <p className={styles.eyebrow}>Five greens. One score.</p>
      <h2 id="round-score-title">{results.reduce((sum, result) => sum + result.points, 0).toLocaleString()} points</h2>
      <ol className={styles.holeResults}>{results.map((result, index) => <li key={index}><span>Hole {index + 1}</span><strong>{result.points}</strong><small>{result.sunk ? `${result.strokes} putt${result.strokes === 1 ? "" : "s"}` : "Not sunk"}</small></li>)}</ol>
      {!saved ? <form onSubmit={submit}>
        <label className={styles.initialsLabel} htmlFor="arcade-initials">Put your initials on the board</label>
        <input id="arcade-initials" className={styles.initials} value={initials} onChange={event => setInitials(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3))} required minLength={3} maxLength={3} pattern="[A-Z0-9]{3}" autoComplete="off" spellCheck={false} aria-describedby="initials-help" placeholder="JSC" disabled={saving} />
        <p className={styles.help} id="initials-help">Three letters or numbers. Your initials, score and date will be public. No account needed. Initials are not unique player identities.</p>
        <button className={styles.primary} disabled={saving}>{saving ? "Checking your round…" : "Post my score →"}</button>
        {saveError && <p role="alert" className={styles.error}>{saveError}</p>}
      </form> : <><p role="status" className={styles.description}>Score posted! {saved.initials} · Weekly rank #{saved.rank} when submitted.</p><ScoreShare entry={saved} /></>}
    </section>}
    <section className={styles.panel} aria-labelledby="leaderboard-title">
      <p className={styles.eyebrow}>The putting arcade</p>
      <h2 id="leaderboard-title">High scores</h2>
      <div className={styles.periods} aria-label="Leaderboard period">{["weekly", "alltime"].map(value => <button key={value} aria-pressed={period === value} onClick={() => setPeriod(value)}>{value === "weekly" ? "This week" : "All time"}</button>)}</div>
      <p className={styles.help}>{period === "weekly" ? "Week starts Monday at 00:00 UTC." : "Scores from this course edition."} Equal scores share a rank.</p>
      {loading ? <p role="status">Loading scores…</p> : loadError ? <div><p role="status" className={styles.error}>{loadError}</p><button className={styles.secondary} onClick={() => setRefresh(value => value + 1)}>Retry leaderboard</button></div> : entries.length === 0 ? <p className={styles.description}>The board is open. Finish five holes and set the first score.</p> : <div className={styles.tableWrap}><table className={styles.scoreTable}><caption className="sr-only">{period === "weekly" ? "This week’s" : "All time"} top ten scores</caption><thead><tr><th>Rank</th><th>Initials</th><th>Points</th><th>Date</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.id} className={entry.id === saved?.id ? styles.yourScore : undefined}><td>#{entry.rank}</td><th scope="row">{entry.initials}{entry.id === saved?.id && <span className="sr-only"> — your score</span>}</th><td>{entry.score.toLocaleString()}</td><td>{new Date(entry.achievedAt).toLocaleDateString("en-US", {month: "short", day: "numeric", timeZone: "UTC"})}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}

