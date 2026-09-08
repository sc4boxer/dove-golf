import type { RangeRescueClub, RangeRescuePlanId } from "@/lib/range-rescue/plans";
import styles from "./MissVisual.module.css";

export function MissVisual({ id, large = false, club = "iron" }: { id: RangeRescuePlanId; large?: boolean; club?: RangeRescueClub }) {
  if (club === "driver" && (id === "ground-first" || id === "thin-or-top")) {
    const groundFirst = id === "ground-first";
    return (
      <div className={`${styles.visual} ${large ? styles.large : ""}`} aria-hidden="true">
        <svg viewBox="0 0 96 62">
          <path className={styles.turf} d="M10 48 H86" />
          <path className={styles.teeStem} d="M62 48 V32 M57 32 Q62 36 67 32" />
          <circle className={styles.ball} cx="62" cy="26" r="6" />
          <path className={styles.club} d={groundFirst ? "M19 12 L37 39" : "M22 8 L47 23"} />
          <path className={styles.driverHead} d={groundFirst ? "M32 37 Q28 44 36 45 H45 V38 Z" : "M43 21 Q39 28 47 29 H56 V22 Z"} />
          <path className={styles.trouble} d={groundFirst ? "M28 48 q9 -7 20 0" : "M57 22 H69"} />
          {!groundFirst && <path className={styles.motion} d="M70 30 Q77 39 86 40" />}
        </svg>
        <span>{groundFirst ? "Ground before tee" : "Low off the tee"}</span>
      </div>
    );
  }
  if (id === "ground-first") {
    return (
      <div className={`${styles.visual} ${large ? styles.large : ""}`} aria-hidden="true">
        <svg viewBox="0 0 96 62">
          <path className={styles.turf} d="M10 45 H86" />
          <circle className={styles.ball} cx="67" cy="39" r="6" />
          <path className={styles.club} d="M20 13 L43 41" />
          <path className={styles.trouble} d="M34 45 q9 -8 18 0 q-9 7 -18 0" />
          <path className={styles.motion} d="M17 25 Q28 34 39 37" />
        </svg>
        <span>Ground before ball</span>
      </div>
    );
  }

  if (id === "thin-or-top") {
    return (
      <div className={`${styles.visual} ${large ? styles.large : ""}`} aria-hidden="true">
        <svg viewBox="0 0 96 62">
          <path className={styles.turf} d="M10 45 H86" />
          <circle className={styles.ball} cx="46" cy="39" r="7" />
          <path className={styles.club} d="M16 17 L39 37" />
          <path className={styles.trouble} d="M39 34 H54" />
          <path className={styles.motion} d="M52 34 Q69 29 84 32" />
        </svg>
        <span>Ball stays low or rolls</span>
      </div>
    );
  }

  const pathById: Partial<Record<RangeRescuePlanId, string>> = {
    "starts-left": "M48 54 L22 10",
    "starts-right": "M48 54 L74 10",
    "curves-left": "M48 54 C54 37 53 20 22 10",
    "curves-right": "M48 54 C42 37 43 20 74 10",
  };

  const captionById: Partial<Record<RangeRescuePlanId, string>> = {
    "starts-left": "Goes left right away",
    "starts-right": "Goes right right away",
    "curves-left": "Bends left in the air",
    "curves-right": "Bends right in the air",
  };

  if (id === "no-pattern") {
    return (
      <div className={`${styles.visual} ${large ? styles.large : ""}`} aria-hidden="true">
        <svg viewBox="0 0 96 62">
          <path className={styles.targetLine} d="M48 54 V8" />
          <path className={styles.randomPath} d="M48 54 Q31 35 19 14" />
          <path className={styles.randomPath} d="M48 54 Q63 38 78 19" />
          <path className={styles.randomPath} d="M48 54 Q47 41 55 12" />
          <circle className={styles.tee} cx="48" cy="54" r="3" />
        </svg>
        <span>Shots go everywhere</span>
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${large ? styles.large : ""}`} aria-hidden="true">
      <svg viewBox="0 0 96 62">
        <path className={styles.targetLine} d="M48 54 V8" />
        <path className={styles.flightPath} d={pathById[id]} />
        <circle className={styles.tee} cx="48" cy="54" r="3" />
        <circle className={styles.landing} cx={id.endsWith("left") ? "22" : "74"} cy="10" r="3.5" />
      </svg>
      <span>{captionById[id]}</span>
    </div>
  );
}

