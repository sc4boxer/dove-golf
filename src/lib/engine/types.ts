// src/lib/engine/types.ts

export type PrimaryFix =
  | "slice"
  | "hook"
  | "ballooning"
  | "lowLaunch"
  | "distanceLoss"
  | "inconsistentStrike"
  | "timingOff"
  | "tooHeavy"
  | "tooLight"
  | "dispersion";

export type ClubType = "driverWoods" | "irons" | "fullBag";

export type Tempo = "smooth" | "moderate" | "aggressive";
export type Transition = "gradual" | "quick" | "violent";
export type Strike = "center" | "toe" | "heel" | "highFace" | "lowFace" | "unknown";
export type LaunchFeel = "low" | "mid" | "high" | "unknown";

export type DriverInputs = {
  clubType: "driverWoods";
  primaryFix: PrimaryFix;
  speedMph: number;
  tempo: Tempo;
  transition: Transition;
  strike: Strike;
  currentShaftWeightG?: number;
  currentFlex?: "R" | "S" | "X" | "unknown";
  launchFeel: LaunchFeel;
};

export type IronInputs = {
  clubType: "irons";
  primaryFix: PrimaryFix;
  sixIronSpeedMph: number;
  tempo: Tempo;
  transition: Transition;
  strike: "thin" | "fat" | "center" | "unknown";
  fatigue: "none" | "some" | "aLot" | "unknown";
  currentShaftWeightG?: number;
  currentFlex?: "R" | "S" | "X" | "unknown";
  peakHeightFeel: LaunchFeel;
};

export type ProfileRecommendation = {
  category: "Driver/Woods" | "Irons";
  profile: {
    weightRange: string;
    flex: string;
    torqueRange?: string;
    launchBias: "Low" | "Mid" | "High";
    balanceBias:
      | "Neutral"
      | "Slight Counterbalanced"
      | "Slight Head-Heavy"
      | "Neutral-to-Counterbalanced";
    materialBias?: "Steel" | "Graphite" | "Steel or Graphite";
    headBias?: string;
  };
  fitScore: number;
  adjustmentGuide: string[];
  constraintNote: string;
  disclaimer: string;
};
