"use client";

import { useId, useRef, useState } from "react";
import type { RangeRescueClub } from "@/lib/range-rescue/plans";
import { summarizeShots } from "@/lib/range-rescue/beginner-session";
import { getClubSessions, getNextPractice, getPracticeSeries, getWeeklyChallenge, type PracticeSession } from "@/lib/range-rescue/practice-history";
import styles from "./PracticeProgress.module.css";

type Props = {
  club: RangeRescueClub;
  sessions: PracticeSession[];
  enabled: boolean;
  ready: boolean;
  error: string | null;
  account?: boolean;
  busy?: boolean;
  onEnable: () => void;
  onForget: () => void;
  onStart: () => void;
};

function displayDate(date: string) {
  // Display the day recorded at the range, even if the golfer changes timezone.
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function PracticeProgress({ club, sessions, enabled, ready, error, account = false, busy = false, onEnable, onForget, onStart }: Props) {
  const headingId = useId();
  const confirmId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const manageButton = useRef<HTMLButtonElement>(null);
  const [confirmForget, setConfirmForget] = useState(false);
  const saved = enabled ? sessions : [];
  const clubSessions = getClubSessions(saved, club);
  const series = getPracticeSeries(saved, club);
  const challenge = getWeeklyChallenge(saved);
  const nextPractice = getNextPractice(saved, club);
  const clubName = club === "driver" ? "driver" : "iron";

  return <section className={styles.panel} aria-labelledby={headingId}>
    <p className={styles.kicker}>A little practice, worth returning to</p>
    <h2 ref={heading} tabIndex={-1} id={headingId}>Your practice, one visit at a time</h2>
    {!ready ? <p className={styles.muted} role="status">{account ? "Loading your account practice…" : "Checking practice saved in this browser…"}</p> : <>
      {error && <p className={styles.error} role="status">{error}</p>}
      {!enabled ? <>
        <p className={styles.muted}>Keep your latest 30 completed beginner sessions in this browser and return to a next-session plan. Optional, with no account or cloud sync. Practice history is separate from analytics.</p>
        <button className={styles.primary} onClick={onEnable}>Remember my practice</button>
        <p className={styles.fine}>Anyone using this browser can see it. You can delete it and turn saving off here at any time. Clearing browser data also removes it.</p>
      </> : <>
        <p className={styles.fine}>{account ? "Saving to your account · Latest 30 completed sessions across irons and driver · Available when you sign in on another device" : "Saving on this browser · Latest 30 completed sessions across irons and driver · No account or cloud sync"}</p>
        <div className={styles.section}>
          <p className={styles.kicker}>Next {clubName} practice</p>
          <h3>{nextPractice.title}</h3>
          <p className={styles.muted}>{nextPractice.next}</p>
          {clubSessions.length > 0 && <p className={styles.fine}>Based on your {clubName} session on {displayDate(clubSessions[0].localDate)}.</p>}
          <button className={styles.primary} onClick={onStart}>Start a guided {clubName} session <span aria-hidden="true">→</span></button>
        </div>
      </>}

      <div className={styles.section}>
        <h3>A three-visit {clubName} practice series</h3>
        <p className={styles.muted}>{enabled ? series.complete
          ? "Three practice days found in your saved history. You can repeat the series at your own pace; completion is about showing up, not mastering a swing."
          : `${series.completed} of 3 practice days found in your saved ${clubName} history. Each visit uses the guided session. Return on a different day for the next step.`
          : "Three short visits, at your own pace. Follow these steps with or without saving; turn on practice history to remember your place."}</p>
        <ol className={styles.steps}>
          {series.steps.map((step, index) => <li className={styles.step} key={step.title} data-current={enabled && !series.complete && series.currentIndex === index} data-done={enabled && index < series.completed} aria-current={enabled && !series.complete && series.currentIndex === index ? "step" : undefined}>
            <span className={styles.stepNumber} aria-hidden="true">{enabled && index < series.completed ? "✓" : index + 1}</span>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
            <span className={styles.stepLabel}>{enabled && index < series.completed ? "Practice day recorded" : `Visit ${index + 1}${enabled && !series.complete && series.currentIndex === index ? " · Up next" : ""}`}</span>
          </li>)}
        </ol>
        {enabled && <p className={styles.fine}>Progress reflects your latest 30 saved sessions across both clubs, not a lifetime total. Older practice days stop counting when their sessions leave that history.</p>}
        {!enabled && <button className={styles.secondary} style={{ marginTop: 16 }} onClick={onStart}>Try a guided {clubName} session</button>}
      </div>

      <div className={`${styles.section} ${styles.challenge}`}>
        <div className={styles.challengeCopy}>
          <h3>This week: make time for two visits</h3>
          <p className={styles.muted}>Complete a guided session on two different days. Either club counts, and both clubs on the same day count as one visit. Every recorded outcome counts—even a miss.</p>
          <p className={styles.fine}>{displayDate(challenge.weekStart)}–{displayDate(challenge.weekEnd)} · Local calendar week, Monday to Sunday.</p>
          <p className={styles.fine}>{!enabled ? "Turn on practice history to track this challenge. No streaks or catch-up needed." : challenge.complete ? "Two practice days recorded. Challenge complete; take the rest of the week at your own pace." : "An invitation, not a deadline. No streaks or catch-up needed."}</p>
        </div>
        {enabled && <div className={styles.count} aria-label={`${challenge.count} of ${challenge.target} practice days this week`}><strong>{challenge.count}/{challenge.target}</strong><span>days</span></div>}
      </div>

      {enabled &&
        <details className={`${styles.section} ${styles.history}`}>
          <summary>Recent {clubName} sessions ({Math.min(clubSessions.length, 5)})</summary>
          {clubSessions.length === 0 ? <p className={styles.muted}>Your first completed {clubName} session will appear here.</p> : <>
            <p className={styles.fine}>Latest five {clubName} sessions. Each result compares the starting five balls with five after practice. Different clubs or setups between visits make results unsuitable for a direct progress comparison.</p>
            <ul className={styles.sessions}>
              {clubSessions.slice(0, 5).map((session) => {
                const before = summarizeShots(session.before);
                const after = summarizeShots(session.after);
                const unclear = session.before.includes("unsure") || session.after.includes("unsure");
                return <li key={session.id} className={styles.session}>
                  <div className={styles.sessionHead}><strong>{session.club === "driver" ? "Driver" : "Iron"} practice</strong><time dateTime={session.localDate}>{displayDate(session.localDate)}</time></div>
                  <dl className={styles.scores}>
                    <dt>Touched the ball (start → after)</dt><dd>{before.contact}/5 → {after.contact}/5</dd>
                    <dt>Into the air (start → after)</dt><dd>{before.airborne}/5 → {after.airborne}/5</dd>
                  </dl>
                  {unclear && <p className={styles.fine}>Includes unclear shots. These sets cannot be compared fairly.</p>}
                </li>;
              })}
            </ul>
            <p className={styles.fine}>Airborne shots also count as contact. Unclear shots count in neither total. These are your observations, not a swing diagnosis.</p>
          </>}
        </details>}
      {(enabled || error) && <div className={styles.manage}>
          <button ref={manageButton} disabled={busy} className={styles.textButton} aria-expanded={confirmForget} aria-controls={confirmId} onClick={() => setConfirmForget(!confirmForget)}>{account ? "Delete account practice history" : "Delete practice history and turn saving off"}</button>
          {confirmForget && <div id={confirmId} className={styles.confirm}>
            <p>{account ? "Delete all practice history from your account on every device? This cannot be undone. Future completed sessions will still save while signed in. Device-only history is separate." : "Delete all saved iron and driver sessions from this browser and turn saving off? This cannot be undone."}</p>
            <div className={styles.actions}>
              <button className={styles.secondary} autoFocus onClick={() => { setConfirmForget(false); manageButton.current?.focus(); }}>Keep my history</button>
              <button disabled={busy} className={styles.primary} onClick={() => { setConfirmForget(false); heading.current?.focus(); onForget(); }}>{account ? "Delete account history" : "Delete and turn off"}</button>
            </div>
          </div>}
        </div>}
    </>}
  </section>;
}
