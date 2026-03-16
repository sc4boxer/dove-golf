import { EMPTY_SPLIT, normalizeSplit, topBucket } from "@/lib/clinic/likelihood";
import { BUCKET_LABELS, ClinicRangeTest, ClinicResult, LikelihoodBucketKey, LikelihoodSplit, PullHookInputs } from "@/lib/clinic/types";

const BASE_WEIGHTS: LikelihoodSplit = {
  ...EMPTY_SPLIT,
  faceControl: 24,
  pathDirection: 20,
  strikeGearEffect: 17,
  setupAlignment: 21,
  equipmentContribution: 18,
};

function add(score: LikelihoodSplit, bucket: LikelihoodBucketKey, amount: number) {
  score[bucket] += amount;
}

function pullHookExplanations(inputs: PullHookInputs) {
  return {
    faceControl:
      inputs.startLine === "left" && ["moderate", "severe"].includes(inputs.curveSeverity)
        ? "A left start with strong left curve is usually a face-to-path closure timing issue. Face is arriving too closed for the delivered path."
        : "Face timing can still be involved when misses turn over quickly, even if the start line varies.",
    pathDirection:
      inputs.missPattern === "oneWay"
        ? "A one-way left pattern often points to an in-to-out path paired with a closed face."
        : "Path influence looks present but may be mixed with setup or strike if misses switch between pulls and hooks.",
    strikeGearEffect:
      inputs.strikeLocation === "toe"
        ? "Toe-biased strike can add hook gear effect and amplify left curvature, especially at driver speed."
        : "Strike can still tilt spin axis, but your reported contact does not make it the only signal.",
    setupAlignment:
      "Setup details like aiming left, ball too far back, or a closed stance can shift start line left before any curvature appears.",
    equipmentContribution:
      "Upright lie, soft/light shaft profiles, extra length, or strong head bias can all push closure timing left when delivery is already marginal.",
  };
}

function buildRangePlan(): ClinicRangeTest[] {
  return [
    {
      id: "start-line-gate",
      title: "Start-line gate with neutral face rehearsal",
      whatToDo:
        "Set a 2-tee gate 8 feet in front of the ball on your target line. Hit 6 drives at 80% speed and rehearse a quieter closure through impact.",
      expectedIfCause: "If face timing is primary, more balls start through the gate and curvature shrinks from hook toward soft draw.",
      ifNoChange: "If start line stays left despite neutral-face rehearsal, check setup and lie angle influence next.",
      targets: ["faceControl", "setupAlignment"],
      visualAid: {
        title: "Gate station",
        lanes: ["Target", "Gate", "Ball"],
        markers: ["Target line  ●────────▶", "Gate        [tee] [tee]", "Ball        o"],
        hint: "The goal is neutral start line first, then manageable curve.",
      },
    },
    {
      id: "strike-map",
      title: "Toe vs center strike mapping",
      whatToDo:
        "Use face spray for 6 balls. Keep setup constant and compare toe, center, and heel strike outcomes against start line and curve.",
      expectedIfCause:
        "If strike gear effect is a driver, toe clusters should produce the strongest left curvature while centered contact moderates hook spin.",
      ifNoChange: "If strike location changes but shape does not, face/path timing is likely the stronger lever.",
      targets: ["strikeGearEffect", "faceControl"],
      visualAid: {
        title: "Impact map",
        lanes: ["Heel", "Center", "Toe"],
        markers: ["Mark each strike location", "Pair each mark with launch direction", "Look for toe = extra left curve"],
        hint: "Tie contact location directly to ball flight to avoid guessing.",
      },
    },
    {
      id: "delivery-gear-check",
      title: "Delivery and equipment lever check",
      whatToDo:
        "Hit 5 shots with handle more neutral (less forward lean), then 5 with a flatter setup feel. Keep tempo neutral and record start line.",
      expectedIfCause: "If shaft/lie delivery is involved, left starts should reduce when delivery and lie bias are neutralized.",
      ifNoChange: "If left starts persist, prioritize face/path sequencing drills before changing gear specs.",
      targets: ["equipmentContribution", "pathDirection"],
      visualAid: {
        title: "A/B check",
        lanes: ["Set A", "Set B", "Compare"],
        markers: ["A: current delivery", "B: neutral handle + flatter feel", "Track which set starts straighter"],
        hint: "Small delivery changes can expose whether lie/shaft is amplifying the miss.",
      },
    },
  ];
}

function pickRangePlan(split: LikelihoodSplit): ClinicRangeTest[] {
  const tests = buildRangePlan();
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const top2 = new Set(ranked.slice(0, 2));

  return tests
    .map((test) => ({
      test,
      score: test.targets.reduce((acc, t) => acc + (top2.has(t) ? 2 : 0) + split[t] / 100, 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.test);
}

function buildChecks(primary: LikelihoodBucketKey): string[] {
  const byBucket: Record<LikelihoodBucketKey, string[]> = {
    faceControl: ["Film start line from down-the-line for 5 swings.", "Check grip pressure and closure timing through impact.", "Verify ball is not set too far back."],
    pathDirection: ["Use alignment sticks for stance and shoulder lines.", "Confirm club path isn’t excessively in-to-out.", "Pair path feel with neutral face rehearsal."],
    strikeGearEffect: ["Spray face and confirm strike cluster.", "Check tee height and distance from ball.", "Re-test with centered contact intent."],
    setupAlignment: ["Confirm feet, hips, and shoulders are square.", "Check ball position against lead heel reference.", "Verify target selection and intermediate aim point."],
    equipmentContribution: ["Check dynamic lie bias with impact tape or board.", "Review shaft weight/flex/profile against tempo.", "Confirm driver length and grip size are controllable."],
  };

  return byBucket[primary].slice(0, 3);
}

function leverSet(primary: LikelihoodBucketKey): string[] {
  const baseline = [
    "Head bias / face angle: reduce left bias (more neutral or slightly open look).",
    "Lie angle: test flatter delivered lie to reduce upright-left starts.",
    "Shaft + length: consider heavier/stiffer or lower-torque profile and controllable length.",
    "Grip build: slightly larger grip can slow closure for some players.",
  ];

  if (primary === "strikeGearEffect") {
    return [baseline[2], "Loft/face setting: avoid too much upright draw setting.", baseline[1], baseline[3]];
  }

  return baseline;
}

export type PullHookEvaluation = ClinicResult & {
  primaryCause: string;
  secondaryCause?: string;
  checksNext: string[];
  equipmentLevers: string[];
  rangeValidationTest: string;
};

export function evaluatePullHook(inputs: PullHookInputs): PullHookEvaluation {
  const score: LikelihoodSplit = { ...BASE_WEIGHTS };

  if (inputs.startLine === "left") add(score, "setupAlignment", 12);
  if (inputs.startLine === "left" && ["moderate", "severe"].includes(inputs.curveSeverity)) {
    add(score, "faceControl", 14);
    add(score, "pathDirection", 7);
  }

  if (inputs.curveSeverity === "severe") {
    add(score, "faceControl", 8);
    add(score, "equipmentContribution", 4);
  }

  if (inputs.strikeLocation === "toe") add(score, "strikeGearEffect", 14);
  if (inputs.strikeLocation === "heel") add(score, "strikeGearEffect", -5);

  if (inputs.missPattern === "oneWay") {
    add(score, "pathDirection", 10);
    add(score, "faceControl", 5);
  }

  if (inputs.tempoTransition === "quick") {
    add(score, "faceControl", 6);
    add(score, "equipmentContribution", 4);
  }

  if (inputs.driverVsIrons === "driverWorse") {
    add(score, "strikeGearEffect", 8);
    add(score, "equipmentContribution", 8);
  } else if (inputs.driverVsIrons === "ironsWorse") {
    add(score, "setupAlignment", 6);
    add(score, "pathDirection", 5);
  }

  if (inputs.setupPattern === "aimLeft") add(score, "setupAlignment", 12);
  if (inputs.setupPattern === "ballBack") {
    add(score, "setupAlignment", 8);
    add(score, "faceControl", 4);
  }
  if (inputs.setupPattern === "closedStance") add(score, "pathDirection", 9);

  const split = normalizeSplit(score);
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const primaryLever = topBucket(split);
  const secondaryLever = ranked[1];

  const primaryCauseMap: Record<LikelihoodBucketKey, string> = {
    faceControl: "Face-to-path is closing too fast (timing / closure-rate bias).",
    pathDirection: "Path is too in-to-out while face is still closed to that path.",
    strikeGearEffect: "Toe-side strike is adding hook gear effect.",
    setupAlignment: "Setup/alignment or ball position is pre-biasing the start line left.",
    equipmentContribution: "Delivery + equipment blend (upright/closure-biased build) is amplifying left miss.",
  };

  const secondaryCause = split[secondaryLever] >= 18 ? primaryCauseMap[secondaryLever] : undefined;

  return {
    split,
    primaryLever,
    bucketExplanations: pullHookExplanations(inputs),
    whyLikely:
      "Start line + curve identify face/path behavior, then strike, setup, and club-specific patterns separate gear effect from delivery and equipment amplification.",
    rangePlan: pickRangePlan(split),
    primaryCause: primaryCauseMap[primaryLever],
    secondaryCause,
    checksNext: buildChecks(primaryLever),
    equipmentLevers: leverSet(primaryLever),
    rangeValidationTest:
      "Hit 8 balls alternating normal swing and neutral-face rehearsal through a start-line gate. Diagnosis is validated if neutral reps start straighter and curve less.",
  };
}

export function pullHookLeverLabel(bucket: LikelihoodBucketKey): string {
  return BUCKET_LABELS[bucket];
}
