import { EMPTY_SPLIT, normalizeSplit, topBucket } from "@/lib/clinic/likelihood";
import { BUCKET_LABELS, ClinicRangeTest, ClinicResult, LikelihoodBucketKey, LikelihoodSplit, ThinIronsInputs } from "@/lib/clinic/types";

const BASE_WEIGHTS: LikelihoodSplit = {
  ...EMPTY_SPLIT,
  faceControl: 18,
  pathDirection: 20,
  strikeGearEffect: 24,
  setupAlignment: 22,
  equipmentContribution: 16,
};

function add(score: LikelihoodSplit, bucket: LikelihoodBucketKey, amount: number) {
  score[bucket] += amount;
}

function tests(): ClinicRangeTest[] {
  return [
    {
      id: "thin-low-point-line",
      title: "Low-point line drill",
      whatToDo: "Draw a line on the turf. Put the ball just ahead of the line and hit 6 irons with the goal: strike ball first, then turf after the line.",
      expectedIfCause: "If low-point control is the cause, contact quality improves quickly and strike feels less bladed as divot starts after the ball.",
      ifNoChange: "If strikes stay thin with no low-point shift, check posture/extension and setup next.",
      targets: ["pathDirection", "setupAlignment"],
      visualAid: {
        title: "Ball-first line station",
        lanes: ["Target line", "Ball", "Low-point line"],
        markers: ["Aim body and clubface at target line", "Ball is one ball-width ahead of line", "Brush turf after the line, not before"],
        hint: "Use the line as truth for low point. No guessing.",
      },
    },
    {
      id: "thin-posture-constraint",
      title: "Posture constraint / hip-depth reference",
      whatToDo: "Set a chair or alignment stick just behind your hips. Hit 5 balls keeping hip depth through impact so your chest stays down through strike.",
      expectedIfCause: "If early extension is driving thin contact, maintaining hip depth improves strike height and launch consistency.",
      ifNoChange: "If posture cue does not change strike, test setup A/B and face contact pattern next.",
      targets: ["setupAlignment", "pathDirection"],
      visualAid: {
        title: "Hip-depth checkpoint",
        lanes: ["Golfer", "Hip depth reference", "Ball/target"],
        markers: ["Keep glutes lightly connected to reference", "Do not stand up toward ball", "Ball starts on target while posture stays stable"],
        hint: "If you lose contact with the reference early, extension likely contributes.",
      },
    },
    {
      id: "thin-ball-handle-ab",
      title: "Ball position + handle height A/B check",
      whatToDo: "Hit 4 balls with current setup, then 4 with ball half-ball back and handle neutral (not high). Compare strike and launch.",
      expectedIfCause: "If setup is the cause, B-set gives cleaner center-face strike and lower-risk launch window.",
      ifNoChange: "If both sets are equally thin, prioritize low-point and posture work before changing specs.",
      targets: ["setupAlignment", "strikeGearEffect"],
      visualAid: {
        title: "A/B setup map",
        lanes: ["Set A", "Set B", "Compare"],
        markers: ["A = current ball + handle", "B = slightly back ball + neutral handle height", "Track strike location and turf contact"],
        hint: "Pick the setup that repeats ball-first contact, not the one that looks better.",
      },
    },
  ];
}

function pickRangePlan(split: LikelihoodSplit): ClinicRangeTest[] {
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const top2 = new Set(ranked.slice(0, 2));
  return tests()
    .map((test) => ({ test, score: test.targets.reduce((acc, t) => acc + split[t] / 100 + (top2.has(t) ? 2 : 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.test);
}

const primaryMap: Record<LikelihoodBucketKey, string> = {
  faceControl: "Dynamic loft / face delivery is adding thin-launch behavior.",
  pathDirection: "Low point is too variable relative to ball (delivery path/arc issue).",
  strikeGearEffect: "Low-face or off-center strike is producing bladed contact.",
  setupAlignment: "Setup window (ball position + handle height + posture) is pre-biasing thin strike.",
  equipmentContribution: "Shaft/lie/length may be amplifying a marginal delivery pattern.",
};

export type ThinIronsEvaluation = ClinicResult & {
  primaryCause: string;
  secondaryCause?: string;
  checksNext: string[];
  equipmentLevers: string[];
};

export function evaluateThinIrons(inputs: ThinIronsInputs): ThinIronsEvaluation {
  const score: LikelihoodSplit = { ...BASE_WEIGHTS };

  if (inputs.lowPointControl === "noDivot") add(score, "pathDirection", 14);
  if (inputs.lowPointControl === "mixed") add(score, "pathDirection", 8);
  if (inputs.earlyExtension === "often") add(score, "setupAlignment", 14);
  if (inputs.earlyExtension === "sometimes") add(score, "setupAlignment", 8);
  if (inputs.liftIntent === "often") add(score, "faceControl", 12);
  if (inputs.setupWindow === "both") add(score, "setupAlignment", 12);
  if (inputs.setupWindow === "ballForward" || inputs.setupWindow === "handleHigh") add(score, "setupAlignment", 8);
  if (inputs.strikeClue === "lowFace") add(score, "strikeGearEffect", 14);
  if (inputs.strikeClue === "toe" || inputs.strikeClue === "heel") add(score, "strikeGearEffect", 8);
  if (inputs.missPattern === "twoWay") add(score, "setupAlignment", 6);
  if (inputs.liftIntent === "often" && inputs.lowPointControl !== "clean") add(score, "faceControl", 6);

  const split = normalizeSplit(score);
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const primaryLever = topBucket(split);
  const secondaryLever = ranked[1];

  return {
    split,
    primaryLever,
    bucketExplanations: {
      faceControl: "Trying to lift the ball can add loft and reduce shaft lean, exposing thin strike.",
      pathDirection: "Low-point location is an arc control issue. If it stays too far forward/up, thin contact appears.",
      strikeGearEffect: "Low-face and off-center contact are direct clues for bladed feel and weak flight.",
      setupAlignment: "Ball too far forward, high handle, or standing up shifts strike higher on the ball.",
      equipmentContribution: "Lie/length/shaft can amplify strike inconsistency when delivery is close to the edge.",
    },
    whyLikely: "Low-point clues, posture behavior, and strike-map cues separate delivery timing from setup and face-contact causes for thin irons.",
    rangePlan: pickRangePlan(split),
    primaryCause: primaryMap[primaryLever],
    secondaryCause: split[secondaryLever] >= 18 ? primaryMap[secondaryLever] : undefined,
    checksNext: ["Mark 3 low-point lines and count ball-first reps.", "Film face-on to confirm chest stays down through impact.", "Use spray to confirm low-face misses vs center-face."],
    equipmentLevers: [
      "Lie angle lever: test slightly flatter/upright only after low-point improves.",
      "Length lever: shorter playing length can tighten strike pattern.",
      "Shaft weight/profile lever: choose a profile that supports stable posture/tempo.",
    ],
  };
}

export function thinIronsLeverLabel(bucket: LikelihoodBucketKey): string {
  return BUCKET_LABELS[bucket];
}
