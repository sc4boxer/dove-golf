import { EMPTY_SPLIT, normalizeSplit, topBucket } from "@/lib/clinic/likelihood";
import {
  BUCKET_LABELS,
  ClinicRangeTest,
  ClinicResult,
  DriverSliceInputs,
  LikelihoodBucketKey,
  LikelihoodSplit,
} from "@/lib/clinic/types";

const BASE_WEIGHTS: LikelihoodSplit = {
  ...EMPTY_SPLIT,
  faceControl: 24,
  pathDirection: 20,
  strikeGearEffect: 20,
  setupAlignment: 18,
  equipmentContribution: 12,
};

function makeBaseTests(): ClinicRangeTest[] {
  return [
    {
      id: "face-gate",
      title: "Face-control gate drill",
      whatToDo:
        "Hit 6 balls with a tee gate just ahead of the clubface. Keep your normal swing speed and feel the face staying square longer.",
      expectedIfCause:
        "If face control is the main issue, start lines should move closer to center and curve should reduce within a few swings.",
      ifNoChange:
        "If start line stays right with similar curve, face control is not the only driver. Shift to path/strike checks next.",
      targets: ["faceControl"],
      visualAid: {
        title: "Gate placement",
        lanes: ["Target line", "Tee gate", "Ball"],
        markers: ["Target  ●────────────▶", "Gate      [tee]  [tee]", "Ball      o"],
        hint: "Start the ball between the tees and keep the face from hanging open through impact.",
      },
    },
    {
      id: "path-stick",
      title: "Path direction stick station",
      whatToDo:
        "Place an alignment stick just outside the ball-to-target line and make 5 swings missing the stick while swinging slightly more to right field.",
      expectedIfCause:
        "If path direction is the cause, ball start should stabilize and the rightward curve should shrink when the path neutralizes.",
      ifNoChange:
        "If curve and start line barely move, path may be secondary and strike location is likely dominating.",
      targets: ["pathDirection", "setupAlignment"],
      visualAid: {
        title: "Path station",
        lanes: ["Stick", "Swing corridor", "Target"],
        markers: ["Stick     │", "Path      ↗ (inside the stick)", "Ball      o  →  Target"],
        hint: "Miss the stick on the downswing; your ball should begin closer to center with less wipey spin.",
      },
    },
    {
      id: "strike-spray",
      title: "Impact location test",
      whatToDo:
        "Use face spray for 5 balls and tee the ball slightly higher. Keep tempo smooth and note where contact clusters.",
      expectedIfCause:
        "If strike/gear effect is primary, moving strike off the heel should reduce slice tilt immediately.",
      ifNoChange:
        "If contact shifts but flight does not, face-to-path is likely the stronger lever than strike.",
      targets: ["strikeGearEffect", "equipmentContribution"],
      visualAid: {
        title: "Face pattern check",
        lanes: ["High", "Center", "Low"],
        markers: ["Top row      high", "Middle row   heel | center | toe", "Bottom row   low"],
        hint: "Circle strike marks after each shot—if heel marks shift toward center/toe, slice tilt should soften.",
      },
    },
  ];
}

function add(score: LikelihoodSplit, bucket: LikelihoodBucketKey, amount: number) {
  score[bucket] += amount;
}

function buildExplanations(inputs: DriverSliceInputs) {
  return {
    faceControl:
      inputs.startLine === "right"
        ? "Your ball often starts right, which is consistent with an open face at impact. The curve pattern suggests face-to-path is a strong lever."
        : "Your answers suggest face delivery is still a meaningful influence, especially when curve persists under similar speed.",
    pathDirection:
      inputs.startLine === "left"
        ? "A left start with rightward curvature often points to path-direction mismatch. That pattern keeps path as a likely contributor."
        : "Path may still contribute when curvature repeats, but your pattern does not make it the leading signal yet.",
    strikeGearEffect:
      inputs.strikeLocation === "heel"
        ? "Heel-biased contact commonly adds slice spin through gear effect. Your strike input is directly consistent with this bucket."
        : "Strike can still shape spin axis, but your reported contact location gives a moderate rather than dominant strike signal.",
    setupAlignment:
      "Setup and aim can bias both path and face delivery. This bucket remains a background lever unless start-line cues become mixed.",
    equipmentContribution:
      "Equipment can amplify misses, but the current pattern still reads more like delivery and strike than a pure equipment issue.",
  };
}

function pickRangePlan(split: LikelihoodSplit): ClinicRangeTest[] {
  const tests = makeBaseTests();
  const ranked = (Object.keys(split) as LikelihoodBucketKey[]).sort((a, b) => split[b] - split[a]);
  const top2 = new Set(ranked.slice(0, 2));

  const prioritized = tests
    .map((test) => ({
      test,
      score: test.targets.reduce((acc, t) => acc + (top2.has(t) ? 2 : 0) + split[t] / 100, 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.test);

  return prioritized;
}

export function evaluateDriverSlice(inputs: DriverSliceInputs): ClinicResult {
  const score: LikelihoodSplit = { ...BASE_WEIGHTS };

  if (inputs.startLine === "right" && ["moderate", "severe"].includes(inputs.curveSeverity)) {
    add(score, "faceControl", 18);
  }

  if (inputs.startLine === "left" && inputs.curveSeverity === "severe") {
    add(score, "pathDirection", 16);
  }

  if (inputs.strikeLocation === "heel") {
    add(score, "strikeGearEffect", 18);
    add(score, "faceControl", 8);
  }

  if (inputs.gripStrength === "weak") {
    add(score, "faceControl", 10);
  }

  if (inputs.tempoRelease === "quick") {
    add(score, "faceControl", 5);
    add(score, "strikeGearEffect", 4);
  }

  if (inputs.missPattern === "twoWay") {
    add(score, "setupAlignment", 8);
    add(score, "pathDirection", 5);
  }

  if (inputs.curveSeverity === "none") {
    add(score, "setupAlignment", 6);
    add(score, "faceControl", -6);
  }

  if (inputs.persistentRightStart === "yes") {
    add(score, "faceControl", 9);
    add(score, "pathDirection", 3);
  } else if (inputs.persistentRightStart === "no") {
    add(score, "strikeGearEffect", 6);
    add(score, "setupAlignment", 3);
  }

  if (inputs.strikeLocation === "heel" && inputs.curveSeverity === "severe") {
    add(score, "equipmentContribution", 6);
  }

  if (score.equipmentContribution > 24) {
    score.equipmentContribution = 24;
  }

  const split = normalizeSplit(score);
  const primaryLever = topBucket(split);
  const bucketExplanations = buildExplanations(inputs);
  const rangePlan = pickRangePlan(split);

  return {
    split,
    primaryLever,
    bucketExplanations,
    whyLikely: `The combination of start-line and curve shape indicates where face-to-path likely diverges. Contact pattern (${inputs.strikeLocation}) and delivery proxies (grip and tempo) help separate strike-driven tilt from direction-driven tilt.`,
    rangePlan,
  };
}

export function primaryLeverLabel(bucket: LikelihoodBucketKey): string {
  return BUCKET_LABELS[bucket];
}
