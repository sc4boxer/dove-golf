// src/lib/engine/scoring.ts
// Deterministic fit score calibration (v1.1)
// Goals:
// - Avoid constant 95%
// - Typical range 62–92
// - Penalize missing/unknown info
// - Still allow rare 95% only for high-confidence + strong alignment

export type ScoreInputs = {
  // How well the recommended profile matches the user's needs (0..1)
  alignment: number;

  // How confident we are in the inputs (0..1)
  confidence: number;

  // How much mismatch risk remains (0..1) (e.g., dispersion both sides, all_over strike)
  volatility: number;

  // How many "unknown" or "dont_know" fields did we see
  unknownCount: number;

  // Category can influence typical score distribution slightly
  category: "driver" | "woods" | "irons";

  // Optional: if we derived this category from another (e.g., woods from driver)
  derivedFrom?: "driver";
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function roundInt(n: number) {
  return Math.round(n);
}

/**
 * Convert components into a calibrated % score.
 */
export function computeFitScore(s: ScoreInputs): number {
  const alignment = clamp(s.alignment, 0, 1);
  const confidence = clamp(s.confidence, 0, 1);
  const volatility = clamp(s.volatility, 0, 1);

  // Base score by category (irons often feel "harder" to nail than driver)
  const base =
    s.category === "driver" ? 74 :
    s.category === "woods" ? 72 :
    70; // irons

  // Alignment carries most weight
  // (0..1) -> +/- ~18 points
  const alignBoost = (alignment - 0.5) * 36;

  // Confidence: +/- ~10 points
  const confBoost = (confidence - 0.5) * 20;

  // Volatility: subtract up to ~10 points
  const volatilityPenalty = volatility * 10;

  // Unknown penalty: each unknown knocks off ~2–3 points, capped
  const unknownPenalty = clamp(s.unknownCount * 2.5, 0, 14);

  // Derived woods should not mirror driver exactly; small systematic penalty
  const derivedPenalty = s.derivedFrom ? 3 : 0;

  let raw = base + alignBoost + confBoost - volatilityPenalty - unknownPenalty - derivedPenalty;

  // Clamp to realistic range
  // - Floor prevents absurdly low scores for v1
  // - Ceiling keeps 95 rare
  raw = clamp(raw, 55, 94);

  // Allow rare 95 only for high-confidence + high alignment + low unknowns/volatility
  const qualifiesFor95 =
    alignment >= 0.88 &&
    confidence >= 0.85 &&
    volatility <= 0.25 &&
    s.unknownCount <= 1 &&
    !s.derivedFrom; // never give 95 to derived woods

  const finalScore = qualifiesFor95 ? 95 : roundInt(raw);

  // Never show 0/odd values; keep clean
  return clamp(finalScore, 55, 95);
}

/**
 * Helper to compute confidence from "unknown" states.
 * Provide number of unknown fields you found and total relevant fields.
 */
export function confidenceFromUnknowns(unknownCount: number, totalFields: number) {
  if (totalFields <= 0) return 0.6;
  const knownRatio = clamp(1 - unknownCount / totalFields, 0, 1);
  // Bias a bit optimistic for v1, but still penalize unknowns
  return clamp(0.45 + knownRatio * 0.55, 0.45, 0.98);
}

/**
 * Helper: convert a "both sides / all over strike" style uncertainty into volatility (0..1).
 */
export function volatilityFromFlags(flags: {
  bothSides?: boolean;
  allOverStrike?: boolean;
  unsureTempo?: boolean;
  unsureMiss?: boolean;
}) {
  let v = 0;

  if (flags.bothSides) v += 0.45;
  if (flags.allOverStrike) v += 0.35;
  if (flags.unsureTempo) v += 0.15;
  if (flags.unsureMiss) v += 0.15;

  return clamp(v, 0, 1);
}