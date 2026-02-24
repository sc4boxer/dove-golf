export type ClinicProblemKey = "driverSlice" | "pullHook" | "thinIrons" | "fatIrons" | "highSpinBalloon";

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

export type PullHookStartLine = "left" | "center" | "right" | "unsure";
export type PullHookCurveSeverity = "none" | "slight" | "moderate" | "severe";
export type PullHookStrike = "heel" | "center" | "toe" | "high" | "low" | "unsure";
export type PullHookMissPattern = "oneWay" | "twoWay" | "unsure";
export type PullHookTempo = "smooth" | "neutral" | "quick" | "unsure";
export type PullHookDriverVsIrons = "driverWorse" | "ironsWorse" | "sameBoth" | "unsure";
export type PullHookAlignment = "square" | "aimLeft" | "ballBack" | "closedStance" | "unsure";

export type ThinIronsInputs = {
  lowPointControl: "clean" | "mixed" | "noDivot" | "unsure";
  earlyExtension: "rare" | "sometimes" | "often" | "unsure";
  liftIntent: "never" | "sometimes" | "often" | "unsure";
  setupWindow: "neutral" | "ballForward" | "handleHigh" | "both" | "unsure";
  strikeClue: "lowFace" | "toe" | "heel" | "mixed" | "unsure";
  missPattern: "oneWay" | "twoWay" | "unsure";
};

export type FatIronsInputs = {
  fatSeverity: "slight" | "chunk" | "mixed" | "unsure";
  turfCondition: "normal" | "soft" | "mixed" | "unsure";
  ballPosition: "neutral" | "forward" | "veryForward" | "unsure";
  pressurePattern: "forward" | "staysBack" | "mixed" | "unsure";
  loftPattern: "compress" | "flip" | "mixed" | "unsure";
  tempoTransition: "smooth" | "neutral" | "quick" | "unsure";
};

export type HighSpinBalloonInputs = {
  flightPattern: "highShort" | "windBalloon" | "both" | "unsure";
  divotClue: "shallow" | "steep" | "mixed" | "unsure";
  dynamicLoft: "handsAhead" | "neutral" | "handsBehind" | "unsure";
  contactPattern: "center" | "lowFace" | "mixed" | "unsure";
  setupWindow: "neutral" | "ballForward" | "handleBack" | "both" | "unsure";
  tempoTransition: "smooth" | "neutral" | "quick" | "unsure";
};

export type DriverSliceInputs = {
  startLine: DriverSliceStartLine;
  curveSeverity: DriverSliceCurveSeverity;
  strikeLocation: DriverSliceStrike;
  missPattern?: DriverSliceMissPattern;
  gripStrength: DriverSliceGrip;
  tempoRelease: DriverSliceTempo;
  persistentRightStart?: DriverSlicePersistentRightStart;
};

export type PullHookInputs = {
  startLine: PullHookStartLine;
  curveSeverity: PullHookCurveSeverity;
  strikeLocation: PullHookStrike;
  missPattern?: PullHookMissPattern;
  tempoTransition: PullHookTempo;
  driverVsIrons?: PullHookDriverVsIrons;
  setupPattern?: PullHookAlignment;
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
  inputs: DriverSliceInputs | PullHookInputs | ThinIronsInputs | FatIronsInputs | HighSpinBalloonInputs;
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
