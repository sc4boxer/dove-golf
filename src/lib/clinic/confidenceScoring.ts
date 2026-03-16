import { resolvePattern } from "@/lib/clinic/ballFlightEngine";
import { CurveSeverity, StartDirection } from "@/lib/clinic/ballFlightPatterns";
import { CAUSE_LIBRARY, ConfidenceLabel } from "@/lib/clinic/causeLibrary";
import { BALL_CURVES_RIGHT_VARIANTS } from "@/lib/clinic/causeMapping";

export type TestFeedback = Partial<Record<"grip" | "face" | "path" | "strike", "better" | "same" | "worse">>;

export type CauseScore = {
  causeId: string;
  score: number;
  label: ConfidenceLabel;
};

export function rankBallCurvesRightCauses(input: {
  variantId: string;
  startDirection: StartDirection;
  curveSeverity: CurveSeverity;
  testFeedback?: TestFeedback;
}): CauseScore[] {
  const variant = BALL_CURVES_RIGHT_VARIANTS.find((entry) => entry.id === input.variantId);
  if (!variant) return [];

  const pattern = resolvePattern({
    startDirection: input.startDirection,
    curveDirection: "right",
    curveSeverity: input.curveSeverity,
  });

  const ranked = variant.candidateCauseIds
    .map((causeId) => {
      const cause = CAUSE_LIBRARY[causeId];
      if (!cause) return null;

      const pairKey = `${input.startDirection}-${input.curveSeverity}` as const;
      const startAnyKey = `${input.startDirection}-any` as const;
      const centerAnyKey = "center-any" as const;
      const baseRuleWeight =
        cause.confidenceRules[pairKey] ??
        cause.confidenceRules[startAnyKey] ??
        cause.confidenceRules[centerAnyKey] ??
        8;

      const patternBonus = pattern && cause.relatedShotPatterns.includes(pattern.id) ? 8 : 0;
      const feedbackBonus = scoreFeedback(causeId, input.testFeedback);
      const score = Math.max(0, baseRuleWeight + patternBonus + feedbackBonus);

      return {
        causeId,
        score,
        label: toConfidenceLabel(score),
      };
    })
    .filter((entry): entry is CauseScore => Boolean(entry))
    .sort((a, b) => b.score - a.score);

  return ranked;
}

function toConfidenceLabel(score: number): ConfidenceLabel {
  if (score >= 30) return "very-likely";
  if (score >= 18) return "likely";
  return "possible";
}

function scoreFeedback(causeId: string, testFeedback?: TestFeedback): number {
  if (!testFeedback) return 0;

  const feedbackMap: Record<string, number> = {
    openClubface: testFeedback.face === "better" ? 10 : 0,
    acrossPath: testFeedback.path === "better" ? 10 : 0,
    weakGrip: testFeedback.grip === "better" ? 10 : 0,
    glancingStrike: testFeedback.strike === "better" ? 10 : 0,
  };

  return feedbackMap[causeId] ?? 0;
}
