// src/lib/engine/driver.ts
import { computeFitScore, confidenceFromUnknowns, volatilityFromFlags } from "./scoring";

export type DriverPrimaryFix = "slice" | "hook" | "dispersion";
export type Tempo = "smooth" | "moderate" | "aggressive";
export type Transition = "gradual" | "quick" | "unknown";
export type Strike = "heel" | "toe" | "center" | "unknown";
export type LaunchFeel = "low" | "mid" | "high";

export type RecommendDriverWoodsInput = {
  clubType: "driverWoods";
  primaryFix: DriverPrimaryFix;
  speedMph: number;
  tempo: Tempo;
  transition: Transition;
  strike: Strike;
  currentShaftWeightG?: number;
  currentFlex?: "unknown" | "R" | "S" | "X";
  launchFeel: LaunchFeel;

  // Optional fields (safe to ignore in v1)
  constraint?: "none" | "elbow" | "shoulder_back" | "prefer_lighter";
};

export type DriverWoodsProfile = {
  weightRange: string; // label
  flex: string; // label
  torqueRange: string; // label
  launchBias: "low" | "mid" | "high";
  balanceBias: "neutral" | "counterbalanced" | "head-heavy";
};

export type RecommendDriverWoodsResult = {
  fitScore: number;
  profile: DriverWoodsProfile;
  adjustmentGuide: string[];
  constraintNote: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function clamp01(n: number) {
  return clamp(n, 0, 1);
}

function pickFlex(speedMph: number): string {
  // Broad v1 bands (kept simple on purpose)
  if (speedMph < 90) return "Regular (R)";
  if (speedMph < 103) return "Regular (R) to Stiff (S)";
  if (speedMph < 112) return "Stiff (S)";
  return "X-Stiff (X)";
}

function pickWeightRange(speedMph: number, tempo: Tempo, constraint?: string): { label: string; mid: number } {
  // Base by speed
  let mid =
    speedMph < 90 ? 55 :
    speedMph < 100 ? 62 :
    speedMph < 110 ? 68 :
    74;

  // Tempo adjustments
  if (tempo === "aggressive") mid += 3;
  if (tempo === "smooth") mid -= 2;

  // Constraint adjustments
  if (constraint === "elbow" || constraint === "shoulder_back") mid -= 3;
  if (constraint === "prefer_lighter") mid -= 2;

  mid = clamp(mid, 50, 80);

  // Convert to label band
  if (mid <= 56) return { label: "50–60g", mid };
  if (mid <= 63) return { label: "55–65g", mid };
  if (mid <= 70) return { label: "60–70g", mid };
  if (mid <= 76) return { label: "65–75g", mid };
  return { label: "70–80g", mid };
}

function pickTorqueRange(primaryFix: DriverPrimaryFix, tempo: Tempo): string {
  // Keep labels simple; torque depends on feel + stability needs.
  if (primaryFix === "hook") return "2.8–3.3° (lower torque)";
  if (primaryFix === "slice") {
    if (tempo === "aggressive") return "3.0–3.6° (mid torque)";
    return "3.3–4.2° (mid-high torque)";
  }
  // dispersion
  if (tempo === "aggressive") return "2.8–3.6° (mid-low torque)";
  return "3.0–4.0° (mid torque)";
}

function pickLaunchBias(launchFeel: LaunchFeel, primaryFix: DriverPrimaryFix): "low" | "mid" | "high" {
  // If they already launch high, bias lower; if low, bias higher.
  // PrimaryFix also nudges (hooks tend to like slightly lower)
  let bias: "low" | "mid" | "high" = "mid";
  if (launchFeel === "low") bias = "high";
  if (launchFeel === "high") bias = "low";

  if (primaryFix === "hook" && bias !== "low") bias = "mid";
  return bias;
}

function pickBalanceBias(tempo: Tempo, primaryFix: DriverPrimaryFix): "neutral" | "counterbalanced" | "head-heavy" {
  // Counterbalanced helps some aggressive transitions; head-heavy can help some slicers feel head/close face.
  if (tempo === "aggressive") return "counterbalanced";
  if (primaryFix === "slice") return "neutral";
  return "neutral";
}

function constraintNote(constraint?: RecommendDriverWoodsInput["constraint"]) {
  if (constraint === "elbow") return "Note: If elbow pain persists, consider slightly lighter total weight and softer-feel profiles.";
  if (constraint === "shoulder_back") return "Note: If shoulder/back issues, avoid overly heavy builds; prioritize smooth load.";
  if (constraint === "prefer_lighter") return "Note: You prefer lighter feel — we biased weight slightly down.";
  return "";
}

function buildAdjustmentGuide(primaryFix: DriverPrimaryFix, launchFeel: LaunchFeel, strike: Strike): string[] {
  const guide: string[] = [];

  // Start settings baseline
  guide.push("Start: loft at the stated loft, face neutral, weight neutral (if adjustable).");

  if (primaryFix === "slice") {
    guide.push("If you slice: avoid fade setting; keep face neutral (or slightly closed only if needed).");
    guide.push("Move adjustable weight slightly toward heel (small changes, 1 notch at a time).");
    guide.push("Tee height: slightly higher; focus on center-face contact (heel strikes often exaggerate slice).");
  }

  if (primaryFix === "hook") {
    guide.push("If you hook: avoid draw setting; keep face neutral (or slightly open if needed).");
    guide.push("Move adjustable weight slightly toward toe to reduce left bias.");
    guide.push("Ball position: don’t let it creep too far forward (can increase face closure timing).");
  }

  if (primaryFix === "dispersion") {
    guide.push("If both sides: keep settings neutral first; prioritize repeatable strike before chasing curvature.");
    guide.push("Use loft adjustments only after strike location stabilizes.");
  }

  // Launch guidance
  if (launchFeel === "low") guide.push("Low flight: test +1° loft before changing shaft. Keep face neutral.");
  if (launchFeel === "high") guide.push("High flight: test -1° loft (or a lower-spin head setting) before changing shaft.");

  // Strike-specific note
  if (strike === "heel") guide.push("Heel strike bias: try slightly shorter tee height and focus on strike; heel hits can add gear-effect slice.");
  if (strike === "toe") guide.push("Toe strike bias: ensure you’re not too far from the ball; toe hits can increase draw/hook via gear effect.");
  if (strike === "unknown") guide.push("If strike is inconsistent: prioritize strike feedback (impact tape/foot spray) for faster improvement.");

  return guide;
}

function computeAlignment(params: {
  primaryFix: DriverPrimaryFix;
  tempo: Tempo;
  launchFeel: LaunchFeel;
  recommendedLaunch: "low" | "mid" | "high";
  recommendedWeightMid: number;
  currentShaftWeightG?: number;
}): number {
  let a = 0.72; // strong baseline; we’ll move it up/down

  // Weight closeness boosts alignment
  if (typeof params.currentShaftWeightG === "number") {
    const diff = Math.abs(params.currentShaftWeightG - params.recommendedWeightMid);
    if (diff <= 6) a += 0.12;
    else if (diff <= 10) a += 0.06;
    else if (diff >= 18) a -= 0.10;
    else a -= 0.04;
  } else {
    a -= 0.05; // missing anchor
  }

  // Launch need matching
  // If user feels low and we recommend high -> good. If user high and we recommend low -> good.
  if (params.launchFeel === "low" && params.recommendedLaunch === "high") a += 0.08;
  if (params.launchFeel === "high" && params.recommendedLaunch === "low") a += 0.08;

  // If we recommend opposite direction incorrectly, small penalty
  if (params.launchFeel === "low" && params.recommendedLaunch === "low") a -= 0.04;
  if (params.launchFeel === "high" && params.recommendedLaunch === "high") a -= 0.04;

  // Tempo + primary fix congruence (stability needs)
  if (params.tempo === "aggressive" && (params.primaryFix === "slice" || params.primaryFix === "dispersion")) a += 0.05;
  if (params.tempo === "smooth" && params.primaryFix === "hook") a -= 0.02;

  return clamp01(a);
}

export function recommendDriverWoods(input: RecommendDriverWoodsInput): RecommendDriverWoodsResult {
  const speed = clamp(input.speedMph, 70, 130);

  const { label: weightRange, mid: weightMid } = pickWeightRange(speed, input.tempo, input.constraint);
  const flex = pickFlex(speed);
  const torqueRange = pickTorqueRange(input.primaryFix, input.tempo);
  const launchBias = pickLaunchBias(input.launchFeel, input.primaryFix);
  const balanceBias = pickBalanceBias(input.tempo, input.primaryFix);

  const unknownCount =
    (input.strike === "unknown" ? 1 : 0) +
    (input.transition === "unknown" ? 1 : 0) +
    (input.tempo ? 0 : 1) +
    (typeof input.currentShaftWeightG !== "number" ? 1 : 0);

  const confidence = confidenceFromUnknowns(unknownCount, 4);

  const volatility = volatilityFromFlags({
    bothSides: input.primaryFix === "dispersion",
    allOverStrike: input.strike === "unknown",
    unsureTempo: input.tempo === "moderate", // mild; moderate often means "not sure"
  });

  const alignment = computeAlignment({
    primaryFix: input.primaryFix,
    tempo: input.tempo,
    launchFeel: input.launchFeel,
    recommendedLaunch: launchBias,
    recommendedWeightMid: weightMid,
    currentShaftWeightG: input.currentShaftWeightG,
  });

  const fitScore = computeFitScore({
    category: "driver",
    alignment,
    confidence,
    volatility,
    unknownCount,
  });

  return {
    fitScore,
    profile: {
      weightRange,
      flex,
      torqueRange,
      launchBias,
      balanceBias,
    },
    adjustmentGuide: buildAdjustmentGuide(input.primaryFix, input.launchFeel, input.strike),
    constraintNote: constraintNote(input.constraint),
  };
}
