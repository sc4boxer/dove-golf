import { BALL_FLIGHT_PATTERNS, type PatternSlug, type Strike, type Tempo, type TypicalMiss } from "@/lib/learn/ballFlightPatterns";

export type ConfidenceLabel = "Low" | "Moderate" | "High";

export function scoreConfidence(args: {
  pattern: PatternSlug;
  tempo?: Tempo;
  strike?: Strike;
  miss?: TypicalMiss;
}): {
  score: number;
  label: ConfidenceLabel;
  reasons: string[];
  gaps: string[];
} {
  const { pattern } = args;
  const tempo = args.tempo ?? "unsure";
  const strike = args.strike ?? "unsure";
  const miss = args.miss ?? "unsure";

  const curve = BALL_FLIGHT_PATTERNS[pattern].curve;
  let score = 55;
  const reasons: string[] = [];
  const gaps: string[] = [];

  if (curve === "fade") {
    if (tempo === "quick") {
      score += 10;
      reasons.push("Quick tempo often correlates with delayed face closure.");
    }
    if (tempo === "smooth") score -= 2;
    if (tempo === "neutral") score += 4;
  }

  if (curve === "draw") {
    if (tempo === "quick") {
      score += 6;
      reasons.push("Quick tempo can reinforce closure-dominant draw patterns.");
    }
    if (tempo === "neutral") score += 3;
  }

  if (curve === "straight") {
    if (tempo === "neutral") {
      score += 5;
      reasons.push("Neutral tempo supports repeatable timing and straighter face-to-path delivery.");
    }
    if (tempo === "quick" || tempo === "smooth") score += 2;
  }

  if (curve === "fade") {
    if (strike === "heel") {
      score += 12;
      reasons.push("Heel strike supports fade via gear effect.");
    }
    if (strike === "toe") score -= 4;
    if (strike === "center") score += 4;
  }

  if (curve === "draw") {
    if (strike === "toe") {
      score += 12;
      reasons.push("Toe strike supports draw curvature via gear effect.");
    }
    if (strike === "heel") score -= 4;
    if (strike === "center") score += 4;
  }

  if (curve === "straight") {
    if (strike === "center") {
      score += 8;
      reasons.push("Centered strike reduces gear-effect curvature and supports straight flight.");
    }
  }

  if (curve === "fade") {
    if (miss === "right" || miss === "high_right") {
      score += 15;
      reasons.push("Typical miss right aligns with open face-to-path patterns.");
    }
    if (miss === "low_right") score += 12;
    if (miss === "both_sides") score -= 8;
  }

  if (curve === "draw") {
    if (miss === "left" || miss === "high_left") {
      score += 15;
      reasons.push("Typical miss left aligns with closure-dominant draw patterns.");
    }
    if (miss === "low_left") score += 12;
    if (miss === "both_sides") score -= 8;
  }

  if (curve === "straight" && miss === "both_sides") score -= 5;

  if (curve === "fade" && strike === "toe") score -= 6;
  if (curve === "draw" && strike === "heel") score -= 6;
  if (miss === "both_sides") score -= 6;

  if (strike === "unsure") {
    gaps.push("Strike location unknown — confirm heel/toe/center for higher confidence.");
  }
  if (tempo === "unsure") {
    gaps.push("Tempo unknown — transition speed helps separate timing vs path causes.");
  }
  if (miss === "unsure") {
    gaps.push("Typical miss unknown — miss direction improves confidence calibration.");
  }

  if (reasons.length < 2) {
    reasons.push("Face-to-path geometry remains the primary constraint for this selected pattern.");
  }
  if (reasons.length < 2) {
    reasons.push("Additional observed shot clusters improve pattern confidence over single-shot outcomes.");
  }

  score = Math.max(20, Math.min(95, score));

  const label: ConfidenceLabel = score >= 75 ? "High" : score >= 55 ? "Moderate" : "Low";

  return {
    score,
    label,
    reasons: reasons.slice(0, 5),
    gaps: gaps.slice(0, 3),
  };
}
