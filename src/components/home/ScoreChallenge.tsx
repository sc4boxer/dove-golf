"use client";

import { useEffect, useState } from "react";
import { readScoreChallenge, type ScoreChallenge as Challenge } from "./leaderboardChallenge";

export function ScoreChallenge() {
  const [challenge, setChallenge] = useState<Challenge | { status: "loading" }>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    async function load() {
      try {
        const response = await fetch("/api/putting/scores?period=alltime&edition=current", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Leaderboard unavailable");
        const result = readScoreChallenge(await response.json());
        if (active) setChallenge(result);
      } catch {
        if (active) setChallenge({ status: "unavailable" });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  return <div className="mt-3 min-h-12 text-xs leading-5" role="status" aria-live="polite">
    <p className="font-medium text-slate-500">Current course · All-time</p>
    <p className="text-slate-700">
      {challenge.status === "ready" ? <>Score to beat: <strong className="font-semibold text-slate-900">{challenge.score.toLocaleString("en-US")} points</strong> · {challenge.initials}</> :
        challenge.status === "empty" ? "Set the first high score on this course." :
        challenge.status === "loading" ? "Finding the score to beat…" :
        "High scores are unavailable right now. You can still play."}
    </p>
  </div>;
}

