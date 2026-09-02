"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import styles from "./ConsentManager.module.css";

const STORAGE_KEY = "dove_golf_privacy_choice_v1";
const CHOICE_EVENT = "dove-golf-privacy-choice";
type PrivacyChoice = "essential" | "analytics";

function readChoice(): PrivacyChoice | null {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "essential" || saved === "analytics" ? saved : null;
}

function subscribeToChoice(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHOICE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHOICE_EVENT, onChange);
  };
}

export function ConsentManager({ measurementId }: { measurementId?: string }) {
  const choice = useSyncExternalStore(subscribeToChoice, readChoice, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function saveChoice(nextChoice: PrivacyChoice) {
    window.localStorage.setItem(STORAGE_KEY, nextChoice);
    window.dispatchEvent(new Event(CHOICE_EVENT));
    setSettingsOpen(false);
  }

  const showBanner = choice === null || settingsOpen;

  return (
    <>
      {choice === "analytics" && <GoogleAnalytics measurementId={measurementId} />}

      {showBanner ? (
        <section className={styles.banner} aria-labelledby="privacy-choice-title">
          <div>
            <p className={styles.eyebrow}>Your privacy</p>
            <h2 id="privacy-choice-title">Help improve Dove Golf?</h2>
            <p>
              Optional analytics show us which tools help. Essential storage only remembers this choice.
              We do not use advertising cookies. <Link href="/privacy">Learn more</Link>
            </p>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => saveChoice("essential")}>Essential only</button>
            <button type="button" className={styles.primary} onClick={() => saveChoice("analytics")}>Allow analytics</button>
          </div>
        </section>
      ) : (
        <button type="button" className={styles.reopen} onClick={() => setSettingsOpen(true)}>Privacy choices</button>
      )}
    </>
  );
}
