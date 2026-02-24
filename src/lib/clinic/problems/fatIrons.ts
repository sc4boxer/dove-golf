import { EMPTY_SPLIT, normalizeSplit, topBucket } from "@/lib/clinic/likelihood";
import { BUCKET_LABELS, ClinicRangeTest, ClinicResult, FatIronsInputs, LikelihoodBucketKey, LikelihoodSplit } from "@/lib/clinic/types";

const BASE_WEIGHTS: LikelihoodSplit = {
  ...EMPTY_SPLIT,
  faceControl: 15,
  pathDirection: 26,
  strikeGearEffect: 20,
  setupAlignment: 24,
  equipmentContribution: 15,
};

function add(score: LikelihoodSplit, bucket: LikelihoodBucketKey, amount: number) {
  score[bucket] += amount;
}

const rangePlan: ClinicRangeTest[] = [
  {
    id: "fat-towel-behind",
    title: "Towel behind ball drill",
    whatToDo: "Place a towel 2–3 inches behind the ball and hit 6 irons without touching the towel.",
    expectedIfCause: "If low point behind-ball is the cause, towel misses increase and contact gets cleaner quickly.",
    ifNoChange: "If you still hit towel often, rehearse pressure-forward and ball position before changing swing speed.",
    targets: ["pathDirection", "setupAlignment"],
    visualAid: {
      title: "Towel placement",
      lanes: ["Ball", "Towel", "Target line"],
      markers: ["Ball on normal lie", "Towel directly behind ball", "Strike forward toward target"],
      hint: "Towel contact means low point stayed behind the ball.",
    },
  },
  {
    id: "fat-pressure-forward",
    title: "Pressure-forward rehearsal checkpoint",
    whatToDo: "Rehearse impact with pressure on lead foot, then hit 5 balls at 70% speed keeping pressure forward through strike.",
    expectedIfCause: "If pressure staying back is primary, strikes feel less heavy and divot shifts forward.",
    ifNoChange: "If pressure cue changes nothing, verify ball position and dynamic loft pattern next.",
    targets: ["pathDirection", "faceControl"],
    visualAid: {
      title: "Pressure map",
      lanes: ["Trail foot", "Lead foot", "Ball/low point"],
      markers: ["Trail heel lighter into impact", "Lead side supports strike", "Low point moves ahead of ball"],
      hint: "Think chest and pressure moving together toward target.",
    },
  },
  {
    id: "fat-divot-start",
    title: "Divot-start checkpoint (line/spray)",
    whatToDo: "Use turf line or foot spray and hit 6 balls. Verify divot starts after the ball, not before.",
    expectedIfCause: "If setup/low-point was the issue, divot start moves just ahead of the ball and heavy shots reduce.",
    ifNoChange: "If divot still starts behind ball, revisit tempo and transition sequencing.",
    targets: ["setupAlignment", "strikeGearEffect"],
    visualAid: {
      title: "Divot start truth",
      lanes: ["Reference line", "Ball", "Divot start"],
      markers: ["Draw line perpendicular to target", "Ball slightly ahead of line", "Divot begins forward of ball"],
      hint: "Divot location is the objective checkpoint for fat-contact fixes.",
    },
  },
];

const causeMap: Record<LikelihoodBucketKey, string> = {
  faceControl: "Flipping / adding loft through impact is raising bottom-out before the ball.",
  pathDirection: "Low point is behind the ball from pressure and arc delivery.",
  strikeGearEffect: "Ground-first contact pattern dominates strike quality.",
  setupAlignment: "Ball position/setup is too forward for your current low-point control.",
  equipmentContribution: "Sole/bounce/lie interaction may amplify heavy contact on soft turf.",
};

export type FatIronsEvaluation = ClinicResult & {
  primaryCause: string;
  secondaryCause?: string;
  checksNext: string[];
  equipmentLevers: string[];
};

export function evaluateFatIrons(inputs: FatIronsInputs): FatIronsEvaluation {
  const score: LikelihoodSplit = { ...BASE_WEIGHTS };

  if (inputs.fatSeverity === "chunk") add(score, "pathDirection", 15);
  if (inputs.turfCondition === "soft") add(score, "equipmentContribution", 10);
  if (inputs.ballPosition === "veryForward") add(score, "setupAlignment", 14);
  if (inputs.ballPosition === "forward") add(score, "setupAlignment", 8);
  if (inputs.pressurePattern === "staysBack") add(score, "pathDirection", 14);
  if (inputs.loftPattern === "flip") add(score, "faceControl", 10);
  if (inputs.tempoTransition === "quick") add(score, "pathDirection", 6);
  if (inputs.fatSeverity !== "slight" && inputs.pressurePattern === "staysBack") add(score, "strikeGearEffect", 8);

  const split = normalizeSplit(score);
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const primaryLever = topBucket(split);

  return {
    split,
    primaryLever,
    bucketExplanations: {
      faceControl: "Adding loft / flipping can move the bottom of arc back and shallow out compression.",
      pathDirection: "Pressure and low-point control are the dominant separator in fat-contact misses.",
      strikeGearEffect: "When ground contact happens first, strike and launch are compromised regardless of face angle.",
      setupAlignment: "Forward ball position can force behind-ball strike if pressure and handle timing lag.",
      equipmentContribution: "Soft turf and sole interaction can punish marginal low-point control.",
    },
    whyLikely: "How heavy the miss is, turf condition, and pressure-forward clues strongly identify whether low-point control or setup is primary.",
    rangePlan,
    primaryCause: causeMap[primaryLever],
    secondaryCause: split[ranked[1]] >= 18 ? causeMap[ranked[1]] : undefined,
    checksNext: ["Track towel strikes over 6 reps.", "Confirm lead-side pressure at impact in slow-motion video.", "Mark divot starts relative to ball for each shot."],
    equipmentLevers: [
      "Bounce/sole lever: test sole interaction for your turf (no brand switch required).",
      "Lie angle lever: ensure delivered lie is not forcing heel dig.",
      "Shaft weight lever: use a profile that keeps transition from getting too quick/back-footed.",
    ],
  };
}

export function fatIronsLeverLabel(bucket: LikelihoodBucketKey): string {
  return BUCKET_LABELS[bucket];
}
