"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@/lib/analytics/ga";
import type { RangeRescuePlanId } from "@/lib/range-rescue/plans";
import styles from "./ProductFeedback.module.css";

const EXPERIENCE_OPTIONS = [
  ["", "Choose one (optional)"],
  ["prefer-not-to-say", "Prefer not to say"],
  ["just-starting", "I’m just starting"],
  ["under-one-year", "Less than a year"],
  ["one-to-three-years", "1–3 years"],
  ["more-than-three-years", "More than 3 years"],
] as const;

const NEXT_HELP_OPTIONS = [
  ["", "Choose one (optional)"],
  ["better-contact", "Making better contact"],
  ["start-direction", "Where the ball starts"],
  ["curve-control", "Why the ball curves"],
  ["distance", "Distance and launch"],
  ["equipment", "Equipment choices"],
  ["practice-plan", "What to practice next"],
] as const;

type Helpful = "yes" | "no";
type Status = "idle" | "sending" | "sent" | "error";

export function ProductFeedback({ planId }: { planId: RangeRescuePlanId }) {
  const [helpful, setHelpful] = useState<Helpful | null>(null);
  const [experience, setExperience] = useState("");
  const [nextHelp, setNextHelp] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!helpful || status === "sending") return;

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "range-rescue",
          planId,
          helpful: helpful === "yes",
          experience: experience || undefined,
          nextHelp: nextHelp || undefined,
          comment: comment || undefined,
          website: "",
        }),
      });
      const payload = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to send feedback.");

      track("dov_product_feedback_submitted", {
        module: "range_rescue",
        plan_id: planId,
        helpful: helpful === "yes",
        experience: experience || "not_provided",
        next_help: nextHelp || "not_provided",
      });
      setStatus("sent");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to send feedback.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <section className={styles.panel} aria-live="polite">
        <p className={styles.eyebrow}>Feedback received</p>
        <h2>Thank you. That helps shape what comes next.</h2>
        <p className={styles.sentCopy}>No account or contact details were attached to your response.</p>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="product-feedback-heading">
      <p className={styles.eyebrow}>Help us make this clearer</p>
      <h2 id="product-feedback-heading">Did this make your next shot feel simpler?</h2>
      <p className={styles.intro}>One anonymous answer helps us decide what to improve and build next.</p>

      <form onSubmit={submitFeedback}>
        <fieldset className={styles.helpfulChoices}>
          <legend className="sr-only">Was this Range Rescue guidance helpful?</legend>
          <label className={helpful === "yes" ? styles.selectedChoice : styles.choice}>
            <input type="radio" name="helpful" value="yes" checked={helpful === "yes"} onChange={() => setHelpful("yes")} />
            Yes, it helped
          </label>
          <label className={helpful === "no" ? styles.selectedChoice : styles.choice}>
            <input type="radio" name="helpful" value="no" checked={helpful === "no"} onChange={() => setHelpful("no")} />
            Not yet
          </label>
        </fieldset>

        {helpful && (
          <div className={styles.optionalFields}>
            <div className={styles.fieldGrid}>
              <label>
                <span>How long have you played?</span>
                <select value={experience} onChange={(event) => setExperience(event.target.value)}>
                  {EXPERIENCE_OPTIONS.map(([value, label]) => <option value={value} key={label}>{label}</option>)}
                </select>
              </label>
              <label>
                <span>What should we help with next?</span>
                <select value={nextHelp} onChange={(event) => setNextHelp(event.target.value)}>
                  {NEXT_HELP_OPTIONS.map(([value, label]) => <option value={value} key={label}>{label}</option>)}
                </select>
              </label>
            </div>

            <label className={styles.commentField}>
              <span>What was clear—or still confusing? <em>Optional</em></span>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value.slice(0, 500))}
                rows={3}
                maxLength={500}
                placeholder="A sentence is plenty."
              />
              <small>{comment.length}/500 · Please don’t include your name, email, or other personal details.</small>
            </label>

            <div className={styles.submitRow}>
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send anonymous feedback"}
              </button>
              <p>We store only these answers for product research. <Link href="/privacy">Privacy</Link></p>
            </div>
            {status === "error" && <p className={styles.error} role="alert">{error} You can also <a href="mailto:sc4boxer@gmail.com?subject=Dove%20Golf%20Feedback">email Joshua</a>.</p>}
          </div>
        )}
      </form>
    </section>
  );
}
