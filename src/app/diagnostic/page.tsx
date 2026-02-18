"use client";

import React, { useEffect, useMemo, useState } from "react";
import EmailCaptureCard from "./EmailCaptureCard";

import { recommendDriverWoods } from "@/lib/engine/driver";
import { recommendIrons } from "@/lib/engine/irons";

type FitFocus = "driver_woods" | "irons" | "wedges" | "full_bag";

type PlayFreq = "monthly" | "weekly" | "twice_weekly" | "three_plus" | "range_only";
type Goal = "distance" | "accuracy" | "higher_launch" | "reduce_spin" | "feel";
type Tempo = "smooth" | "neutral" | "quick" | "unsure";
type Constraint = "none" | "elbow" | "shoulder_back" | "prefer_lighter";

// Driver-specific
type KnowSpeed = "yes" | "no";
type DriverMiss = "slice" | "hook" | "push" | "pull" | "both";
type Flight = "low" | "mid" | "high";
type DriverStrike = "heel" | "center" | "toe" | "all_over";
type ShaftWeightNow = "dont_know" | "lt_55" | "55_65" | "65_75" | "75_plus";

// Iron-specific
type IronKnow = "yes" | "no";
type IronStrike = "thin" | "fat" | "center" | "all_over" | "unsure";
type IronMiss = "push" | "pull" | "short" | "long" | "both" | "unsure";
type Fatigue = "none" | "some" | "aLot" | "unsure";
type Peak = "low" | "mid" | "high";

// Wedge-specific
type WedgeUse = "mostly_full" | "mixed" | "mostly_greenside";
type Turf = "digger" | "neutral" | "sweeper" | "unsure";
type WedgeMiss = "fat" | "thin" | "both" | "unsure";
type WedgeTraj = "lower" | "neutral" | "higher";
type WedgeSpin = "more_check" | "balanced" | "more_release";
type WedgeShaftPref = "match_irons" | "slightly_heavier" | "unknown";

type Answers = {
  // Focus + shared
  fitFocus: FitFocus;
  handicapBand: 0 | 1 | 2 | 3 | 4;
  playFreq: PlayFreq;
  goal: Goal;
  constraint: Constraint;

  // Driver/Woods
  knowDriverSpeed: KnowSpeed;
  driverSpeed?: number; // mph
  driverCarry?: number; // yards
  driverMiss: DriverMiss;
  driverFlight: Flight;
  driverStrike: DriverStrike;
  driverTempo: Tempo;
  driverShaftWeightNow: ShaftWeightNow;

  // Irons
  knowIron: IronKnow;
  sevenIronSpeed?: number; // mph
  sevenIronCarry?: number; // yards
  ironMiss: IronMiss;
  ironPeak: Peak;
  ironStrike: IronStrike;
  ironFatigue: Fatigue;
  ironTempo: Tempo;
  ironShaftWeightNow: "dont_know" | "85_95" | "95_105" | "105_120" | "120_plus";

  // Wedges
  wedgeUse: WedgeUse;
  wedgeTurf: Turf;
  wedgeMiss: WedgeMiss;
  wedgeTrajectory: WedgeTraj;
  wedgeSpin: WedgeSpin;
  wedgeShaftPref: WedgeShaftPref;
};

type Step =
  | "focus"
  | "handicap"
  | "play"
  | "goal"
  | "constraints"
  // Driver/Woods steps
  | "driver_speed"
  | "driver_miss"
  | "driver_flight"
  | "driver_strike"
  | "driver_tempo"
  | "driver_shaftnow"
  // Iron steps
  | "iron_speed"
  | "iron_miss"
  | "iron_peak"
  | "iron_strike"
  | "iron_fatigue"
  | "iron_tempo"
  | "iron_shaftnow"
  // Wedge steps
  | "wedge_use"
  | "wedge_turf"
  | "wedge_miss"
  | "wedge_traj"
  | "wedge_spin"
  | "wedge_shaftpref"
  | "results";

const DEFAULT_ANSWERS: Answers = {
  fitFocus: "driver_woods",

  handicapBand: 2,
  playFreq: "weekly",
  goal: "accuracy",
  constraint: "none",

  knowDriverSpeed: "no",
  driverCarry: 220,
  driverMiss: "slice",
  driverFlight: "mid",
  driverStrike: "all_over",
  driverTempo: "neutral",
  driverShaftWeightNow: "dont_know",

  knowIron: "no",
  sevenIronCarry: 145,
  ironMiss: "unsure",
  ironPeak: "mid",
  ironStrike: "unsure",
  ironFatigue: "unsure",
  ironTempo: "neutral",
  ironShaftWeightNow: "dont_know",

  wedgeUse: "mixed",
  wedgeTurf: "neutral",
  wedgeMiss: "unsure",
  wedgeTrajectory: "neutral",
  wedgeSpin: "balanced",
  wedgeShaftPref: "unknown",
};

function buildSteps(focus: FitFocus): Step[] {
  const base: Step[] = ["focus", "handicap", "play", "goal", "constraints"];

  const driver: Step[] = [
    "driver_speed",
    "driver_miss",
    "driver_flight",
    "driver_strike",
    "driver_tempo",
    "driver_shaftnow",
  ];

  const irons: Step[] = [
    "iron_speed",
    "iron_miss",
    "iron_peak",
    "iron_strike",
    "iron_fatigue",
    "iron_tempo",
    "iron_shaftnow",
  ];

  const wedges: Step[] = [
    "wedge_use",
    "wedge_turf",
    "wedge_miss",
    "wedge_traj",
    "wedge_spin",
    "wedge_shaftpref",
  ];

  if (focus === "driver_woods") return [...base, ...driver, "results"];
  if (focus === "irons") return [...base, ...irons, "results"];
  if (focus === "wedges") return [...base, ...wedges, "results"];
  return [...base, ...driver, ...irons, ...wedges, "results"];
}

function handicapLabel(b: Answers["handicapBand"]) {
  return ["0–5", "6–12", "13–20", "21–30", "31+"][b];
}

// ---- speed estimators ----
function carryToDriverSpeed(carry: number) {
  if (carry <= 180) return 85;
  if (carry <= 200) return 92;
  if (carry <= 220) return 98;
  if (carry <= 240) return 105;
  return 112;
}

function carryToSevenIronSpeed(carry: number) {
  if (carry <= 120) return 70;
  if (carry <= 140) return 78;
  if (carry <= 155) return 84;
  if (carry <= 170) return 90;
  return 95;
}

function estimateDriverSpeed(a: Answers) {
  if (a.knowDriverSpeed === "yes" && typeof a.driverSpeed === "number") return a.driverSpeed;
  if (typeof a.driverCarry === "number") return carryToDriverSpeed(a.driverCarry);
  return 95;
}

function estimateSevenIronSpeed(a: Answers) {
  if (a.knowIron === "yes" && typeof a.sevenIronSpeed === "number") return a.sevenIronSpeed;
  if (typeof a.sevenIronCarry === "number") return carryToSevenIronSpeed(a.sevenIronCarry);
  const d = estimateDriverSpeed(a);
  return Math.max(65, Math.round(d * 0.78));
}

function driverShaftBucketToNumber(b: ShaftWeightNow): number | undefined {
  if (b === "lt_55") return 52;
  if (b === "55_65") return 60;
  if (b === "65_75") return 70;
  if (b === "75_plus") return 78;
  return undefined;
}

function ironShaftBucketToNumber(b: Answers["ironShaftWeightNow"]): number | undefined {
  if (b === "85_95") return 90;
  if (b === "95_105") return 100;
  if (b === "105_120") return 112;
  if (b === "120_plus") return 125;
  return undefined;
}

function addTenGramsLabel(weightLabel: string): string {
  const m = weightLabel.match(/(\d+)\D+(\d+)/);
  if (!m) return weightLabel;
  const lo = Number(m[1]);
  const hi = Number(m[2]);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return weightLabel;
  return `${lo + 10}–${hi + 10}g`;
}

function stepMeta(step: Step) {
  const map: Record<Exclude<Step, "results">, { title: string; why: string }> = {
    focus: {
      title: "What are you fitting today?",
      why: "We’ll ask only category-specific questions and generate separate profiles.",
    },
    handicap: {
      title: "What’s your handicap range?",
      why: "Helps calibrate how aggressive we should be with fit precision.",
    },
    play: {
      title: "How often do you play?",
      why: "Frequent players benefit from tighter fits; occasional players need more forgiveness.",
    },
    goal: {
      title: "What’s your goal right now?",
      why: "We bias stability vs launch vs feel based on your priority.",
    },
    constraints: {
      title: "Any physical constraints?",
      why: "We avoid recommendations likely to aggravate discomfort.",
    },

    driver_speed: { title: "Driver speed", why: "Sets the baseline for driver/woods shaft weight + flex." },
    driver_miss: { title: "Typical DRIVER miss", why: "Guides stability and face-control bias." },
    driver_flight: { title: "Typical DRIVER ball flight", why: "Guides launch/spin directionally." },
    driver_strike: { title: "DRIVER strike location", why: "Strike location influences forgiveness and spin." },
    driver_tempo: { title: "DRIVER transition feel", why: "Transition influences stability needs." },
    driver_shaftnow: { title: "Current DRIVER shaft weight", why: "Anchors feel to what you’re used to." },

    iron_speed: {
      title: "7-iron speed (or carry)",
      why: "Irons need their own speed proxy—driver speed doesn’t translate cleanly.",
    },
    iron_miss: { title: "Typical IRON miss", why: "Iron miss pattern often differs from driver and affects fit." },
    iron_peak: { title: "Typical IRON peak height", why: "Peak height guides launch and profile direction." },
    iron_strike: { title: "IRON strike pattern", why: "Thin/fat patterns strongly affect iron fit." },
    iron_fatigue: { title: "Fatigue with irons", why: "Total weight/material should respect fatigue." },
    iron_tempo: { title: "IRON transition feel", why: "Iron transition can differ from driver; treat separately." },
    iron_shaftnow: { title: "Current IRON shaft weight", why: "Anchors recommendations to your current feel." },

    wedge_use: {
      title: "How do you use your wedges most?",
      why: "Determines whether we bias gapping for full shots vs versatility around the green.",
    },
    wedge_turf: {
      title: "Turf interaction (digger vs sweeper)",
      why: "Primary driver of bounce/sole direction and how the club enters/exits the turf.",
    },
    wedge_miss: {
      title: "Typical wedge miss",
      why: "Fat/thin patterns correlate with bounce/sole needs and strike stability.",
    },
    wedge_traj: {
      title: "Preferred wedge trajectory",
      why: "Helps bias loft/gapping direction and build feel for flight control.",
    },
    wedge_spin: {
      title: "Preferred greenside rollout",
      why: "Influences loft spacing and bounce/grind direction for your typical shot style.",
    },
    wedge_shaftpref: {
      title: "Wedge shaft preference",
      why: "Wedges often match irons, or go slightly heavier for control—this sets the bias.",
    },
  };

  return map[step as Exclude<Step, "results">];
}

/* ---------------- WEDGE RECOMMENDER (deterministic) ---------------- */

function baseWedgeWeightFromSevenIronSpeed(sevenIronSpeedMph: number): string {
  if (sevenIronSpeedMph <= 74) return "95–105g";
  if (sevenIronSpeedMph <= 84) return "105–115g";
  if (sevenIronSpeedMph <= 92) return "115–125g";
  return "120–130g";
}

function pickBounceBand(turf: Turf, miss: WedgeMiss): "Low" | "Mid" | "High" {
  if (turf === "digger") return "High";
  if (turf === "sweeper") return "Low";
  if (miss === "fat") return "High";
  if (miss === "thin") return "Low";
  if (miss === "both") return "Mid";
  return "Mid";
}

function pickGrindBias(bounce: "Low" | "Mid" | "High", use: WedgeUse): string {
  if (bounce === "High") return "Wider sole / fuller grind (for forgiveness through turf/sand)";
  if (bounce === "Low") return "Relief/versatile grind (for shallow delivery + face manipulation)";
  return use === "mostly_greenside"
    ? "Versatile grind with some relief (open/close face without digging)"
    : "Mid-bounce versatile grind (balanced for full shots + chips)";
}

function pickGappingPlan(use: WedgeUse, traj: WedgeTraj, spin: WedgeSpin): {
  planTitle: string;
  bullets: string[];
} {
  if (use === "mostly_full") {
    return {
      planTitle: "Full-shot focused gapping",
      bullets: [
        "Typical plan: PW → Gap → Sand → Lob (4-wedge structure if you have room)",
        "Directional example: 46–50–54–58 (or 46–52–56–60 depending on preference)",
        traj === "lower"
          ? "Bias slightly stronger top wedge to keep flight down on approach wedges"
          : "Maintain even gaps for predictable yardages",
        spin === "more_check"
          ? "Favor a dedicated lob wedge loft for stopping power"
          : "Favor a slightly stronger top wedge for distance control",
      ],
    };
  }

  if (use === "mostly_greenside") {
    return {
      planTitle: "Greenside versatility gapping",
      bullets: [
        "Typical plan: Gap → Sand → Lob (3-wedge structure for simplicity)",
        "Directional example: 52–56–60 (or 50–54–58 if you prefer lower launch)",
        traj === "lower"
          ? "Consider slightly stronger lofts to keep flight down"
          : "Consider a higher-loft lob wedge option for soft landing",
        spin === "more_release"
          ? "Favor a mid-loft utility wedge you can bump-and-run"
          : "Favor a lob wedge you can stop quickly",
      ],
    };
  }

  return {
    planTitle: "Balanced gapping (mixed use)",
    bullets: [
      "Typical plan: Gap → Sand → Lob (3 wedges), add one more gap wedge if you have room",
      "Directional example: 50–54–58 (balanced) or 52–56–60 (more loft coverage)",
      traj === "lower"
        ? "Leaning 50–54–58 tends to keep flight slightly down"
        : "Leaning 52–56–60 gives more height options around the green",
      spin === "more_check"
        ? "Favor loft coverage on the bottom end (lob wedge utility)"
        : "Favor consistent yardage gapping on the top end",
    ],
  };
}

function recommendWedgesDeterministic(input: {
  focusGoal: Goal;
  constraint: Constraint;
  sevenIronSpeedMph: number;
  ironWeightRangeLabel?: string;
  wedgeUse: WedgeUse;
  wedgeTurf: Turf;
  wedgeMiss: WedgeMiss;
  wedgeTrajectory: WedgeTraj;
  wedgeSpin: WedgeSpin;
  wedgeShaftPref: WedgeShaftPref;
}) {
  const bounce = pickBounceBand(input.wedgeTurf, input.wedgeMiss);
  const grind = pickGrindBias(bounce, input.wedgeUse);
  const gapping = pickGappingPlan(input.wedgeUse, input.wedgeTrajectory, input.wedgeSpin);

  const baseWeight = input.ironWeightRangeLabel ?? baseWedgeWeightFromSevenIronSpeed(input.sevenIronSpeedMph);

  const wantsHeavier =
    input.wedgeShaftPref === "slightly_heavier" ||
    input.focusGoal === "accuracy" ||
    input.wedgeUse === "mostly_full";

  const weightRange = wantsHeavier ? addTenGramsLabel(baseWeight) : baseWeight;

  const flexDirection =
    input.sevenIronSpeedMph >= 90
      ? "X / X-stable feel (directional)"
      : input.sevenIronSpeedMph >= 80
      ? "Stiff feel (directional)"
      : "Regular/Stiff border (directional)";

  let score = 78;
  if (input.wedgeTurf === "unsure") score -= 4;
  if (input.wedgeMiss === "unsure") score -= 4;
  if (input.wedgeShaftPref === "unknown") score -= 2;
  if (input.constraint !== "none") score -= 2;
  score = Math.max(55, Math.min(92, score));

  const buildNotes: string[] = [];
  buildNotes.push(
    wantsHeavier ? "Shaft: slightly heavier than irons for tempo + strike control." : "Shaft: match iron feel for consistency."
  );
  if (input.constraint === "elbow" || input.constraint === "shoulder_back") {
    buildNotes.push("Comfort bias: avoid extreme swingweight/heavy builds that aggravate discomfort.");
  }
  if (input.wedgeTrajectory === "lower") buildNotes.push("Flight bias: keep launch down — avoid overly high launching wedge profiles.");
  if (input.wedgeTrajectory === "higher") buildNotes.push("Flight bias: allow height — ensure you have a loft option that lands softly.");

  return {
    fitScore: score,
    profile: {
      weightRange,
      flex: flexDirection,
      bounce,
      grind,
      gappingTitle: gapping.planTitle,
      gappingBullets: gapping.bullets,
    },
    buildNotes,
    constraintNote:
      input.constraint !== "none"
        ? "Constraint noted: recommendations are biased away from overly heavy/harsh wedge builds."
        : "",
  };
}

/* ---------------- RESULTS ---------------- */

function computeResults(a: Answers) {
  const focus = a.fitFocus;

  const driverSpeed = estimateDriverSpeed(a);
  const sevenIronSpeed = estimateSevenIronSpeed(a);

  // Driver mapping
  const driverPrimaryFix =
    a.driverMiss === "slice" ? "slice" : a.driverMiss === "hook" ? "hook" : "dispersion";

  const driverTempo =
    a.driverTempo === "smooth" ? "smooth" : a.driverTempo === "quick" ? "aggressive" : "moderate";

  const driverTransition =
    a.driverTempo === "smooth" ? "gradual" : a.driverTempo === "quick" ? "quick" : "quick";

  const driverStrike =
    a.driverStrike === "heel"
      ? "heel"
      : a.driverStrike === "toe"
      ? "toe"
      : a.driverStrike === "center"
      ? "center"
      : "unknown";

  const driverLaunchFeel = a.driverFlight === "low" ? "low" : a.driverFlight === "high" ? "high" : "mid";
  const driverShaftNow = driverShaftBucketToNumber(a.driverShaftWeightNow);

  // Iron mapping
  const ironTempo =
    a.ironTempo === "smooth" ? "smooth" : a.ironTempo === "quick" ? "aggressive" : "moderate";

  const ironTransition =
    a.ironTempo === "smooth" ? "gradual" : a.ironTempo === "quick" ? "quick" : "quick";

  const ironStrike =
    a.ironStrike === "thin"
      ? "thin"
      : a.ironStrike === "fat"
      ? "fat"
      : a.ironStrike === "center"
      ? "center"
      : "unknown";

  const ironPeakFeel = a.ironPeak === "low" ? "low" : a.ironPeak === "high" ? "high" : "mid";

  const ironPrimaryFix =
    a.ironMiss === "short" || a.ironMiss === "long" ? "distanceLoss" : "dispersion";

  const ironFatigue =
    a.ironFatigue === "none"
      ? "none"
      : a.ironFatigue === "some"
      ? "some"
      : a.ironFatigue === "aLot"
      ? "aLot"
      : "unknown";

  const ironShaftNow = ironShaftBucketToNumber(a.ironShaftWeightNow);

  const driverRec =
    focus === "driver_woods" || focus === "full_bag"
      ? recommendDriverWoods({
          clubType: "driverWoods",
          primaryFix: driverPrimaryFix,
          speedMph: driverSpeed,
          tempo: driverTempo,
          transition: driverTransition,
          strike: driverStrike,
          currentShaftWeightG: driverShaftNow,
          currentFlex: "unknown",
          launchFeel: driverLaunchFeel,
        } as any)
      : null;

  const woodsProfile = driverRec
    ? {
        weightRange: addTenGramsLabel(driverRec.profile.weightRange),
        flex: driverRec.profile.flex,
        torqueRange: driverRec.profile.torqueRange ?? "—",
        launchBias: driverRec.profile.launchBias,
        balanceBias: driverRec.profile.balanceBias,
      }
    : null;

  const ironRec =
    focus === "irons" || focus === "full_bag"
      ? recommendIrons({
          clubType: "irons",
          primaryFix: ironPrimaryFix,
          sixIronSpeedMph: sevenIronSpeed + 4,
          tempo: ironTempo,
          transition: ironTransition,
          strike: ironStrike,
          fatigue: ironFatigue,
          currentShaftWeightG: ironShaftNow,
          currentFlex: "unknown",
          peakHeightFeel: ironPeakFeel,
        } as any)
      : null;

  const wedgeRec =
    focus === "wedges" || focus === "full_bag"
      ? recommendWedgesDeterministic({
          focusGoal: a.goal,
          constraint: a.constraint,
          sevenIronSpeedMph: sevenIronSpeed,
          ironWeightRangeLabel: ironRec?.profile?.weightRange,
          wedgeUse: a.wedgeUse,
          wedgeTurf: a.wedgeTurf,
          wedgeMiss: a.wedgeMiss,
          wedgeTrajectory: a.wedgeTrajectory,
          wedgeSpin: a.wedgeSpin,
          wedgeShaftPref: a.wedgeShaftPref,
        })
      : null;

  const why: string[] = [];
  why.push("Driver/Woods, irons, and wedges are evaluated separately (different jobs, different profiles).");
  if (driverRec) why.push(`Driver + Woods Fit Score: ${driverRec.fitScore}% (woods derived with +10g rule).`);
  if (ironRec) why.push(`Iron Fit Score: ${ironRec.fitScore}% (based on iron-specific inputs).`);
  if (wedgeRec) why.push(`Wedge Fit Score: ${wedgeRec.fitScore}% (based on turf interaction + miss + use pattern).`);
  why.push("Equipment fit reduces penalties, but long-term ceiling is driven by face control + strike consistency.");

  return {
    focus,
    driverSpeedEstimate: Math.round(driverSpeed),
    sevenIronSpeedEstimate: Math.round(sevenIronSpeed),

    driver: driverRec
      ? {
          fitScore: driverRec.fitScore as number,
          shaft: {
            weight: driverRec.profile.weightRange,
            flex: driverRec.profile.flex,
            profile: `Launch ${driverRec.profile.launchBias} • Torque ${driverRec.profile.torqueRange} • Balance ${driverRec.profile.balanceBias}`,
          },
          settings: (driverRec.adjustmentGuide ?? []) as string[],
          note: driverRec.constraintNote as string,
        }
      : null,

    woods: woodsProfile
      ? {
          fitScore: Math.max(40, Math.min(95, (driverRec?.fitScore ?? 80) - 3)),
          shaft: {
            weight: woodsProfile.weightRange,
            flex: woodsProfile.flex,
            profile: `Launch ${woodsProfile.launchBias} • Torque ${woodsProfile.torqueRange} • Balance ${woodsProfile.balanceBias}`,
          },
          note: "Woods: baseline rule is ~+10g vs driver for control and consistent strike.",
        }
      : null,

    irons: ironRec
      ? {
          fitScore: ironRec.fitScore as number,
          shaft: {
            weight: ironRec.profile.weightRange,
            flex: ironRec.profile.flex,
            profile: `Launch ${ironRec.profile.launchBias} • Balance ${ironRec.profile.balanceBias} • Material ${ironRec.profile.materialBias ?? "—"}`,
          },
          headBias: ironRec.profile.headBias ?? "Neutral head bias",
          note: ironRec.constraintNote as string,
        }
      : null,

    wedges: wedgeRec
      ? {
          fitScore: wedgeRec.fitScore,
          shaft: {
            weight: wedgeRec.profile.weightRange,
            flex: wedgeRec.profile.flex,
            profile: `Bounce ${wedgeRec.profile.bounce} • Grind ${wedgeRec.profile.grind}`,
          },
          gappingTitle: wedgeRec.profile.gappingTitle,
          gappingBullets: wedgeRec.profile.gappingBullets,
          buildNotes: wedgeRec.buildNotes,
          note: wedgeRec.constraintNote,
        }
      : null,

    why,
  };
}

export default function DiagnosticWizard() {
  const [a, setA] = useState<Answers>(DEFAULT_ANSWERS);

  const steps = useMemo(() => buildSteps(a.fitFocus), [a.fitFocus]);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] ?? "focus";

  const [isVerified, setIsVerified] = useState(false);
  const [pendingJumpToResults, setPendingJumpToResults] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lead_verified");
      if (saved === "1") setIsVerified(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);

      const verified = url.searchParams.get("verified") === "1";
      const wantsResults = url.searchParams.get("step") === "results";

      if (verified) {
        setIsVerified(true);
        window.localStorage.setItem("lead_verified", "1");
      }

      if (verified || wantsResults) {
        const savedPayload = window.localStorage.getItem("diagnostic_last_payload");
        if (savedPayload) {
          try {
            const parsed = JSON.parse(savedPayload);
            setA(parsed);
          } catch {
            // ignore bad JSON
          }
        }

        setPendingJumpToResults(true);

        url.searchParams.delete("step");
        url.searchParams.delete("verified");
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!pendingJumpToResults) return;
    const s = buildSteps(a.fitFocus);
    setStepIndex(s.length - 1);
    setPendingJumpToResults(false);
  }, [pendingJumpToResults, a.fitFocus]);

  useEffect(() => {
    setStepIndex((i) => Math.min(i, steps.length - 1));
  }, [steps.length]);

  const result = useMemo(() => computeResults(a), [a]);
  const progress = Math.round((stepIndex / (steps.length - 1)) * 100);
  const isFirst = stepIndex === 0;

  function back() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }

  function resetAll() {
    setA(DEFAULT_ANSWERS);
    setStepIndex(0);
  }

  const meta = step !== "results" ? stepMeta(step) : null;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex items-center justify-between">
          <a className="text-sm text-slate-500 hover:text-slate-900" href="/">
            ← Home
          </a>
          <span className="text-xs font-medium text-slate-500">Free Diagnostic</span>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Step {Math.min(stepIndex + 1, steps.length)} of {steps.length}
          </div>
        </div>

        {/* Card */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          {step !== "results" ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">{meta?.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{meta?.why}</p>

              <div className="mt-8">
                {step === "focus" && (
                  <ChoiceChips
                    value={a.fitFocus}
                    onChange={(v) => {
                      setA((p) => ({ ...p, fitFocus: v }));
                      setStepIndex(1);
                    }}
                    options={[
                      ["driver_woods", "Driver + Woods"],
                      ["irons", "Irons"],
                      ["wedges", "Wedges"],
                      ["full_bag", "Full bag"],
                    ]}
                  />
                )}

                {step === "handicap" && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Handicap</label>
                    <input
                      type="range"
                      min={0}
                      max={4}
                      value={a.handicapBand}
                      onChange={(e) =>
                        setA((p) => ({
                          ...p,
                          handicapBand: Number(e.target.value) as Answers["handicapBand"],
                        }))
                      }
                      className="mt-3 w-full"
                    />
                    <p className="mt-2 text-sm text-slate-700">{handicapLabel(a.handicapBand)}</p>
                  </div>
                )}

                {step === "play" && (
                  <ChoiceChips
                    value={a.playFreq}
                    onChange={(v) => setA((p) => ({ ...p, playFreq: v }))}
                    options={[
                      ["monthly", "1–2x/month"],
                      ["weekly", "1x/week"],
                      ["twice_weekly", "2x/week"],
                      ["three_plus", "3+ / week"],
                      ["range_only", "Range only"],
                    ]}
                  />
                )}

                {step === "goal" && (
                  <ChoiceChips
                    value={a.goal}
                    onChange={(v) => setA((p) => ({ ...p, goal: v }))}
                    options={[
                      ["distance", "More distance"],
                      ["accuracy", "More fairways"],
                      ["higher_launch", "Higher launch"],
                      ["reduce_spin", "Reduce spin"],
                      ["feel", "Better feel"],
                    ]}
                  />
                )}

                {step === "constraints" && (
                  <ChoiceChips
                    value={a.constraint}
                    onChange={(v) => setA((p) => ({ ...p, constraint: v }))}
                    options={[
                      ["none", "None"],
                      ["elbow", "Elbow pain"],
                      ["shoulder_back", "Shoulder/Back"],
                      ["prefer_lighter", "Prefer lighter feel"],
                    ]}
                  />
                )}

                {/* Driver steps */}
                {step === "driver_speed" && (
                  <div className="space-y-5">
                    <ChoiceChips
                      value={a.knowDriverSpeed}
                      onChange={(v) =>
                        setA((p) => ({
                          ...p,
                          knowDriverSpeed: v,
                          driverSpeed: v === "yes" ? p.driverSpeed ?? 95 : undefined,
                          driverCarry: v === "no" ? p.driverCarry ?? 220 : undefined,
                        }))
                      }
                      options={[
                        ["yes", "I know my speed"],
                        ["no", "I don’t know"],
                      ]}
                    />

                    {a.knowDriverSpeed === "yes" ? (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Driver speed (mph)</label>
                        <input
                          type="range"
                          min={70}
                          max={125}
                          value={a.driverSpeed ?? 95}
                          onChange={(e) => setA((p) => ({ ...p, driverSpeed: Number(e.target.value) }))}
                          className="mt-3 w-full"
                        />
                        <p className="mt-2 text-sm text-slate-700">{a.driverSpeed ?? 95} mph</p>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Approx driver carry (yards)</label>
                        <input
                          type="range"
                          min={160}
                          max={290}
                          step={5}
                          value={a.driverCarry ?? 220}
                          onChange={(e) => setA((p) => ({ ...p, driverCarry: Number(e.target.value) }))}
                          className="mt-3 w-full"
                        />
                        <p className="mt-2 text-sm text-slate-700">{a.driverCarry ?? 220} yds</p>
                      </div>
                    )}
                  </div>
                )}

                {step === "driver_miss" && (
                  <ChoiceChips
                    value={a.driverMiss}
                    onChange={(v) => setA((p) => ({ ...p, driverMiss: v }))}
                    options={[
                      ["slice", "Slice"],
                      ["hook", "Hook"],
                      ["push", "Push"],
                      ["pull", "Pull"],
                      ["both", "Both sides"],
                    ]}
                  />
                )}

                {step === "driver_flight" && (
                  <ChoiceChips
                    value={a.driverFlight}
                    onChange={(v) => setA((p) => ({ ...p, driverFlight: v }))}
                    options={[
                      ["low", "Low"],
                      ["mid", "Mid"],
                      ["high", "High"],
                    ]}
                  />
                )}

                {step === "driver_strike" && (
                  <ChoiceChips
                    value={a.driverStrike}
                    onChange={(v) => setA((p) => ({ ...p, driverStrike: v }))}
                    options={[
                      ["heel", "Heel"],
                      ["center", "Center"],
                      ["toe", "Toe"],
                      ["all_over", "All over"],
                    ]}
                  />
                )}

                {step === "driver_tempo" && (
                  <ChoiceChips
                    value={a.driverTempo}
                    onChange={(v) => setA((p) => ({ ...p, driverTempo: v }))}
                    options={[
                      ["smooth", "Smooth"],
                      ["neutral", "Medium"],
                      ["quick", "Quick from the top"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "driver_shaftnow" && (
                  <ChoiceChips
                    value={a.driverShaftWeightNow}
                    onChange={(v) => setA((p) => ({ ...p, driverShaftWeightNow: v }))}
                    options={[
                      ["dont_know", "Don’t know"],
                      ["lt_55", "<55g"],
                      ["55_65", "55–65g"],
                      ["65_75", "65–75g"],
                      ["75_plus", "75g+"],
                    ]}
                  />
                )}

                {/* Iron steps */}
                {step === "iron_speed" && (
                  <div className="space-y-5">
                    <ChoiceChips
                      value={a.knowIron}
                      onChange={(v) =>
                        setA((p) => ({
                          ...p,
                          knowIron: v,
                          sevenIronSpeed: v === "yes" ? p.sevenIronSpeed ?? 84 : undefined,
                          sevenIronCarry: v === "no" ? p.sevenIronCarry ?? 145 : undefined,
                        }))
                      }
                      options={[
                        ["yes", "I know my 7-iron speed"],
                        ["no", "I don’t know (use carry)"],
                      ]}
                    />

                    {a.knowIron === "yes" ? (
                      <div>
                        <label className="text-sm font-medium text-slate-700">7-iron speed (mph)</label>
                        <input
                          type="range"
                          min={60}
                          max={105}
                          value={a.sevenIronSpeed ?? 84}
                          onChange={(e) => setA((p) => ({ ...p, sevenIronSpeed: Number(e.target.value) }))}
                          className="mt-3 w-full"
                        />
                        <p className="mt-2 text-sm text-slate-700">{a.sevenIronSpeed ?? 84} mph</p>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Approx 7-iron carry (yards)</label>
                        <input
                          type="range"
                          min={100}
                          max={190}
                          step={5}
                          value={a.sevenIronCarry ?? 145}
                          onChange={(e) => setA((p) => ({ ...p, sevenIronCarry: Number(e.target.value) }))}
                          className="mt-3 w-full"
                        />
                        <p className="mt-2 text-sm text-slate-700">{a.sevenIronCarry ?? 145} yds</p>
                      </div>
                    )}
                  </div>
                )}

                {step === "iron_miss" && (
                  <ChoiceChips
                    value={a.ironMiss}
                    onChange={(v) => setA((p) => ({ ...p, ironMiss: v }))}
                    options={[
                      ["push", "Push / right"],
                      ["pull", "Pull / left"],
                      ["short", "Short / not reaching target"],
                      ["long", "Long / flying too far"],
                      ["both", "Both sides"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "iron_peak" && (
                  <ChoiceChips
                    value={a.ironPeak}
                    onChange={(v) => setA((p) => ({ ...p, ironPeak: v }))}
                    options={[
                      ["low", "Low"],
                      ["mid", "Mid"],
                      ["high", "High"],
                    ]}
                  />
                )}

                {step === "iron_strike" && (
                  <ChoiceChips
                    value={a.ironStrike}
                    onChange={(v) => setA((p) => ({ ...p, ironStrike: v }))}
                    options={[
                      ["thin", "Thin"],
                      ["fat", "Fat"],
                      ["center", "Center"],
                      ["all_over", "All over"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "iron_fatigue" && (
                  <ChoiceChips
                    value={a.ironFatigue}
                    onChange={(v) => setA((p) => ({ ...p, ironFatigue: v }))}
                    options={[
                      ["none", "No fatigue"],
                      ["some", "Some fatigue"],
                      ["aLot", "A lot (arms/back/shoulders)"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "iron_tempo" && (
                  <ChoiceChips
                    value={a.ironTempo}
                    onChange={(v) => setA((p) => ({ ...p, ironTempo: v }))}
                    options={[
                      ["smooth", "Smooth"],
                      ["neutral", "Medium"],
                      ["quick", "Quick from the top"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "iron_shaftnow" && (
                  <ChoiceChips
                    value={a.ironShaftWeightNow}
                    onChange={(v) => setA((p) => ({ ...p, ironShaftWeightNow: v }))}
                    options={[
                      ["dont_know", "Don’t know"],
                      ["85_95", "85–95g"],
                      ["95_105", "95–105g"],
                      ["105_120", "105–120g"],
                      ["120_plus", "120g+"],
                    ]}
                  />
                )}

                {/* Wedge steps */}
                {step === "wedge_use" && (
                  <ChoiceChips
                    value={a.wedgeUse}
                    onChange={(v) => setA((p) => ({ ...p, wedgeUse: v }))}
                    options={[
                      ["mostly_full", "Mostly full shots (approach wedges)"],
                      ["mixed", "Mixed (full + partial + chips)"],
                      ["mostly_greenside", "Mostly around the green"],
                    ]}
                  />
                )}

                {step === "wedge_turf" && (
                  <ChoiceChips
                    value={a.wedgeTurf}
                    onChange={(v) => setA((p) => ({ ...p, wedgeTurf: v }))}
                    options={[
                      ["digger", "Digger (deep divots)"],
                      ["neutral", "Neutral"],
                      ["sweeper", "Sweeper (shallow)"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "wedge_miss" && (
                  <ChoiceChips
                    value={a.wedgeMiss}
                    onChange={(v) => setA((p) => ({ ...p, wedgeMiss: v }))}
                    options={[
                      ["fat", "Fat"],
                      ["thin", "Thin"],
                      ["both", "Both"],
                      ["unsure", "Not sure"],
                    ]}
                  />
                )}

                {step === "wedge_traj" && (
                  <ChoiceChips
                    value={a.wedgeTrajectory}
                    onChange={(v) => setA((p) => ({ ...p, wedgeTrajectory: v }))}
                    options={[
                      ["lower", "Lower flight"],
                      ["neutral", "Neutral"],
                      ["higher", "Higher flight"],
                    ]}
                  />
                )}

                {step === "wedge_spin" && (
                  <ChoiceChips
                    value={a.wedgeSpin}
                    onChange={(v) => setA((p) => ({ ...p, wedgeSpin: v }))}
                    options={[
                      ["more_check", "More check (stop faster)"],
                      ["balanced", "Balanced"],
                      ["more_release", "More release (rollout)"],
                    ]}
                  />
                )}

                {step === "wedge_shaftpref" && (
                  <ChoiceChips
                    value={a.wedgeShaftPref}
                    onChange={(v) => setA((p) => ({ ...p, wedgeShaftPref: v }))}
                    options={[
                      ["match_irons", "Match irons"],
                      ["slightly_heavier", "Slightly heavier for control"],
                      ["unknown", "Not sure"],
                    ]}
                  />
                )}
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={isFirst}
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-900 disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="ml-auto rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Your fit summary</h1>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {(result.focus === "driver_woods" || result.focus === "full_bag") && (
                  <div>
                    Estimated driver speed:{" "}
                    <span className="font-medium text-slate-900">{result.driverSpeedEstimate} mph</span>
                  </div>
                )}
                {(result.focus === "irons" || result.focus === "full_bag" || result.focus === "wedges") && (
                  <div>
                    Estimated 7-iron speed:{" "}
                    <span className="font-medium text-slate-900">{result.sevenIronSpeedEstimate} mph</span>
                  </div>
                )}
              </div>

              {isVerified && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-sm font-semibold text-emerald-900">✅ Email verified</div>
                  <div className="mt-1 text-sm text-emerald-800">Premium insights are now unlocked.</div>
                </div>
              )}

              <div className="mt-8 grid gap-4">
                {!isVerified && <EmailCaptureCard payload={a} />}

                {(result.driver || result.woods) && (
                  <Card title="Driver / Woods (separate profiles)">
                    <div className="grid gap-4">
                      {result.driver && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="text-sm font-semibold text-slate-900">Driver</div>
                          <div className="mt-3 space-y-2">
                            <Line label="Fit Score" value={`${result.driver.fitScore}%`} />
                            <Line label="Weight range" value={result.driver.shaft.weight} />
                            <Line label="Flex" value={result.driver.shaft.flex} />
                            <Line label="Profile bias" value={result.driver.shaft.profile} />
                          </div>

                          {result.driver.note && <p className="mt-3 text-xs text-slate-500">{result.driver.note}</p>}

                          <div className="mt-4">
                            <div className="text-sm font-semibold text-slate-900">Start here: settings guide</div>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                              {(result.driver.settings ?? []).map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {result.woods && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="text-sm font-semibold text-slate-900">Fairway Woods</div>
                          <div className="mt-3 space-y-2">
                            <Line label="Fit Score" value={`${result.woods.fitScore}%`} />
                            <Line label="Weight range" value={result.woods.shaft.weight} />
                            <Line label="Flex" value={result.woods.shaft.flex} />
                            <Line label="Profile bias" value={result.woods.shaft.profile} />
                          </div>
                          <p className="mt-3 text-xs text-slate-500">{result.woods.note}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {result.irons && (
                  <Card title="Irons (separate profile)">
                    <Line label="Fit Score" value={`${result.irons.fitScore}%`} />
                    <Line label="Weight range" value={result.irons.shaft.weight} />
                    <Line label="Flex" value={result.irons.shaft.flex} />
                    <Line label="Profile bias" value={result.irons.shaft.profile} />
                    <div className="pt-2">
                      <Line label="Head bias" value={result.irons.headBias} />
                    </div>
                    {result.irons.note && <p className="pt-2 text-xs text-slate-500">{result.irons.note}</p>}
                  </Card>
                )}

                {result.wedges && (
                  <Card title="Wedges (separate profile)">
                    <Line label="Fit Score" value={`${result.wedges.fitScore}%`} />
                    <Line label="Weight range" value={result.wedges.shaft.weight} />
                    <Line label="Flex feel" value={result.wedges.shaft.flex} />
                    <Line label="Bounce / grind" value={result.wedges.shaft.profile} />

                    <div className="pt-3">
                      <div className="text-sm font-semibold text-slate-900">{result.wedges.gappingTitle}</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {(result.wedges.gappingBullets ?? []).map((x: string, i: number) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3">
                      <div className="text-sm font-semibold text-slate-900">Build notes</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {(result.wedges.buildNotes ?? []).map((x: string, i: number) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>

                    {result.wedges.note && <p className="pt-2 text-xs text-slate-500">{result.wedges.note}</p>}
                  </Card>
                )}

                <Card title="Why these recommendations">
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {(result.why ?? []).map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </Card>

                {isVerified && (
                  <Card title="How to interpret and apply your results (fitter-grade)">
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                      <li>
                        <span className="font-medium text-slate-900">Treat weight as the primary constraint.</span>{" "}
                        Weight is the biggest lever for sequencing, strike quality, and dispersion stability. Stay inside
                        the band first. Only then tune flex/profile.
                      </li>
                      <li>
                        <span className="font-medium text-slate-900">Flex labels are not standardized.</span>{" "}
                        “Stiff/X” varies widely. What matters is delivered dynamic loft/closure under your transition. If
                        you’re between bands, test both and compare strike + start-line control.
                      </li>
                      <li>
                        <span className="font-medium text-slate-900">Use stability/torque direction to manage face closure.</span>{" "}
                        If you fight left (hooks/pulls), favor lower torque + tip-stable profiles. If you fight right
                        (slices/pushes), stability still matters—but don’t over-stiffen into an open-face delivery.
                      </li>
                      <li>
                        <span className="font-medium text-slate-900">Profile (EI) is the “timing” lever.</span>{" "}
                        Tip-stiff tends to lower launch/spin and reduce left bias; softer tips can help players who need
                        help launching or who deliver too little dynamic loft. Match profile to your flight window and
                        transition violence.
                      </li>
                      <li>
                        <span className="font-medium text-slate-900">Validate with a controlled test protocol.</span>{" "}
                        Test 2–3 shafts in the same head at the same length/swingweight. Hit 8–12 shots per build across
                        multiple sessions. Judge <span className="font-medium">dispersion + strike</span> first, then
                        launch/spin.
                      </li>
                      <li>
                        <span className="font-medium text-slate-900">Keep swingweight/length changes deliberate.</span>{" "}
                        Length and swingweight can override a shaft recommendation. If you change length, re-check
                        strike pattern and start line before making conclusions about “shaft fit.”
                      </li>
                    </ul>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-semibold text-slate-900">Buying path (fast + low risk)</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        <li>
                          Pick <span className="font-medium">one head</span> you like (forgiveness/shape/launch) and test
                          shafts inside your band.
                        </li>
                        <li>
                          Prioritize builds that tighten{" "}
                          <span className="font-medium">start line + curvature</span> before chasing max ball speed.
                        </li>
                        <li>
                          If buying used, match <span className="font-medium">weight + profile family</span> first; flex
                          is secondary.
                        </li>
                      </ul>
                    </div>
                  </Card>
                )}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-medium"
                >
                  Start over
                </button>

                <a
                  href="/"
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-center text-sm font-medium text-white hover:bg-slate-800"
                >
                  Back to home
                </a>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function ChoiceChips<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map(([v, label]) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={[
              "rounded-2xl border px-4 py-4 text-left transition",
              active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
            ].join(" ")}
          >
            <div className="text-sm font-medium">{label}</div>
          </button>
        );
      })}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-sm font-medium text-slate-900 text-right">{value}</div>
    </div>
  );
}
