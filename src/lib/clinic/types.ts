export type ClinicProblemKey = "driverSlice";

export type LikelihoodBucketKey =
  | "faceControl"
  | "pathDirection"
  | "strikeGearEffect"
  | "setupAlignment"
  | "equipmentContribution";

export type LikelihoodSplit = Record<LikelihoodBucketKey, number>;

export type DriverSliceStartLine = "left" | "center" | "right" | "unsure";
export type DriverSliceCurveSeverity = "none" | "slight" | "moderate" | "severe";
export type DriverSliceStrike = "heel" | "center" | "toe" | "high" | "low" | "unsure";
export type DriverSliceMissPattern = "oneWay" | "twoWay" | "unsure";
export type DriverSliceGrip = "weak" | "neutral" | "strong" | "unsure";
export type DriverSliceTempo = "smooth" | "neutral" | "quick" | "unsure";
export type DriverSlicePersistentRightStart = "yes" | "no" | "unsure";

export type DriverSliceInputs = {
  startLine: DriverSliceStartLine;
  curveSeverity: DriverSliceCurveSeverity;
  strikeLocation: DriverSliceStrike;
  missPattern?: DriverSliceMissPattern;
  gripStrength: DriverSliceGrip;
  tempoRelease: DriverSliceTempo;
  persistentRightStart?: DriverSlicePersistentRightStart;
};

export type ClinicFeedbackOutcome = "fixed" | "improved" | "no-change" | "worse";

export type ClinicRangeVisualAid = {
  title: string;
  lanes: string[];
  markers: string[];
  hint: string;
};

export type ClinicRangeTest = {
  id: string;
  title: string;
  whatToDo: string;
  expectedIfCause: string;
  ifNoChange: string;
  targets: LikelihoodBucketKey[];
  visualAid: ClinicRangeVisualAid;
};

export type ClinicResult = {
  split: LikelihoodSplit;
  primaryLever: LikelihoodBucketKey;
  bucketExplanations: Record<LikelihoodBucketKey, string>;
  whyLikely: string;
  rangePlan: ClinicRangeTest[];
};

export type ClinicSession = {
  id: string;
  createdAt: string;
  problemKey: ClinicProblemKey;
  inputs: DriverSliceInputs;
  result: ClinicResult;
  feedbackOutcome?: ClinicFeedbackOutcome;
};

export const BUCKET_LABELS: Record<LikelihoodBucketKey, string> = {
  faceControl: "Face control (face-to-path)",
  pathDirection: "Path direction (swing direction)",
  strikeGearEffect: "Strike / gear effect",
  setupAlignment: "Setup / alignment",
  equipmentContribution: "Equipment contribution",
};
