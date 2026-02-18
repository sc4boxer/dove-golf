// src/lib/engine/irons.ts
import { computeFitScore, confidenceFromUnknowns, volatilityFromFlags } from "./scoring";

export type IronPrimaryFix = "dispersion" | "distanceLoss";
export type Tempo = "smooth" | "moderate" | "aggressive";
export type Transition = "gradual" | "quick" | "unknown";
export type Strike = "thin" | "fat" | "center" | "unknown";
export type PeakHeightFeel = "low" | "mid" | "high";
export type Fatigue = "none" | "some" | "aLot" | "unknown";

export type RecommendIronsInput = {
  clubType: "irons";
  primaryFix: IronPrimaryFix;
  sixIronSpeedMph: number;
  tempo: Tempo;
  transition: Transition;
  strike: Strike;
  fatigue: Fatigue;
  currentShaftWeightG?: number;
  currentFlex?: "unknown" | "R" | "S" | "X";
  peakHeightFeel: PeakHeightFeel;

  // Optional fields (safe)
  constraint?: "none" | "elbow" | "shoulder_back" | "prefer_lighter";
};

export type IronsProfile = {
  weightRange: string;
  flex: string;
  launchBias: "low" | "mid" | "high";
  balanceBias: "neutral" | "counterbalanced" | "head-heavy";
  materialBias: "steel" | "graphite" | "either";
  headBias: string;
};

export type RecommendIronsResult = {
  fitScore: number;
  profile: IronsProfile;
  constraintNote: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
function clamp01(n: number) {
  return clamp(n, 0, 1);
}

function pickIronFlex(sixIronSpeed: number): string {
  // Very broad, v1-friendly. You can refine later.
  if (sixIronSpeed < 75) return "Regular (R)";
  if (sixIronSpeed < 86) return "Regular (R) to Stiff (S)";
  if (sixIronSpeed < 94) return "Stiff (S)";
  return "X-Stiff (X)";
}

function pickIronWeightRange(params: {
  sixIronSpeed: number;
  tempo: Tempo;
  fatigue: Fatigue;
  constraint?: string;
}): { label: string; mid: number } {
  const s = params.sixIronSpeed;

  // Base by speed
  let mid =
    s < 75 ? 90 :
    s < 85 ? 100 :
    s < 93 ? 110 :
    120;

  // Tempo
  if (params.tempo === "aggressive") mid += 5;
  if (params.tempo === "smooth") mid -= 3;

  // Fatigue matters more for irons
  if (params.fatigue === "some") mid -= 5;
  if (params.fatigue === "aLot") mid -= 10;

  // Constraints
  if (params.constraint === "elbow" || params.constraint === "shoulder_back") mid -= 8;
  if (params.constraint === "prefer_lighter") mid -= 5;

  mid = clamp(mid, 80, 130);

  if (mid <= 92) return { label: "85–95g", mid };
  if (mid <= 104) return { label: "95–105g", mid };
  if (mid <= 118) return { label: "105–120g", mid };
  return { label: "120g+", mid };
}

function pickMaterialBias(fatigue: Fatigue, constraint?: string): "steel" | "graphite" | "either" {
  if (constraint === "elbow") return "graphite";
  if (constraint === "shoulder_back") return "graphite";
  if (fatigue === "aLot") return "graphite";
  if (fatigue === "some") return "either";
  return "steel";
}

function pickLaunchBias(peak: PeakHeightFeel, primaryFix: IronPrimaryFix, strike: Strike): "low" | "mid" | "high" {
  // Peak height is a strong signal for irons
  let bias: "low" | "mid" | "high" = "mid";
  if (peak === "low") bias = "high";
  if (peak === "high") bias = "low";

  // Distance loss often benefits from a bit more launch/help
  if (primaryFix === "distanceLoss" && bias === "mid") bias = "high";

  // Thin strikes often need more launch/help; fat sometimes needs slightly lower/spin control
  if (strike === "thin" && bias !== "high") bias = "high";
  if (strike === "fat" && bias === "high") bias = "mid";

  return bias;
}

function pickHeadBias(strike: Strike, primaryFix: IronPrimaryFix): string {
  // Simple v1 categories; you can map to GI/Players Distance later.
  if (strike === "unknown") return "Forgiving (mid-high MOI) to stabilize strike variation";
  if (strike === "thin") return "More forgiving sole/launch help (helps thin contact and carry)";
  if (strike === "fat") return "Sole interaction help (wider sole / more bounce tolerance)";
  if (primaryFix === "distanceLoss") return "Distance-friendly / launch-friendly iron category";
  return "Neutral players-cavity bias";
}

function constraintNote(constraint?: RecommendIronsInput["constraint"]) {
  if (constraint === "elbow") return "Note: For elbow comfort, consider graphite or vibration-damping builds (and avoid overly harsh, heavy shafts).";
  if (constraint === "shoulder_back") return "Note: For shoulder/back, avoid overly heavy total builds; prioritize smoother load.";
  if (constraint === "prefer_lighter") return "Note: You prefer lighter feel — we biased iron weight downward.";
  return "";
}

function computeAlignment(params: {
  primaryFix: IronPrimaryFix;
  peak: PeakHeightFeel;
  strike: Strike;
  fatigue: Fatigue;
  recommendedLaunch: "low" | "mid" | "high";
  recommendedWeightMid: number;
  currentShaftWeightG?: number;
}): number {
  let a = 0.70;

  // Weight closeness is meaningful, but less predictive than driver because head/loft differences exist.
  if (typeof params.currentShaftWeightG === "number") {
    const diff = Math.abs(params.currentShaftWeightG - params.recommendedWeightMid);
    if (diff <= 8) a += 0.10;
    else if (diff <= 14) a += 0.05;
    else if (diff >= 22) a -= 0.10;
    else a -= 0.04;
  } else {
    a -= 0.05;
  }

  // Peak height needs matching
  if (params.peak === "low" && params.recommendedLaunch === "high") a += 0.10;
  if (params.peak === "high" && params.recommendedLaunch === "low") a += 0.10;

  if (params.peak === "low" && params.recommendedLaunch === "low") a -= 0.05;
  if (params.peak === "high" && params.recommendedLaunch === "high") a -= 0.05;

  // Strike patterns: thin + high launch recommendation aligns
  if (params.strike === "thin" && params.recommendedLaunch === "high") a += 0.05;
  if (params.strike === "fat" && params.recommendedLaunch === "high") a -= 0.02;

  // Fatigue: if fatigue is high, lighter/more forgiving direction is “aligned”
  if (params.fatigue === "aLot") a += 0.03;

  // Distance loss: higher launch tends to align
  if (params.primaryFix === "distanceLoss" && params.recommendedLaunch === "high") a += 0.05;

  return clamp01(a);
}

export function recommendIrons(input: RecommendIronsInput): RecommendIronsResult {
  const speed6 = clamp(input.sixIronSpeedMph, 60, 110);

  const { label: weightRange, mid: weightMid } = pickIronWeightRange({
    sixIronSpeed: speed6,
    tempo: input.tempo,
    fatigue: input.fatigue,
    constraint: input.constraint,
  });

  const flex = pickIronFlex(speed6);

  const launchBias = pickLaunchBias(input.peakHeightFeel, input.primaryFix, input.strike);
  const balanceBias: IronsProfile["balanceBias"] = "neutral";

  const materialBias = pickMaterialBias(input.fatigue, input.constraint);
  const headBias = pickHeadBias(input.strike, input.primaryFix);

  const unknownCount =
    (input.strike === "unknown" ? 1 : 0) +
    (input.transition === "unknown" ? 1 : 0) +
    (input.fatigue === "unknown" ? 1 : 0) +
    (typeof input.currentShaftWeightG !== "number" ? 1 : 0);

  const confidence = confidenceFromUnknowns(unknownCount, 4);

  const volatility = volatilityFromFlags({
    bothSides: input.primaryFix === "dispersion",
    allOverStrike: input.strike === "unknown",
    unsureTempo: input.tempo === "moderate",
  });

  const alignment = computeAlignment({
    primaryFix: input.primaryFix,
    peak: input.peakHeightFeel,
    strike: input.strike,
    fatigue: input.fatigue,
    recommendedLaunch: launchBias,
    recommendedWeightMid: weightMid,
    currentShaftWeightG: input.currentShaftWeightG,
  });

  const fitScore = computeFitScore({
    category: "irons",
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
      launchBias,
      balanceBias,
      materialBias,
      headBias,
    },
    constraintNote: constraintNote(input.constraint),
  };
}