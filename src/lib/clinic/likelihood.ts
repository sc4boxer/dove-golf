import { LikelihoodBucketKey, LikelihoodSplit } from "@/lib/clinic/types";

export const EMPTY_SPLIT: LikelihoodSplit = {
  faceControl: 0,
  pathDirection: 0,
  strikeGearEffect: 0,
  setupAlignment: 0,
  equipmentContribution: 0,
};

export function normalizeSplit(raw: LikelihoodSplit): LikelihoodSplit {
  const nonNegativeEntries = Object.entries(raw).map(([k, v]) => [k, Math.max(0, v)] as const);
  const total = nonNegativeEntries.reduce((sum, [, value]) => sum + value, 0);

  if (total <= 0) {
    return {
      faceControl: 20,
      pathDirection: 20,
      strikeGearEffect: 20,
      setupAlignment: 20,
      equipmentContribution: 20,
    };
  }

  const rounded = Object.fromEntries(
    nonNegativeEntries.map(([k, value]) => [k, Math.round((value / total) * 100)])
  ) as LikelihoodSplit;

  const sum = Object.values(rounded).reduce((acc, value) => acc + value, 0);
  if (sum === 100) return rounded;

  const adjustment = 100 - sum;
  const key = (Object.keys(rounded) as LikelihoodBucketKey[]).sort(
    (a, b) => rounded[b] - rounded[a]
  )[0];
  rounded[key] = rounded[key] + adjustment;
  return rounded;
}

export function topBucket(split: LikelihoodSplit): LikelihoodBucketKey {
  return (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a])[0];
}
