import { EMPTY_SPLIT, normalizeSplit, topBucket } from "@/lib/clinic/likelihood";
import {
  BUCKET_LABELS,
  ClinicRangeTest,
  ClinicResult,
  HighSpinBalloonInputs,
  LikelihoodBucketKey,
  LikelihoodSplit,
} from "@/lib/clinic/types";

const BASE_WEIGHTS: LikelihoodSplit = {
  ...EMPTY_SPLIT,
  faceControl: 25,
  pathDirection: 19,
  strikeGearEffect: 23,
  setupAlignment: 20,
  equipmentContribution: 13,
};

function add(score: LikelihoodSplit, bucket: LikelihoodBucketKey, amount: number) {
  score[bucket] += amount;
}

const rangePlan: ClinicRangeTest[] = [
  {
    id: "balloon-flighted-punch",
    title: "Flighted punch A/B (same club)",
    whatToDo: "Hit 4 normal shots then 4 flighted punch shots with same iron. Keep tempo stable and compare peak height + carry.",
    expectedIfCause: "If dynamic loft is primary, punch set launches flatter with stronger carry and less ballooning.",
    ifNoChange: "If flight stays weak/high, prioritize contact pattern and setup checks.",
    targets: ["faceControl", "setupAlignment"],
    visualAid: {
      title: "Balloon vs flighted arcs",
      lanes: ["Target line", "Balloon arc", "Flighted arc"],
      markers: ["Target line stays constant", "High weak arc climbs then stalls", "Flighted arc stays lower and penetrates"],
      hint: "Same club, same target. Only delivery changes.",
    },
  },
  {
    id: "balloon-contact-check",
    title: "Contact check (face tape/spray)",
    whatToDo: "Spray the face and hit 6 balls. Aim for center-face cluster and note height/curve changes.",
    expectedIfCause: "If low-face/inconsistent contact drives spin, centered strikes reduce floaty flight immediately.",
    ifNoChange: "If centered strikes still balloon, dynamic loft or setup is likely stronger than contact.",
    targets: ["strikeGearEffect", "faceControl"],
    visualAid: {
      title: "Center-face goal",
      lanes: ["Low-face", "Center-face", "Flight"],
      markers: ["Low-face marks add weak spinny launch", "Center-face clusters tighten launch", "Track carry and peak height together"],
      hint: "Do not judge one shot; judge the strike cluster.",
    },
  },
  {
    id: "balloon-handle-forward-ab",
    title: "Handle-forward rehearsal A/B",
    whatToDo: "Alternate 3 normal swings and 3 swings with hands slightly ahead at impact rehearsal. Compare start line and trajectory.",
    expectedIfCause: "If excess dynamic loft is cause, handle-forward reps fly flatter and hold line better.",
    ifNoChange: "If no trajectory change, check ball position forward bias and transition steepness.",
    targets: ["faceControl", "setupAlignment"],
    visualAid: {
      title: "Hands behind vs ahead",
      lanes: ["Hands behind", "Hands ahead", "Ball flight"],
      markers: ["Behind = more loft/float", "Ahead = reduced dynamic loft", "Compare peak height and carry"],
      hint: "Small handle changes are enough—do not force a big shaft lean.",
    },
  },
];

const causeMap: Record<LikelihoodBucketKey, string> = {
  faceControl: "Dynamic loft is too high at impact (hands trailing / adding loft).",
  pathDirection: "Steep delivery pattern is adding spinny launch conditions.",
  strikeGearEffect: "Low-face or inconsistent contact is creating high-spin, weak flight.",
  setupAlignment: "Ball/handle setup is pre-biasing high-launch weak strike.",
  equipmentContribution: "Current loft/shaft/spin profile may amplify a high-spin delivery.",
};

export type HighSpinBalloonEvaluation = ClinicResult & {
  primaryCause: string;
  secondaryCause?: string;
  checksNext: string[];
  equipmentLevers: string[];
};

export function evaluateHighSpinBalloon(inputs: HighSpinBalloonInputs): HighSpinBalloonEvaluation {
  const score: LikelihoodSplit = { ...BASE_WEIGHTS };

  if (inputs.flightPattern === "both") add(score, "faceControl", 12);
  if (inputs.divotClue === "steep") add(score, "pathDirection", 10);
  if (inputs.dynamicLoft === "handsBehind") add(score, "faceControl", 14);
  if (inputs.contactPattern === "lowFace") add(score, "strikeGearEffect", 14);
  if (inputs.setupWindow === "both") add(score, "setupAlignment", 12);
  if (inputs.setupWindow === "ballForward" || inputs.setupWindow === "handleBack") add(score, "setupAlignment", 8);
  if (inputs.tempoTransition === "quick") add(score, "pathDirection", 8);
  if (inputs.dynamicLoft === "handsBehind" && inputs.contactPattern !== "center") add(score, "faceControl", 6);

  const split = normalizeSplit(score);
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const primaryLever = topBucket(split);

  return {
    split,
    primaryLever,
    bucketExplanations: {
      faceControl: "Hands-behind dynamic loft is the cleanest predictor of high weak balloon flight.",
      pathDirection: "Steepness and transition can raise spin/launch enough to lose carry.",
      strikeGearEffect: "Low-face and mixed contact often produce high spin with poor energy transfer.",
      setupAlignment: "Forward ball and handle-back setup can pre-load excess loft.",
      equipmentContribution: "Loft/spin setup can amplify but rarely create the issue alone.",
    },
    whyLikely: "Trajectory clues plus divot, handle-delivery, and strike-map signals separate dynamic-loft causes from pure contact inconsistency.",
    rangePlan,
    primaryCause: causeMap[primaryLever],
    secondaryCause: split[ranked[1]] >= 18 ? causeMap[ranked[1]] : undefined,
    checksNext: ["Compare normal vs flighted peak height with same club.", "Record strike cluster with face spray over 6 balls.", "Film lead-wrist/handle position at impact."],
    equipmentLevers: [
      "Loft lever: test slightly lower delivered loft window.",
      "Shaft profile lever: use launch/spin profile that fits your tempo and delivery.",
      "Lie/length lever: ensure strike center is reachable without adding loft.",
    ],
  };
}

export function highSpinBalloonLeverLabel(bucket: LikelihoodBucketKey): string {
  return BUCKET_LABELS[bucket];
}
