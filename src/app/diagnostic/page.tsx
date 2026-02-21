"use client";

import React, { useEffect, useMemo, useState } from "react";
import EmailCaptureCard from "./EmailCaptureCard";

import { recommendDriverWoods } from "@/lib/engine/driver";
import { recommendIrons } from "@/lib/engine/irons";

const SHARE_CARD_WIDTH = 1080;
const SHARE_CARD_HEIGHT = 1350;
const SHARE_CARD_PADDING = 64;

/* ---------------- TYPES ---------------- */

type FitFocus = "driver_woods" | "irons" | "wedges" | "full_bag";

type PlayFreq = "monthly" | "weekly" | "twice_weekly" | "three_plus" | "range_only";

type Goal = "distance" | "accuracy" | "higher_launch" | "reduce_spin" | "feel";

type Tempo = "smooth" | "neutral" | "quick" | "unsure";
type Constraint = "none" | "elbow" | "shoulder_back" | "prefer_lighter";

// Shared flight model
type StartLine = "left" | "center" | "right" | "unsure";
type Curve = "draw" | "straight" | "fade" | "unsure";

// Driver-specific
type KnowSpeed = "yes" | "no";
type Flight = "low" | "mid" | "high";
type DriverStrike = "heel" | "center" | "toe" | "all_over";
type ShaftWeightNow = "dont_know" | "lt_55" | "55_65" | "65_75" | "75_plus";

// Iron-specific
type IronKnow = "yes" | "no";
type Fatigue = "none" | "some" | "aLot" | "unsure";
type Peak = "low" | "mid" | "high";
type IronFaceStrike = "heel" | "center" | "toe" | "mixed" | "unsure";
type IronLowPoint = "ball_first" | "shallow" | "fat" | "thin" | "unsure";

// Wedge-specific
type WedgeUse = "mostly_full" | "mixed" | "mostly_greenside";
type Turf = "digger" | "neutral" | "sweeper" | "unsure";
type WedgeMiss = "fat" | "thin" | "both" | "unsure";
type WedgeTraj = "lower" | "neutral" | "higher";
type WedgeSpin = "more_check" | "balanced" | "more_release" | "unsure";
type WedgeShaftPref = "match_irons" | "slightly_heavier" | "unknown";

type Answers = {
  // Focus + shared
  fitFocus: FitFocus;
  handicapBand: 0 | 1 | 2 | 3 | 4;
  playFreq: PlayFreq;
  goals: Goal[]; // max 2
  constraint: Constraint;

  // Driver/Woods
  knowDriverSpeed: KnowSpeed;
  driverSpeed?: number; // mph
  driverCarry?: number; // yards
  driverStartLine: StartLine;
  driverCurve: Curve;
  driverFlight: Flight;
  driverStrike: DriverStrike;
  driverTempo: Tempo;
  driverShaftWeightNow: ShaftWeightNow;

  // Irons
  knowIron: IronKnow;
  sevenIronSpeed?: number; // mph
  sevenIronCarry?: number; // yards
  ironStartLine: StartLine;
  ironCurve: Curve;
  ironPeak: Peak;
  ironLowPoint: IronLowPoint;
  ironFaceStrike: IronFaceStrike;
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
  | "goals"
  | "constraints"
  // Driver/Woods steps
  | "driver_speed"
  | "driver_startline"
  | "driver_curve"
  | "driver_flight"
  | "driver_strike"
  | "driver_tempo"
  | "driver_shaftnow"
  // Iron steps
  | "iron_speed"
  | "iron_startline"
  | "iron_curve"
  | "iron_peak"
  | "iron_lowpoint"
  | "iron_facestrike"
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
  goals: ["accuracy"],
  constraint: "none",

  knowDriverSpeed: "no",
  driverCarry: 220,
  driverStartLine: "unsure",
  driverCurve: "unsure",
  driverFlight: "mid",
  driverStrike: "all_over",
  driverTempo: "neutral",
  driverShaftWeightNow: "dont_know",

  knowIron: "no",
  sevenIronCarry: 145,
  ironStartLine: "unsure",
  ironCurve: "unsure",
  ironPeak: "mid",
  ironLowPoint: "unsure",
  ironFaceStrike: "unsure",
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
  const base: Step[] = ["focus", "handicap", "play", "goals", "constraints"];

  const driver: Step[] = [
    "driver_speed",
    "driver_startline",
    "driver_curve",
    "driver_strike",
    "driver_flight",
    "driver_tempo",
    "driver_shaftnow",
  ];

  const irons: Step[] = [
    "iron_speed",
    "iron_startline",
    "iron_curve",
    "iron_peak",
    "iron_lowpoint",
    "iron_facestrike",
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

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
}

function buildCertificateId(a: Answers, result: ReturnType<typeof computeResults>) {
  const raw = JSON.stringify({
    focus: result.focus,
    goals: a.goals,
    driverStartLine: a.driverStartLine,
    driverCurve: a.driverCurve,
    ironStartLine: a.ironStartLine,
    ironCurve: a.ironCurve,
    confidence: result.confidence,
    driverFit: result.driver?.fitScore,
    ironFit: result.irons?.fitScore,
    wedgeFit: result.wedges?.fitScore,
  });
  const n = hashString(raw).toString(36).toUpperCase().padStart(6, "0");
  return `DG-${n.slice(0, 4)}-${n.slice(4, 6)}`;
}

function computeAlignmentScore(result: ReturnType<typeof computeResults>) {
  const scores = [result.driver?.fitScore, result.irons?.fitScore, result.wedges?.fitScore].filter(
    (v): v is number => typeof v === "number"
  );
  if (!scores.length) return result.confidence;
  return Math.round(scores.reduce((acc, n) => acc + n, 0) / scores.length);
}


function buildInlineQrSvg(data: string, size: number) {
  const cells = 29;
  const quietZone = 2;
  const moduleSize = Math.floor(size / (cells + quietZone * 2));
  const offset = Math.floor((size - moduleSize * (cells + quietZone * 2)) / 2);

  function hashAt(x: number, y: number) {
    const seed = `${data}:${x}:${y}`;
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return (h >>> 0) % 2 === 0;
  }

  const isFinder = (x: number, y: number, ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;

  const rects: string[] = [];
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      const inTopLeft = isFinder(x, y, 0, 0);
      const inTopRight = isFinder(x, y, cells - 7, 0);
      const inBottomLeft = isFinder(x, y, 0, cells - 7);

      let dark = false;
      if (inTopLeft || inTopRight || inBottomLeft) {
        const fx = inTopRight ? x - (cells - 7) : x;
        const fy = inBottomLeft ? y - (cells - 7) : y;
        const border = fx === 0 || fy === 0 || fx === 6 || fy === 6;
        const center = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
        dark = border || center;
      } else {
        dark = hashAt(x, y);
      }

      if (dark) {
        rects.push(`<rect x="${offset + (x + quietZone) * moduleSize}" y="${offset + (y + quietZone) * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#0f172a"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#fff"/>${rects.join("")}</svg>`;
}

/* ---------------- SPEED ESTIMATORS ---------------- */

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

/* ---------------- STEP META ---------------- */

function stepMeta(step: Step) {
  const map: Record<Exclude<Step, "results">, { title: string; why: string }> = {
    focus: { title: "What are you fitting today?", why: "We’ll ask only category-specific questions and generate separate profiles." },
    handicap: { title: "What’s your handicap range?", why: "Helps calibrate how aggressive we should be with fit precision." },
    play: { title: "How often do you play?", why: "Frequent players benefit from tighter fits; occasional players need more forgiveness." },
    goals: { title: "What’s your goal right now?", why: "Select up to 2 priorities. We’ll bias the fit accordingly." },
    constraints: { title: "Any physical constraints?", why: "We bias away from builds likely to aggravate discomfort." },

    driver_speed: { title: "Driver speed", why: "Sets the baseline for driver/woods shaft weight + flex." },
    driver_startline: { title: "Driver start line", why: "Start line is the cleanest signal for face control at impact." },
    driver_curve: { title: "Driver curve", why: "Curve helps separate face vs path influence (and guides stability bias)." },
    driver_flight: { title: "Typical DRIVER flight", why: "Guides launch/spin directionally." },
    driver_strike: { title: "DRIVER strike location", why: "Strike location influences forgiveness and spin." },
    driver_tempo: { title: "DRIVER transition feel", why: "Transition influences stability needs." },
    driver_shaftnow: { title: "Current DRIVER shaft weight", why: "Anchors recommendations to what you’re used to." },

    iron_speed: { title: "7-iron speed (or carry)", why: "Irons need their own speed proxy—driver speed doesn’t translate cleanly." },
    iron_startline: { title: "Iron start line", why: "Start line reveals face control tendencies with irons." },
    iron_curve: { title: "Iron curve", why: "Curve helps us understand your face-to-path pattern for iron stability bias." },
    iron_peak: { title: "Typical IRON peak height", why: "Peak height guides launch and profile direction." },
    iron_lowpoint: { title: "Iron low point control", why: "Low point is one of the biggest drivers of consistent contact and distance." },
    iron_facestrike: { title: "Iron face strike location", why: "Heel/toe strike affects ball speed, start line, and consistency." },
    iron_fatigue: { title: "Fatigue with irons", why: "Total weight/material should respect fatigue." },
    iron_tempo: { title: "IRON transition feel", why: "Iron transition can differ from driver; treat separately." },
    iron_shaftnow: { title: "Current IRON shaft weight", why: "Anchors recommendations to your current feel." },

    wedge_use: { title: "How do you use your wedges most?", why: "Determines whether we bias gapping for full shots vs greenside versatility." },
    wedge_turf: { title: "Turf interaction (digger vs sweeper)", why: "Primary driver of bounce/sole direction and how the club enters/exits the turf." },
    wedge_miss: { title: "Typical wedge miss", why: "Fat/thin patterns correlate with bounce/sole needs and strike stability." },
    wedge_traj: { title: "Preferred wedge trajectory", why: "Helps bias loft/gapping direction and build feel for flight control." },
    wedge_spin: { title: "Preferred greenside rollout", why: "Influences loft spacing and bounce/grind direction for your typical shot style." },
    wedge_shaftpref: { title: "Wedge shaft preference", why: "Wedges often match irons, or go slightly heavier for control—this sets the bias." },
  };

  return map[step as Exclude<Step, "results">];
}

/* ---------------- GOAL BIAS ---------------- */

type Bias = {
  stability: number;
  launch: number;
  spin: number;
  anchorToCurrent: number;
  weightTolerance: number;
};

function computeGoalBias(goals: Goal[]): Bias {
  const b: Bias = { stability: 0, launch: 0, spin: 0, anchorToCurrent: 0, weightTolerance: 0 };
  for (const g of goals) {
    if (g === "accuracy") b.stability += 2;
    if (g === "reduce_spin") {
      b.spin += 2;
      b.stability += 1;
    }
    if (g === "higher_launch") b.launch += 2;
    if (g === "distance") {
      b.launch += 1;
      b.weightTolerance += 1;
    }
    if (g === "feel") b.anchorToCurrent += 2;
  }
  return b;
}

/* ---------------- BALL FLIGHT CLASSIFIER ---------------- */

function classifyFaceControl(start: StartLine, curve: Curve) {
  if (start === "unsure" || curve === "unsure") return { label: "unknown", bias: "neutral" as const };

  if (start === "right" && curve === "fade") return { label: "starts right + fades", bias: "reduceRight" as const };
  if (start === "right" && curve === "straight") return { label: "starts right (no curve)", bias: "reduceRight" as const };

  if (start === "left" && curve === "draw") return { label: "starts left + draws", bias: "reduceLeft" as const };
  if (start === "left" && curve === "straight") return { label: "starts left (no curve)", bias: "reduceLeft" as const };

  if (start === "center" && curve === "fade") return { label: "starts center + fades", bias: "stability" as const };
  if (start === "center" && curve === "draw") return { label: "starts center + draws", bias: "stability" as const };

  return { label: "neutral", bias: "neutral" as const };
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

function pickGappingPlan(use: WedgeUse, traj: WedgeTraj, spin: WedgeSpin): { planTitle: string; bullets: string[] } {
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
        traj === "lower" ? "Consider slightly stronger lofts to keep flight down" : "Consider a higher-loft lob wedge option for soft landing",
        spin === "more_release" ? "Favor a mid-loft utility wedge you can bump-and-run" : "Favor a lob wedge you can stop quickly",
      ],
    };
  }

  return {
    planTitle: "Balanced gapping (mixed use)",
    bullets: [
      "Typical plan: Gap → Sand → Lob (3 wedges), add one more gap wedge if you have room",
      "Directional example: 50–54–58 (balanced) or 52–56–60 (more loft coverage)",
      traj === "lower" ? "Leaning 50–54–58 tends to keep flight slightly down" : "Leaning 52–56–60 gives more height options around the green",
      spin === "more_check" ? "Favor loft coverage on the bottom end (lob wedge utility)" : "Favor consistent yardage gapping on the top end",
    ],
  };
}

function recommendWedgesDeterministic(input: {
  focusGoals: Goal[];
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

  const goalBias = computeGoalBias(input.focusGoals);

  const wantsHeavier =
    input.wedgeShaftPref === "slightly_heavier" ||
    goalBias.stability >= 2 ||
    input.wedgeUse === "mostly_full";

  const weightRange = wantsHeavier ? addTenGramsLabel(baseWeight) : baseWeight;

  const flexDirection =
    input.sevenIronSpeedMph >= 90
      ? "X / X-stable feel (directional)"
      : input.sevenIronSpeedMph >= 80
      ? "Stiff feel (directional)"
      : "Regular/Stiff border (directional)";

  let score = 80;
  if (input.wedgeTurf === "unsure") score -= 4;
  if (input.wedgeMiss === "unsure") score -= 4;
  if (input.wedgeShaftPref === "unknown") score -= 2;
  if (input.constraint !== "none") score -= 2;
  score = Math.max(55, Math.min(92, score));

  const buildNotes: string[] = [];
  buildNotes.push(wantsHeavier ? "Shaft: slightly heavier than irons for tempo + strike control." : "Shaft: match iron feel for consistency.");
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
      input.constraint !== "none" ? "Constraint noted: recommendations are biased away from overly heavy/harsh wedge builds." : "",
  };
}

/* ---------------- CONFIDENCE ---------------- */

function computeConfidence(a: Answers) {
  let score = 92;

  if (a.fitFocus === "driver_woods" || a.fitFocus === "full_bag") {
    if (a.knowDriverSpeed === "no" && typeof a.driverCarry !== "number") score -= 8;
    if (a.knowDriverSpeed === "yes" && typeof a.driverSpeed !== "number") score -= 8;
    if (a.driverStartLine === "unsure") score -= 5;
    if (a.driverCurve === "unsure") score -= 5;
    if (a.driverShaftWeightNow === "dont_know") score -= 3;
  }

  if (a.fitFocus === "irons" || a.fitFocus === "wedges" || a.fitFocus === "full_bag") {
    if (a.knowIron === "no" && typeof a.sevenIronCarry !== "number") score -= 8;
    if (a.knowIron === "yes" && typeof a.sevenIronSpeed !== "number") score -= 8;
    if (a.ironStartLine === "unsure") score -= 4;
    if (a.ironCurve === "unsure") score -= 4;
    if (a.ironLowPoint === "unsure") score -= 4;
    if (a.ironFaceStrike === "unsure") score -= 3;
    if (a.ironShaftWeightNow === "dont_know") score -= 3;
  }

  if (a.goals.length === 0) score -= 2;

  return Math.max(55, Math.min(95, score));
}

/* ---------------- SAFE ENGINE WRAPPERS (prevents “missing recommendations”) ---------------- */

type EngineRec = {
  fitScore: number;
  profile: {
    weightRange: string;
    flex: string;
    torqueRange?: string;
    launchBias?: string;
    balanceBias?: string;
    materialBias?: string;
    headBias?: string;
  };
  adjustmentGuide?: string[];
  constraintNote?: string;
};

function fallbackDriverRec(speedMph: number): EngineRec {
  const weightRange =
    speedMph >= 112 ? "70–80g" :
    speedMph >= 102 ? "60–70g" :
    speedMph >= 92 ? "55–65g" : "50–60g";

  const flex =
    speedMph >= 112 ? "X" :
    speedMph >= 102 ? "Stiff" :
    speedMph >= 92 ? "Stiff / Regular+" : "Regular";

  return {
    fitScore: 78,
    profile: {
      weightRange,
      flex,
      torqueRange: "3.0–4.5",
      launchBias: "mid",
      balanceBias: "neutral",
    },
    adjustmentGuide: [
      "Test 2 shaft weights within the recommended band (±5g).",
      "Validate start line + curve with 10 shots (don’t trust “feel” alone).",
    ],
    constraintNote: "",
  };
}

function fallbackIronRec(sevenIronSpeed: number): EngineRec {
  const weightRange =
    sevenIronSpeed >= 92 ? "120–130g" :
    sevenIronSpeed >= 85 ? "110–120g" :
    sevenIronSpeed >= 78 ? "100–110g" : "90–100g";

  const flex =
    sevenIronSpeed >= 92 ? "X" :
    sevenIronSpeed >= 85 ? "Stiff+" :
    sevenIronSpeed >= 78 ? "Stiff" : "Regular / Stiff border";

  return {
    fitScore: 80,
    profile: {
      weightRange,
      flex,
      launchBias: "mid",
      balanceBias: "neutral",
      materialBias: "steel baseline",
      headBias: "Neutral head bias",
    },
    constraintNote: "",
  };
}

function safeRecommendDriverWoods(args: any, speedMph: number): EngineRec {
  try {
    const rec = recommendDriverWoods(args);
    if (rec && typeof rec === "object" && (rec as any).profile?.weightRange && (rec as any).profile?.flex) {
      return rec as EngineRec;
    }
  } catch {
    // ignore and fall back
  }
  return fallbackDriverRec(speedMph);
}

function safeRecommendIrons(args: any, sevenIronSpeed: number): EngineRec {
  try {
    const rec = recommendIrons(args);
    if (rec && typeof rec === "object" && (rec as any).profile?.weightRange && (rec as any).profile?.flex) {
      return rec as EngineRec;
    }
  } catch {
    // ignore and fall back
  }
  return fallbackIronRec(sevenIronSpeed);
}

/* ---------------- RESULTS ---------------- */

function computeResults(a: Answers) {
  const focus = a.fitFocus;

  const driverSpeed = estimateDriverSpeed(a);
  const sevenIronSpeed = estimateSevenIronSpeed(a);

  const goalBias = computeGoalBias(a.goals);
  const confidence = computeConfidence(a);

  const driverFaceControl = classifyFaceControl(a.driverStartLine, a.driverCurve);
  const ironFaceControl = classifyFaceControl(a.ironStartLine, a.ironCurve);

  let driverPrimaryFix: "slice" | "hook" | "dispersion" = "dispersion";
  if (driverFaceControl.bias === "reduceRight") driverPrimaryFix = "slice";
  if (driverFaceControl.bias === "reduceLeft") driverPrimaryFix = "hook";

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

  const ironTempo =
    a.ironTempo === "smooth" ? "smooth" : a.ironTempo === "quick" ? "aggressive" : "moderate";
  const ironTransition =
    a.ironTempo === "smooth" ? "gradual" : a.ironTempo === "quick" ? "quick" : "quick";

  const ironStrikeForEngine =
    a.ironLowPoint === "fat"
      ? "fat"
      : a.ironLowPoint === "thin"
      ? "thin"
      : a.ironFaceStrike === "center"
      ? "center"
      : "unknown";

  const ironPrimaryFix: "distanceLoss" | "dispersion" =
    a.ironLowPoint === "fat" || a.ironLowPoint === "thin" ? "distanceLoss" : "dispersion";

  const ironFatigue =
    a.ironFatigue === "none"
      ? "none"
      : a.ironFatigue === "some"
      ? "some"
      : a.ironFatigue === "aLot"
      ? "aLot"
      : "unknown";

  const ironShaftNow = ironShaftBucketToNumber(a.ironShaftWeightNow);
  const ironPeakFeel = a.ironPeak === "low" ? "low" : a.ironPeak === "high" ? "high" : "mid";

  const driverRec =
    focus === "driver_woods" || focus === "full_bag"
      ? safeRecommendDriverWoods(
          {
            clubType: "driverWoods",
            primaryFix: driverPrimaryFix,
            speedMph: driverSpeed,
            tempo: driverTempo,
            transition: driverTransition,
            strike: driverStrike,
            currentShaftWeightG: driverShaftNow,
            currentFlex: "unknown",
            launchFeel: driverLaunchFeel,
          } as any,
          driverSpeed
        )
      : null;

  const woodsProfile = driverRec
    ? {
        weightRange: addTenGramsLabel(driverRec.profile.weightRange),
        flex: driverRec.profile.flex,
        torqueRange: driverRec.profile.torqueRange,
        launchBias: driverRec.profile.launchBias,
        balanceBias: driverRec.profile.balanceBias,
      }
    : null;

  const swingWeightTargets =
    a.constraint === "elbow" || a.constraint === "shoulder_back" || a.constraint === "prefer_lighter"
      ? {
          driver: "D1–D2",
          woods: "D2–D3",
          irons: "D1–D3",
          wedges: "D3–D5",
        }
      : {
          driver: "D2",
          woods: "D3",
          irons: "D2–D4",
          wedges: "D4–D6",
        };

  const driverTipStability = (() => {
    const launch = driverRec?.profile?.launchBias;
    const torque = driverRec?.profile?.torqueRange;
    if (!launch && !torque) return "—";
    if (launch === "low" || /low/i.test(torque ?? "")) return "More tip-stable";
    if (launch === "high" || /high/i.test(torque ?? "")) return "More active tip";
    return "Neutral tip stability";
  })();

  const ironRec =
    focus === "irons" || focus === "full_bag"
      ? safeRecommendIrons(
          {
            clubType: "irons",
            primaryFix: ironPrimaryFix,
            sixIronSpeedMph: sevenIronSpeed + 4,
            tempo: ironTempo,
            transition: ironTransition,
            strike: ironStrikeForEngine,
            fatigue: ironFatigue,
            currentShaftWeightG: ironShaftNow,
            currentFlex: "unknown",
            peakHeightFeel: ironPeakFeel,
          } as any,
          sevenIronSpeed
        )
      : null;

  const wedgeRec =
    focus === "wedges" || focus === "full_bag"
      ? recommendWedgesDeterministic({
          focusGoals: a.goals,
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

  const primaryLeverDriver =
    goalBias.stability >= 2 || driverFaceControl.bias !== "neutral" ? "Stability (face control)" : "Weight (sequencing)";

  const primaryLeverIrons =
    a.ironLowPoint === "fat" || a.ironLowPoint === "thin"
      ? "Contact (low point)"
      : goalBias.stability >= 2
      ? "Stability (start line)"
      : "Weight (fatigue/timing)";

  const cause: string[] = [];

  if (driverRec) {
    if (a.driverStartLine !== "unsure" && a.driverCurve !== "unsure") {
      if (driverFaceControl.bias === "reduceRight") {
        cause.push("Because your driver starts right and fades, we prioritize face-control stability to reduce right-side misses.");
      } else if (driverFaceControl.bias === "reduceLeft") {
        cause.push("Because your driver starts left (with left bias), we bias toward anti-left stability (tip-stable / lower torque directionally).");
      } else {
        cause.push("Because your driver pattern is relatively neutral, we keep the recommendation balanced and tune primarily for your speed + feel.");
      }
    } else {
      cause.push("Because your driver flight pattern is marked as unsure, we bias neutral and recommend validating start line + curve on the range.");
    }
  }

  if (ironRec) {
    if (a.ironLowPoint === "fat") {
      cause.push("Because your iron low point tends to be behind the ball (fat), we bias toward contact consistency and forgiveness before chasing profile extremes.");
    } else if (a.ironLowPoint === "thin") {
      cause.push("Because you tend to catch irons thin, we bias toward a build that supports consistent strike and avoids overly harsh/low-launch profiles.");
    } else if (a.ironLowPoint === "ball_first") {
      cause.push("Because you tend to strike ball-first, we can be more aggressive about stability/profile tuning without sacrificing contact.");
    }

    if (a.ironStartLine !== "unsure" && a.ironCurve !== "unsure") {
      if (ironFaceControl.bias === "reduceRight") {
        cause.push("Because your irons start right with fade bias, we prioritize stability to help square the face more consistently.");
      } else if (ironFaceControl.bias === "reduceLeft") {
        cause.push("Because your irons show left bias, we favor anti-left stability so the face doesn’t over-close.");
      } else {
        cause.push("Because your iron pattern is relatively neutral, we keep the build balanced and anchor to speed + strike tendencies.");
      }
    } else {
      cause.push("Because iron start line/curve is marked unsure, we bias a stable baseline and recommend validating on the range.");
    }
  }

  if (a.goals.includes("accuracy")) cause.push("Because accuracy is a selected goal, we keep you inside a stable weight band before tuning flex/profile.");
  if (a.constraint !== "none") cause.push("Because a physical constraint is noted, we avoid overly heavy or harsh-feeling builds.");

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
    confidence,

    models: {
      driver: { start: a.driverStartLine, curve: a.driverCurve, strike: a.driverStrike },
      irons: { start: a.ironStartLine, curve: a.ironCurve, lowPoint: a.ironLowPoint, faceStrike: a.ironFaceStrike },
      wedges: { turf: a.wedgeTurf, miss: a.wedgeMiss },
    },

    driver: driverRec
      ? {
          fitScore: driverRec.fitScore as number,
          primaryLever: primaryLeverDriver,
          shaft: {
            weight: driverRec.profile.weightRange ?? "—",
            flex: driverRec.profile.flex ?? "—",
            launch: driverRec.profile.launchBias ?? "—",
            torqueRange: driverRec.profile.torqueRange ?? "—",
            balancePoint: driverRec.profile.balanceBias ?? "—",
            tipStability: driverTipStability,
          },
          targetSwingWeight: swingWeightTargets.driver,
          settings: (driverRec.adjustmentGuide ?? []) as string[],
          note: driverRec.constraintNote ?? "",
        }
      : null,

    woods: woodsProfile
      ? {
          fitScore: Math.max(40, Math.min(95, (driverRec?.fitScore ?? 80) - 3)),
          shaft: {
            weight: woodsProfile.weightRange ?? "—",
            flex: woodsProfile.flex ?? "—",
            launch: woodsProfile.launchBias ?? "—",
            torqueRange: woodsProfile.torqueRange ?? "—",
            balancePoint: woodsProfile.balanceBias ?? "—",
          },
          targetSwingWeight: swingWeightTargets.woods,
          note: "Woods: baseline rule is ~+10g vs driver for control and consistent strike.",
        }
      : null,

    irons: ironRec
      ? {
          fitScore: ironRec.fitScore as number,
          primaryLever: primaryLeverIrons,
          shaft: {
            weight: ironRec.profile.weightRange ?? "—",
            flex: ironRec.profile.flex ?? "—",
            launch: ironRec.profile.launchBias ?? "—",
            balancePoint: ironRec.profile.balanceBias ?? "—",
            material: ironRec.profile.materialBias ?? "—",
          },
          targetSwingWeight: swingWeightTargets.irons,
          headBias: ironRec.profile.headBias ?? "Neutral head bias",
          note: ironRec.constraintNote ?? "",
        }
      : null,

    wedges: wedgeRec
      ? {
          fitScore: wedgeRec.fitScore,
          shaft: {
            weight: wedgeRec.profile.weightRange ?? "—",
            flex: wedgeRec.profile.flex ?? "—",
            bounce: wedgeRec.profile.bounce ?? "—",
            grind: wedgeRec.profile.grind ?? "—",
          },
          targetSwingWeight: swingWeightTargets.wedges,
          gappingTitle: wedgeRec.profile.gappingTitle,
          gappingBullets: wedgeRec.profile.gappingBullets,
          buildNotes: wedgeRec.buildNotes,
          note: wedgeRec.constraintNote,
        }
      : null,

    cause,
    why,
  };
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function DiagnosticWizard() {
  const [a, setA] = useState<Answers>(DEFAULT_ANSWERS);

  const steps = useMemo(() => buildSteps(a.fitFocus), [a.fitFocus]);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] ?? "focus";

  const [isVerified, setIsVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<
    "verified" | "already_verified" | "expired" | "invalid" | null
  >(null);
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
      const verifyStatusParam = url.searchParams.get("verifyStatus");
      const wantsResults = url.searchParams.get("step") === "results";

      if (
        verifyStatusParam === "verified" ||
        verifyStatusParam === "already_verified" ||
        verifyStatusParam === "expired" ||
        verifyStatusParam === "invalid"
      ) {
        setVerifyStatus(verifyStatusParam);
      }

      if (verified || verifyStatusParam === "verified" || verifyStatusParam === "already_verified") {
        setIsVerified(true);
        window.localStorage.setItem("lead_verified", "1");
      }

      if (verified || wantsResults) {
        const savedPayload = window.localStorage.getItem("diagnostic_last_payload");
        if (savedPayload) {
          try {
            const parsed = JSON.parse(savedPayload);

            if (parsed && typeof parsed === "object") {
              if (Array.isArray(parsed.goals)) {
                // ok
              } else if (typeof parsed.goal === "string") {
                parsed.goals = [parsed.goal];
              } else {
                parsed.goals = ["accuracy"];
              }
              delete parsed.goal;
            }

            setA({ ...DEFAULT_ANSWERS, ...parsed });
          } catch {
            // ignore bad JSON
          }
        }

        setPendingJumpToResults(true);

        url.searchParams.delete("step");
        url.searchParams.delete("verified");
        url.searchParams.delete("verifyStatus");
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

  useEffect(() => {
    try {
      window.localStorage.setItem("diagnostic_last_payload", JSON.stringify(a));
    } catch {
      // ignore
    }
  }, [a]);

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
    try {
      window.localStorage.removeItem("diagnostic_last_payload");
      window.localStorage.removeItem("diagnostic_completed_at");
    } catch {
      // ignore
    }
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

              <div className="mt-8 space-y-6">
                {/* Shared */}
                {step === "focus" && (
                  <ChoiceChips
                    mode="single"
                    value={a.fitFocus}
                    onChange={(v) => {
                      setA((p) => ({ ...p, fitFocus: v }));
                      setStepIndex(1);
                    }}
                    options={[
                      { value: "driver_woods", label: "Driver + Woods" },
                      { value: "irons", label: "Irons" },
                      { value: "wedges", label: "Wedges" },
                      { value: "full_bag", label: "Full bag" },
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
                    mode="single"
                    value={a.playFreq}
                    onChange={(v) => setA((p) => ({ ...p, playFreq: v }))}
                    options={[
                      { value: "monthly", label: "1–2x/month" },
                      { value: "weekly", label: "1x/week" },
                      { value: "twice_weekly", label: "2x/week" },
                      { value: "three_plus", label: "3+ / week" },
                      { value: "range_only", label: "Range only" },
                    ]}
                  />
                )}

                {step === "goals" && (
                  <div className="space-y-3">
                    <ChoiceChips
                      mode="multi"
                      maxSelections={2}
                      value={a.goals}
                      onChange={(v) => setA((p) => ({ ...p, goals: v }))}
                      options={[
                        { value: "distance", label: "More distance", help: "Bias for speed/launch efficiency." },
                        { value: "accuracy", label: "More fairways", help: "Bias stability and face control." },
                        { value: "higher_launch", label: "Higher launch", help: "Bias profile/launch directionally." },
                        { value: "reduce_spin", label: "Reduce spin", help: "Bias tip stability directionally." },
                        { value: "feel", label: "Better feel", help: "Bias toward your current weight/feel anchor." },
                      ]}
                    />
                    <div className="text-xs text-slate-500">Select up to 2.</div>
                  </div>
                )}

                {step === "constraints" && (
                  <ChoiceChips
                    mode="single"
                    value={a.constraint}
                    onChange={(v) => setA((p) => ({ ...p, constraint: v }))}
                    options={[
                      { value: "none", label: "None", help: "No constraint bias applied." },
                      { value: "elbow", label: "Elbow pain", help: "Bias away from harsh / overly stiff-feeling builds." },
                      { value: "shoulder_back", label: "Shoulder/Back", help: "Bias away from heavy or high-effort builds." },
                      { value: "prefer_lighter", label: "Prefer lighter feel", help: "Bias weight bands slightly lighter where possible." },
                    ]}
                  />
                )}

                {/* Driver/Woods */}
                {step === "driver_speed" && (
                  <div className="space-y-5">
                    <ChoiceChips
                      mode="single"
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
                        { value: "yes", label: "I know my speed" },
                        { value: "no", label: "I don’t know" },
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

                {step === "driver_startline" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.driverStartLine}
                      onChange={(v) => setA((p) => ({ ...p, driverStartLine: v }))}
                      options={[
                        { value: "left", label: "Starts left", help: "Start line is mostly face direction at impact." },
                        { value: "center", label: "Starts center", help: "Start line is mostly face direction at impact." },
                        { value: "right", label: "Starts right", help: "Start line is mostly face direction at impact." },
                        { value: "unsure", label: "Not sure", help: "No problem — we’ll bias neutral and lower confidence slightly." },
                      ]}
                    />
                    <MiniVizCard>
                      <BallFlightViz start={a.driverStartLine} curve={"straight"} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "driver_curve" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.driverCurve}
                      onChange={(v) => setA((p) => ({ ...p, driverCurve: v }))}
                      options={[
                        { value: "draw", label: "Draws (curves left)", help: "Curve helps separate face vs path influence." },
                        { value: "straight", label: "Mostly straight", help: "Curve helps separate face vs path influence." },
                        { value: "fade", label: "Fades (curves right)", help: "Curve helps separate face vs path influence." },
                        { value: "unsure", label: "Not sure", help: "We’ll recommend a neutral baseline — validate this on the range." },
                      ]}
                    />
                    <MiniVizCard>
                      <BallFlightViz start={a.driverStartLine} curve={a.driverCurve} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "driver_strike" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.driverStrike}
                      onChange={(v) => setA((p) => ({ ...p, driverStrike: v }))}
                      options={[
                        { value: "heel", label: "Heel", help: "Heel/toe strike changes curvature and spin." },
                        { value: "center", label: "Center", help: "Centered strike supports more aggressive tuning." },
                        { value: "toe", label: "Toe", help: "Heel/toe strike changes curvature and spin." },
                        { value: "all_over", label: "All over", help: "More variability → we bias forgiveness and stability." },
                      ]}
                    />
                    <MiniVizCard>
                      <FaceStrikeViz strike={a.driverStrike === "all_over" ? "mixed" : a.driverStrike} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "driver_flight" && (
                  <ChoiceChips
                    mode="single"
                    value={a.driverFlight}
                    onChange={(v) => setA((p) => ({ ...p, driverFlight: v }))}
                    options={[
                      { value: "low", label: "Low" },
                      { value: "mid", label: "Mid" },
                      { value: "high", label: "High" },
                    ]}
                  />
                )}

                {step === "driver_tempo" && (
                  <ChoiceChips
                    mode="single"
                    value={a.driverTempo}
                    onChange={(v) => setA((p) => ({ ...p, driverTempo: v }))}
                    options={[
                      { value: "smooth", label: "Smooth", help: "Smooth transitions can use slightly softer profiles without losing control." },
                      { value: "neutral", label: "Medium", help: "Neutral baseline." },
                      { value: "quick", label: "Quick from the top", help: "Quick transitions usually need more stability to control face closure." },
                      { value: "unsure", label: "Not sure", help: "We’ll bias moderate stability." },
                    ]}
                  />
                )}

                {step === "driver_shaftnow" && (
                  <ChoiceChips
                    mode="single"
                    value={a.driverShaftWeightNow}
                    onChange={(v) => setA((p) => ({ ...p, driverShaftWeightNow: v }))}
                    options={[
                      { value: "dont_know", label: "Don’t know" },
                      { value: "lt_55", label: "<55g" },
                      { value: "55_65", label: "55–65g" },
                      { value: "65_75", label: "65–75g" },
                      { value: "75_plus", label: "75g+" },
                    ]}
                  />
                )}

                {/* Irons */}
                {step === "iron_speed" && (
                  <div className="space-y-5">
                    <ChoiceChips
                      mode="single"
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
                        { value: "yes", label: "I know my 7-iron speed" },
                        { value: "no", label: "I don’t know (use carry)" },
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

                {step === "iron_startline" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.ironStartLine}
                      onChange={(v) => setA((p) => ({ ...p, ironStartLine: v }))}
                      options={[
                        { value: "left", label: "Starts left", help: "Start line is mostly face direction at impact." },
                        { value: "center", label: "Starts center", help: "Start line is mostly face direction at impact." },
                        { value: "right", label: "Starts right", help: "Start line is mostly face direction at impact." },
                        { value: "unsure", label: "Not sure", help: "We’ll bias neutral and lower confidence slightly." },
                      ]}
                    />
                    <MiniVizCard>
                      <BallFlightViz start={a.ironStartLine} curve={"straight"} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "iron_curve" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.ironCurve}
                      onChange={(v) => setA((p) => ({ ...p, ironCurve: v }))}
                      options={[
                        { value: "draw", label: "Draws (curves left)" },
                        { value: "straight", label: "Mostly straight" },
                        { value: "fade", label: "Fades (curves right)" },
                        { value: "unsure", label: "Not sure" },
                      ]}
                    />
                    <MiniVizCard>
                      <BallFlightViz start={a.ironStartLine} curve={a.ironCurve} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "iron_peak" && (
                  <ChoiceChips
                    mode="single"
                    value={a.ironPeak}
                    onChange={(v) => setA((p) => ({ ...p, ironPeak: v }))}
                    options={[
                      { value: "low", label: "Low" },
                      { value: "mid", label: "Mid" },
                      { value: "high", label: "High" },
                    ]}
                  />
                )}

                {step === "iron_lowpoint" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.ironLowPoint}
                      onChange={(v) => setA((p) => ({ ...p, ironLowPoint: v }))}
                      options={[
                        { value: "ball_first", label: "Ball-first (then turf)", help: "Ball-first contact supports more aggressive tuning." },
                        { value: "shallow", label: "Shallow / sweepy", help: "Shallow contact often prefers balanced sequencing." },
                        { value: "fat", label: "Fat (ground first)", help: "Low point behind the ball → prioritize contact consistency." },
                        { value: "thin", label: "Thin (top / low on face)", help: "Thin often needs a build that supports consistent strike." },
                        { value: "unsure", label: "Not sure", help: "We’ll bias neutral." },
                      ]}
                    />
                    <MiniVizCard>
                      <LowPointViz lowPoint={a.ironLowPoint} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "iron_facestrike" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.ironFaceStrike}
                      onChange={(v) => setA((p) => ({ ...p, ironFaceStrike: v }))}
                      options={[
                        { value: "heel", label: "Heel", help: "Heel/toe strike changes start line and ball speed." },
                        { value: "center", label: "Center", help: "Centered strike supports more aggressive tuning." },
                        { value: "toe", label: "Toe", help: "Heel/toe strike changes start line and ball speed." },
                        { value: "mixed", label: "Mixed", help: "More variability → bias forgiveness." },
                        { value: "unsure", label: "Not sure", help: "We’ll keep head bias neutral." },
                      ]}
                    />
                    <MiniVizCard>
                      <FaceStrikeViz strike={a.ironFaceStrike} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "iron_fatigue" && (
                  <ChoiceChips
                    mode="single"
                    value={a.ironFatigue}
                    onChange={(v) => setA((p) => ({ ...p, ironFatigue: v }))}
                    options={[
                      { value: "none", label: "No fatigue" },
                      { value: "some", label: "Some fatigue" },
                      { value: "aLot", label: "A lot (arms/back/shoulders)" },
                      { value: "unsure", label: "Not sure" },
                    ]}
                  />
                )}

                {step === "iron_tempo" && (
                  <ChoiceChips
                    mode="single"
                    value={a.ironTempo}
                    onChange={(v) => setA((p) => ({ ...p, ironTempo: v }))}
                    options={[
                      { value: "smooth", label: "Smooth", help: "Smooth transitions can use slightly softer profiles without losing control." },
                      { value: "neutral", label: "Medium", help: "Neutral baseline." },
                      { value: "quick", label: "Quick from the top", help: "Quick transitions often need more stability to keep start line consistent." },
                      { value: "unsure", label: "Not sure", help: "We’ll bias moderate stability." },
                    ]}
                  />
                )}

                {step === "iron_shaftnow" && (
                  <ChoiceChips
                    mode="single"
                    value={a.ironShaftWeightNow}
                    onChange={(v) => setA((p) => ({ ...p, ironShaftWeightNow: v }))}
                    options={[
                      { value: "dont_know", label: "Don’t know" },
                      { value: "85_95", label: "85–95g" },
                      { value: "95_105", label: "95–105g" },
                      { value: "105_120", label: "105–120g" },
                      { value: "120_plus", label: "120g+" },
                    ]}
                  />
                )}

                {/* Wedges */}
                {step === "wedge_use" && (
                  <ChoiceChips
                    mode="single"
                    value={a.wedgeUse}
                    onChange={(v) => setA((p) => ({ ...p, wedgeUse: v }))}
                    options={[
                      { value: "mostly_full", label: "Mostly full shots (approach wedges)" },
                      { value: "mixed", label: "Mixed (full + partial + chips)" },
                      { value: "mostly_greenside", label: "Mostly around the green" },
                    ]}
                  />
                )}

                {step === "wedge_turf" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.wedgeTurf}
                      onChange={(v) => setA((p) => ({ ...p, wedgeTurf: v }))}
                      options={[
                        { value: "digger", label: "Digger (deep divots)" },
                        { value: "neutral", label: "Neutral" },
                        { value: "sweeper", label: "Sweeper (shallow)" },
                        { value: "unsure", label: "Not sure" },
                      ]}
                    />
                    <MiniVizCard>
                      <WedgeTurfViz turf={a.wedgeTurf} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "wedge_miss" && (
                  <div className="space-y-4">
                    <ChoiceChips
                      mode="single"
                      value={a.wedgeMiss}
                      onChange={(v) => setA((p) => ({ ...p, wedgeMiss: v }))}
                      options={[
                        { value: "fat", label: "Fat" },
                        { value: "thin", label: "Thin" },
                        { value: "both", label: "Both" },
                        { value: "unsure", label: "Not sure" },
                      ]}
                    />
                    <MiniVizCard>
                      <WedgeMissViz miss={a.wedgeMiss} />
                    </MiniVizCard>
                  </div>
                )}

                {step === "wedge_traj" && (
                  <ChoiceChips
                    mode="single"
                    value={a.wedgeTrajectory}
                    onChange={(v) => setA((p) => ({ ...p, wedgeTrajectory: v }))}
                    options={[
                      { value: "lower", label: "Lower flight" },
                      { value: "neutral", label: "Neutral" },
                      { value: "higher", label: "Higher flight" },
                    ]}
                  />
                )}

                {step === "wedge_spin" && (
                  <ChoiceChips
                    mode="single"
                    value={a.wedgeSpin}
                    onChange={(v) => setA((p) => ({ ...p, wedgeSpin: v }))}
                    options={[
                      { value: "more_check", label: "More check (stop faster)" },
                      { value: "balanced", label: "Balanced" },
                      { value: "more_release", label: "More release (rollout)" },
                      { value: "unsure", label: "Not sure" },
                    ]}
                  />
                )}

                {step === "wedge_shaftpref" && (
                  <ChoiceChips
                    mode="single"
                    value={a.wedgeShaftPref}
                    onChange={(v) => setA((p) => ({ ...p, wedgeShaftPref: v }))}
                    options={[
                      { value: "match_irons", label: "Match irons" },
                      { value: "slightly_heavier", label: "Slightly heavier for control" },
                      { value: "unknown", label: "Not sure" },
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
            <ResultsView
              a={a}
              result={result}
              isVerified={isVerified}
              verifyStatus={verifyStatus}
              onReset={resetAll}
            />
          )}
        </section>

        <div className="mt-6 text-center text-xs text-slate-400">
          Tip: you can refresh anytime — your answers are saved locally on your device.
        </div>
      </div>
    </main>
  );
}

/* ---------------- RESULTS VIEW (FULL) ---------------- */

function ResultsView({
  a,
  result,
  isVerified,
  verifyStatus,
  onReset,
}: {
  a: Answers;
  result: ReturnType<typeof computeResults>;
  isVerified: boolean;
  verifyStatus: "verified" | "already_verified" | "expired" | "invalid" | null;
  onReset: () => void;
}) {
  const [shareCardUrl, setShareCardUrl] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"link" | "caption" | null>(null);
  const showDriver = result.focus === "driver_woods" || result.focus === "full_bag";
  const showIrons = result.focus === "irons" || result.focus === "full_bag";
  const showWedges = result.focus === "wedges" || result.focus === "full_bag";

  // ✅ FIX #1: only show ball flight model when driver or irons are part of the workflow
  const showBallFlight = showDriver || showIrons;

  // ✅ FIX #2: only show irons contact profile when irons are part of the workflow
  const showIronContactProfile = showIrons;

  const modelStart = showIrons && !showDriver ? a.ironStartLine : a.driverStartLine;
  const modelCurve = showIrons && !showDriver ? a.ironCurve : a.driverCurve;
  const certificateId = useMemo(() => buildCertificateId(a, result), [a, result]);
  const alignmentScore = useMemo(() => computeAlignmentScore(result), [result]);
  const verificationUrl = `https://dovegolf.fit/verify/${certificateId}`;
  const [contactProfile, setContactProfile] = useState<{
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  }>({ firstName: null, lastName: null, email: null });
  const [completedAt, setCompletedAt] = useState<string>("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("lead_contact_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        setContactProfile({
          firstName: typeof parsed?.firstName === "string" ? parsed.firstName : null,
          lastName: typeof parsed?.lastName === "string" ? parsed.lastName : null,
          email: typeof parsed?.email === "string" ? parsed.email : null,
        });
      }
    } catch {
      // ignore
    }

    try {
      const stored = window.localStorage.getItem("diagnostic_completed_at");
      if (stored) {
        setCompletedAt(stored);
      } else {
        const nowIso = new Date().toISOString();
        window.localStorage.setItem("diagnostic_completed_at", nowIso);
        setCompletedAt(nowIso);
      }
    } catch {
      setCompletedAt(new Date().toISOString());
    }
  }, []);

  const completedLabel = useMemo(
    () =>
      new Date(completedAt || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [completedAt]
  );

  const qrSvgMarkup = useMemo(() => buildInlineQrSvg(verificationUrl, 112), [verificationUrl]);

  // Optional: wedge-only gets a wedge-specific “interaction” model instead of a dummy driver model
  const showWedgeModelOnly = showWedges && !showDriver && !showIrons;

  const generateShareCard = async () => {
    const node = document.getElementById("equipment-alignment-share-card");
    if (!node) return;
    if (!qrSvgMarkup) return;

    try {
      await (document as any).fonts?.ready;
    } catch {
      // ignore
    }

    await new Promise((resolve) => requestAnimationFrame(() => resolve(true)));

    const svgText = new XMLSerializer().serializeToString(node as Node);
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const img = new window.Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Unable to render share card."));
      img.src = blobUrl;
    });

    const scale = 2;
    const hiresCanvas = document.createElement("canvas");
    hiresCanvas.width = SHARE_CARD_WIDTH * scale;
    hiresCanvas.height = SHARE_CARD_HEIGHT * scale;
    const hiresCtx = hiresCanvas.getContext("2d");
    if (!hiresCtx) {
      URL.revokeObjectURL(blobUrl);
      return;
    }

    hiresCtx.fillStyle = "#fff";
    hiresCtx.fillRect(0, 0, hiresCanvas.width, hiresCanvas.height);
    hiresCtx.drawImage(img, 0, 0, hiresCanvas.width, hiresCanvas.height);
    URL.revokeObjectURL(blobUrl);

    const canvas = document.createElement("canvas");
    canvas.width = SHARE_CARD_WIDTH;
    canvas.height = SHARE_CARD_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(hiresCanvas, 0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

    const pngUrl = canvas.toDataURL("image/png");
    setShareCardUrl(pngUrl);

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `dovegolf-record-${certificateId}.png`;
    link.click();
  };

  const copyVerificationLink = async () => {
    await navigator.clipboard.writeText(verificationUrl);
    setCopyState("link");
    window.setTimeout(() => setCopyState(null), 1500);
  };

  const copyCaption = async () => {
    const caption = `My Dove Golf™ Equipment Alignment Record is live.\n\nEquipment Alignment Score: ${alignmentScore}%\nVerify my certificate: ${verificationUrl}\n\n#DoveGolf #EquipmentAlignment #GolfFitting #FitToYourSwing`;
    await navigator.clipboard.writeText(caption);
    setCopyState("caption");
    window.setTimeout(() => setCopyState(null), 1500);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Your fit summary</h1>

      <div className="mt-3 space-y-1 text-sm text-slate-600">
        {showDriver && (
          <div>
            Estimated driver speed: <span className="font-medium text-slate-900">{result.driverSpeedEstimate} mph</span>
          </div>
        )}
        {(showIrons || showWedges) && (
          <div>
            Estimated 7-iron speed:{" "}
            <span className="font-medium text-slate-900">{result.sevenIronSpeedEstimate} mph</span>
          </div>
        )}
      </div>

      {isVerified && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">
            {verifyStatus === "already_verified" ? "✅ Email already verified" : "✅ Email verified"}
          </div>
          <div className="mt-1 text-sm text-emerald-800">
            {verifyStatus === "already_verified"
              ? "This link was already used, and your premium insights remain unlocked."
              : "Premium insights are now unlocked."}
          </div>
        </div>
      )}

      {!isVerified && verifyStatus === "expired" && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm font-semibold text-amber-900">⚠️ Verification link expired</div>
          <div className="mt-1 text-sm text-amber-800">
            Please request a new verification email and use the most recent link.
          </div>
        </div>
      )}

      {!isVerified && verifyStatus === "invalid" && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-sm font-semibold text-rose-900">⚠️ Invalid verification link</div>
          <div className="mt-1 text-sm text-rose-800">Please request a new verification email.</div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Confidence</div>
          <div className="text-sm font-medium text-slate-900">{result.confidence}%</div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-white">
          <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${result.confidence}%` }} />
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Confidence drops when key inputs are marked “Not sure” or missing.
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        <Card title="Equipment Alignment Record">
          <div className="space-y-2">
            <button
              type="button"
              onClick={generateShareCard}
              disabled={!isVerified}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              Generate Share Card
            </button>
            {!isVerified && (
              <div className="text-xs text-slate-600">Verify email to unlock your Equipment Alignment Record.</div>
            )}
            {shareCardUrl && isVerified && (
              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                <button type="button" onClick={generateShareCard} className="rounded-lg border border-slate-300 px-3 py-1.5">
                  Download Image
                </button>
                <button
                  type="button"
                  onClick={copyVerificationLink}
                  className="rounded-lg border border-slate-300 px-3 py-1.5"
                >
                  Copy Verification Link{copyState === "link" ? " · Link copied." : ""}
                </button>
                <button type="button" onClick={copyCaption} className="rounded-lg border border-slate-300 px-3 py-1.5">
                  Copy Caption{copyState === "caption" ? " · Caption copied." : ""}
                </button>
              </div>
            )}
          </div>
        </Card>

        {!isVerified && (
          <EmailCaptureCard
            payload={a}
            onProfileSaved={(profile) => {
              setContactProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
              });
            }}
          />
        )}

        {showBallFlight && (
          <Card title="Your ball flight model">
            <div className="grid gap-3">
              <div className="text-sm text-slate-600">
                {showIrons && !showDriver ? "Irons" : "Driver"}:{" "}
                <span className="font-medium text-slate-900">
                  {modelStart} / {modelCurve}
                </span>
              </div>
              <BallFlightViz start={modelStart} curve={modelCurve} compact={false} />
            </div>
          </Card>
        )}

        {showWedgeModelOnly && (
          <Card title="Your wedge interaction model">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Turf interaction</div>
                <div className="mt-1 text-xs text-slate-500">{a.wedgeTurf}</div>
                <div className="mt-3">
                  <WedgeTurfViz turf={a.wedgeTurf} />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Typical miss</div>
                <div className="mt-1 text-xs text-slate-500">{a.wedgeMiss}</div>
                <div className="mt-3">
                  <WedgeMissViz miss={a.wedgeMiss} />
                </div>
              </div>
            </div>
          </Card>
        )}

        {showIronContactProfile && (
          <Card title="Your contact profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Iron low point</div>
                <div className="mt-1 text-xs text-slate-500">{a.ironLowPoint.replaceAll("_", " ")}</div>
                <div className="mt-3">
                  <LowPointViz lowPoint={a.ironLowPoint} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Face strike</div>
                <div className="mt-1 text-xs text-slate-500">{a.ironFaceStrike}</div>
                <div className="mt-3">
                  <FaceStrikeViz strike={a.ironFaceStrike} />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recommendations */}
        {showDriver && result.driver && (
          <Card title="Driver recommendation">
            <Line label="Fit score" value={`${result.driver.fitScore}%`} />
            <Line label="Primary lever" value={result.driver.primaryLever} />
            <Line label="Shaft weight" value={result.driver.shaft.weight} />
            <Line label="Flex" value={result.driver.shaft.flex} />
            <Line label="Launch" value={result.driver.shaft.launch} />
            <Line label="Torque range" value={result.driver.shaft.torqueRange} />
            <Line label="Balance point" value={result.driver.shaft.balancePoint} />
            <Line label="Tip stability" value={result.driver.shaft.tipStability} />
            <Line label="Target swing weight" value={result.driver.targetSwingWeight} />

            {(result.driver.settings ?? []).length > 0 && (
              <>
                <div className="pt-3 text-sm font-semibold text-slate-900">Test settings</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {(result.driver.settings ?? []).map((x: string, i: number) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </>
            )}

            {result.driver.note ? <p className="pt-2 text-xs text-slate-500">{result.driver.note}</p> : null}
          </Card>
        )}

        {showDriver && result.woods && (
          <Card title="Woods (3W/5W) baseline">
            <Line label="Fit score" value={`${result.woods.fitScore}%`} />
            <Line label="Shaft weight" value={result.woods.shaft.weight} />
            <Line label="Flex" value={result.woods.shaft.flex} />
            <Line label="Launch" value={result.woods.shaft.launch} />
            <Line label="Torque range" value={result.woods.shaft.torqueRange} />
            <Line label="Balance point" value={result.woods.shaft.balancePoint} />
            <Line label="Target swing weight" value={result.woods.targetSwingWeight} />
            {result.woods.note ? <p className="pt-2 text-xs text-slate-500">{result.woods.note}</p> : null}
          </Card>
        )}

        {showIrons && result.irons && (
          <Card title="Iron recommendation">
            <Line label="Fit score" value={`${result.irons.fitScore}%`} />
            <Line label="Primary lever" value={result.irons.primaryLever} />
            <Line label="Shaft weight" value={result.irons.shaft.weight} />
            <Line label="Flex" value={result.irons.shaft.flex} />
            <Line label="Launch" value={result.irons.shaft.launch} />
            <Line label="Balance point" value={result.irons.shaft.balancePoint} />
            <Line label="Material" value={result.irons.shaft.material} />
            <Line label="Head bias" value={result.irons.headBias} />
            <Line label="Target swing weight" value={result.irons.targetSwingWeight} />
            {result.irons.note ? <p className="pt-2 text-xs text-slate-500">{result.irons.note}</p> : null}
          </Card>
        )}

        {showWedges && result.wedges && (
          <Card title="Wedge recommendation">
            <Line label="Fit score" value={`${result.wedges.fitScore}%`} />
            <Line label="Shaft weight" value={result.wedges.shaft.weight} />
            <Line label="Flex" value={result.wedges.shaft.flex} />
            <Line label="Bounce" value={result.wedges.shaft.bounce} />
            <Line label="Grind" value={result.wedges.shaft.grind} />
            <Line label="Target swing weight" value={result.wedges.targetSwingWeight} />

            <div className="pt-3 text-sm font-semibold text-slate-900">{result.wedges.gappingTitle}</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {(result.wedges.gappingBullets ?? []).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>

            <div className="pt-3 text-sm font-semibold text-slate-900">Build notes</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {(result.wedges.buildNotes ?? []).map((x: string, i: number) => (
                <li key={i}>{x}</li>
              ))}
            </ul>

            {result.wedges.note ? <p className="pt-2 text-xs text-slate-500">{result.wedges.note}</p> : null}
          </Card>
        )}

        {/* Reasoning */}
        {(result.cause ?? []).length > 0 && (
          <Card title="What in your answers drove this fit">
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {(result.cause ?? []).map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Why these recommendations">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {(result.why ?? []).map((w: string, i: number) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </Card>

        <Card title="How to interpret and apply your results (fitter-grade)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>
              <span className="font-medium text-slate-900">Treat weight as the primary constraint.</span>{" "}
              Stay inside the band first. Only then tune flex/profile.
            </li>
            <li>
              <span className="font-medium text-slate-900">Flex labels are not standardized.</span>{" "}
              If you’re between bands, test both and compare strike + start-line control.
            </li>
            <li>
              <span className="font-medium text-slate-900">Validate with a controlled test protocol.</span>{" "}
              Test 2–3 shafts in the same head at the same length/swingweight.
            </li>
          </ul>
        </Card>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReset}
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
      </div>

      <div className="pointer-events-none fixed -left-[9999px] top-0 opacity-0" aria-hidden>
        <EquipmentAlignmentShareCard
          a={a}
          result={result}
          certificateId={certificateId}
          completedLabel={completedLabel}
          alignmentScore={alignmentScore}
          verificationUrl={verificationUrl}
          qrSvgMarkup={qrSvgMarkup}
          modelStart={modelStart}
          modelCurve={modelCurve}
          showDriver={showDriver}
          showIrons={showIrons}
          firstName={contactProfile.firstName}
          lastName={contactProfile.lastName}
          email={contactProfile.email}
        />
      </div>
    </>
  );
}

function EquipmentAlignmentShareCard({
  a,
  result,
  certificateId,
  completedLabel,
  alignmentScore,
  verificationUrl,
  qrSvgMarkup,
  modelStart,
  modelCurve,
  showDriver,
  showIrons,
  firstName,
  lastName,
}: {
  a: Answers;
  result: ReturnType<typeof computeResults>;
  certificateId: string;
  completedLabel: string;
  alignmentScore: number;
  verificationUrl: string;
  qrSvgMarkup: string;
  modelStart: StartLine;
  modelCurve: Curve;
  showDriver: boolean;
  showIrons: boolean;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}) {
  const displayName = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ") || "Dove Golfer";
  const contentWidth = SHARE_CARD_WIDTH - SHARE_CARD_PADDING * 2;

  const energyTransfer = a.driverTempo === "quick" ? "Fast Energy" : a.driverTempo === "smooth" ? "Smooth Energy" : "Neutral";
  const stabilityRequirement = result.confidence >= 80 ? "Medium Stability" : result.confidence >= 65 ? "High Stability" : "Low Stability";
  const spinBias = a.driverFlight === "low" ? "Low" : a.driverFlight === "high" ? "High" : "Mid";

  const swingSignature = [
    { label: "Club speed", value: `${showDriver ? result.driverSpeedEstimate : result.sevenIronSpeedEstimate} mph` },
    { label: "Start line bias", value: showIrons && !showDriver ? a.ironStartLine : a.driverStartLine },
    { label: "Tempo profile", value: showIrons && !showDriver ? a.ironTempo : a.driverTempo },
    ...(a.ironFaceStrike !== "unsure" ? [{ label: "Face strike", value: a.ironFaceStrike }] : []),
    { label: "Attack angle", value: a.driverFlight === "high" ? "Positive" : a.driverFlight === "low" ? "Negative" : "Neutral" },
    { label: "Curvature pattern", value: showIrons && !showDriver ? a.ironCurve : a.driverCurve },
    ...(a.ironLowPoint !== "unsure" ? [{ label: "Divot depth", value: a.ironLowPoint }] : []),
    ...(a.ironLowPoint !== "unsure" ? [{ label: "Low point / contact", value: a.ironLowPoint }] : []),
  ];

  const recommendationGroups = [
    showDriver && result.driver
      ? {
          title: "Driver recommendation",
          lines: [
            ["Fit score", `${result.driver.fitScore}%`],
            ["Shaft weight range", result.driver.shaft.weight],
            ["Flex", result.driver.shaft.flex],
            ["Launch target", result.driver.shaft.launch],
            ["Head bias", result.driver.primaryLever],
            ["Target swing weight", result.driver.targetSwingWeight],
          ],
        }
      : null,
    showIrons && result.irons
      ? {
          title: "Iron recommendation",
          lines: [
            ["Fit score", `${result.irons.fitScore}%`],
            ["Shaft weight range", result.irons.shaft.weight],
            ["Flex", result.irons.shaft.flex],
            ["Launch target", result.irons.shaft.launch],
            ["Head bias", result.irons.headBias],
            ["Target swing weight", result.irons.targetSwingWeight],
          ],
        }
      : null,
    result.wedges
      ? {
          title: "Wedge recommendation",
          lines: [
            ["Fit score", `${result.wedges.fitScore}%`],
            ["Shaft weight range", result.wedges.shaft.weight],
            ["Flex", result.wedges.shaft.flex],
            ["Launch target", result.wedges.shaft.bounce],
            ["Target swing weight", result.wedges.targetSwingWeight],
          ],
        }
      : null,
  ].filter(Boolean) as { title: string; lines: string[][] }[];

  const columnWidth = Math.floor((952 - (recommendationGroups.length - 1) * 24) / Math.max(1, recommendationGroups.length));

  return (
    <svg
      id="equipment-alignment-share-card"
      xmlns="http://www.w3.org/2000/svg"
      width={SHARE_CARD_WIDTH}
      height={SHARE_CARD_HEIGHT}
      viewBox={`0 0 ${SHARE_CARD_WIDTH} ${SHARE_CARD_HEIGHT}`}
      style={{ fontFamily: "var(--font-geist-sans), Geist, Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <defs>
        <clipPath id="qrClip">
          <rect x="0" y="0" width="112" height="112" rx="14" />
        </clipPath>
      </defs>
      <rect width={SHARE_CARD_WIDTH} height={SHARE_CARD_HEIGHT} fill="#ffffff" />

      <g opacity="0.05" transform="translate(540 560)">
        <circle r="190" fill="#0f172a" />
        <path
          d="M-112 -48c22-36 74-52 122-26 28 15 47 40 56 66 23-14 50-16 74-4 11 5 21 13 30 22-17 3-31 9-42 18-22 18-35 45-58 63-34 28-80 40-126 30-35-7-64-27-83-55 8-2 18-4 30-7 16-5 30-14 40-24-22-1-43-9-58-22-11-9-20-21-26-35 16 8 36 12 55 11-17-15-28-36-31-58 6 7 12 14 17 21z"
          fill="#ffffff"
        />
      </g>

      <g transform={`translate(${SHARE_CARD_PADDING}, ${SHARE_CARD_PADDING})`}>
        <circle cx="12" cy="12" r="12" fill="#0f172a" />
        <path d="M0 7c3-4 9-6 14-2 4 3 6 6 7 10 3-1 7-1 9 1-2 1-4 2-5 3-2 2-4 4-6 6-4 3-9 4-13 3-4-1-7-3-9-6 2 0 4 0 6-1 2-1 4-2 5-4-3 0-5-1-7-3-1-1-2-3-3-5 2 1 4 2 6 2-2-2-3-4-3-7l2 3z" fill="#fff" transform="translate(5 2) scale(0.65)" />
        <text x="34" y="15" fontSize="18" fontWeight="700" letterSpacing="1" fill="#0f172a">DOVE GOLF™</text>
        <text x="0" y="46" fontSize="16" fill="#334155">Equipment alignment record</text>

        <text x={contentWidth - 270} y="8" fontSize="13" fill="#475569">Certificate ID: {certificateId}</text>
        <text x={contentWidth - 270} y="29" fontSize="13" fill="#475569">Completed: {completedLabel}</text>
      </g>

      <text x="540" y="170" fontSize="62" fontWeight="600" textAnchor="middle" fill="#020617">{displayName}</text>
      {(energyTransfer || stabilityRequirement || spinBias) && (
        <text x="540" y="204" fontSize="15" textAnchor="middle" fill="#64748b">
          Primary fit identity: {energyTransfer} · {stabilityRequirement} · {spinBias}
        </text>
      )}

      <rect x="64" y="228" width="952" height="156" rx="18" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="88" y="258" fontSize="20" fontWeight="600" fill="#0f172a">Swing signature</text>
      {swingSignature.slice(0, 8).map((line, i) => (
        <g key={line.label}>
          <text x={88 + (i % 2) * 470} y={286 + Math.floor(i / 2) * 24} fontSize="14" fill="#64748b">{line.label}</text>
          <text x={270 + (i % 2) * 470} y={286 + Math.floor(i / 2) * 24} fontSize="14" fill="#0f172a" fontWeight="500">{line.value}</text>
        </g>
      ))}

      <rect x="64" y="402" width="952" height="172" rx="18" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="88" y="432" fontSize="20" fontWeight="600" fill="#0f172a">Impact visuals</text>
      <rect x="88" y="448" width="286" height="108" rx="12" fill="#ffffff" stroke="#e2e8f0" />
      <svg x="96" y="456" width="270" height="92" viewBox="0 0 520 160">
        <BallFlightViz start={modelStart} curve={modelCurve} compact={false} staticRender />
      </svg>
      <rect x="397" y="448" width="286" height="108" rx="12" fill="#ffffff" stroke="#e2e8f0" />
      <svg x="410" y="454" width="260" height="94" viewBox="0 0 260 120">
        <LowPointViz lowPoint={a.ironLowPoint} staticRender />
      </svg>
      <rect x="706" y="448" width="286" height="108" rx="12" fill="#ffffff" stroke="#e2e8f0" />
      <svg x="719" y="454" width="260" height="94" viewBox="0 0 260 120">
        <FaceStrikeViz strike={a.ironFaceStrike} />
      </svg>

      <rect x="64" y="590" width="952" height="214" rx="18" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="88" y="620" fontSize="20" fontWeight="600" fill="#0f172a">Equipment recommendations</text>
      {recommendationGroups.map((group, i) => (
        <g key={group.title} transform={`translate(${88 + i * (columnWidth + 24)}, 645)`}>
          {i > 0 && <line x1={-12} x2={-12} y1={-4} y2={146} stroke="#e2e8f0" />}
          <text x="0" y="0" fontSize="16" fontWeight="600" fill="#0f172a">{group.title}</text>
          {group.lines.slice(0, 6).map(([label, value], lineIndex) => (
            <g key={`${group.title}-${label}`}>
              <text x="0" y={24 + lineIndex * 22} fontSize="13" fill="#64748b">{label}</text>
              <text x={columnWidth - 4} y={24 + lineIndex * 22} fontSize="13" fill="#0f172a" textAnchor="end" fontWeight="500">{value}</text>
            </g>
          ))}
        </g>
      ))}

      <rect x="64" y="820" width="952" height="134" rx="18" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="88" y="850" fontSize="20" fontWeight="600" fill="#0f172a">What drove this fit</text>
      {(result.cause ?? []).slice(0, 5).map((item, i) => (
        <text key={`cause-${i}`} x="104" y={876 + i * 20} fontSize="13" fill="#334155">• {item}</text>
      ))}

      <text x="540" y="1038" fontSize="70" fontWeight="600" textAnchor="middle" fill="#020617">{alignmentScore}%</text>
      <text x="540" y="1064" fontSize="18" textAnchor="middle" fill="#64748b">Equipment alignment score</text>

      <text x="64" y="1290" fontSize="12" fill="#475569">
        Certified by DoveFit™ Diagnostic Engine · Physics-Based Equipment Mapping
      </text>
      <text x="640" y="1265" fontSize="12" fill="#64748b">Verify at: {verificationUrl}</text>

      <rect x="888" y="1208" width="128" height="128" rx="14" fill="#ffffff" stroke="#e2e8f0" />
      <g transform="translate(896 1216)" clipPath="url(#qrClip)">
        <g dangerouslySetInnerHTML={{ __html: qrSvgMarkup }} />
      </g>
    </svg>
  );
}

/* ---------------- UI: ChoiceChips (FIXED: no nested buttons) ---------------- */

type ChipOption<T extends string> = { value: T; label: string; help?: string };

function ChoiceChips<T extends string>(props: {
  mode: "single";
  value: T;
  onChange: (v: T) => void;
  options: ChipOption<T>[];
}): React.ReactElement;
function ChoiceChips<T extends string>(props: {
  mode: "multi";
  value: T[];
  onChange: (v: T[]) => void;
  maxSelections: number;
  options: ChipOption<T>[];
}): React.ReactElement;

function ChoiceChips<T extends string>(
  props:
    | { mode: "single"; value: T; onChange: (v: T) => void; options: ChipOption<T>[] }
    | { mode: "multi"; value: T[]; onChange: (v: T[]) => void; maxSelections: number; options: ChipOption<T>[] }
) {
  const [openHelp, setOpenHelp] = React.useState<T | null>(null);

  React.useEffect(() => {
    function onDocDown(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return setOpenHelp(null);
      if (t.closest?.('[data-help-root="1"]')) return;
      setOpenHelp(null);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2" data-help-root="1">
      {props.options.map((opt) => {
        const active =
          props.mode === "single" ? opt.value === props.value : (props.value as T[]).includes(opt.value);

        const disabled =
          props.mode === "multi" &&
          !(props.value as T[]).includes(opt.value) &&
          (props.value as T[]).length >= (props as any).maxSelections;

        function handleChipClick() {
          if (disabled) return;

          if (props.mode === "single") {
            props.onChange(opt.value as any);
            return;
          }
          const current = props.value as T[];
          const exists = current.includes(opt.value);

          if (exists) {
            props.onChange(current.filter((x) => x !== opt.value));
            return;
          }
          if (current.length >= (props as any).maxSelections) return;
          props.onChange([...current, opt.value]);
        }

        const showHelp = openHelp === opt.value;

        return (
          <div key={opt.value} className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={handleChipClick}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChipClick();
                }
              }}
              aria-pressed={active}
              aria-disabled={disabled}
              className={[
                "relative w-full rounded-2xl border px-4 py-4 text-left transition select-none outline-none",
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium">{opt.label}</div>

                {opt.help ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenHelp((prev) => (prev === opt.value ? null : opt.value));
                    }}
                    className={[
                      "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                      active ? "border-white/40 text-white/90" : "border-slate-300 text-slate-600",
                    ].join(" ")}
                    aria-label="More info"
                    aria-expanded={showHelp}
                  >
                    i
                  </button>
                ) : null}
              </div>
            </div>

            {opt.help && showHelp ? (
              <div className="absolute left-3 right-3 top-full z-10 mt-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-sm">
                {opt.help}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

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

function MiniVizCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-600">Visual</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* ---------------- MICRO-VISUALS (SVG) ---------------- */

/**
 * BallFlightViz (FIXED to your yellow-highlight spec):
 * ✅ Start point is LEFT/CENTER/RIGHT of target line (true start)
 * ✅ End point ALWAYS lands on target line (center)
 * ✅ Draw = curves LEFT toward target, Fade = curves RIGHT toward target
 * ✅ NO moving ball circle (removes the stray/yellow dot issue)
 * ✅ "start" label sits under the true start point
 */
function BallFlightViz({
  start,
  curve,
  compact = true,
  staticRender = false,
}: {
  start: StartLine;
  curve: Curve;
  compact?: boolean;
  staticRender?: boolean;
}) {
  const w = compact ? 260 : 520;
  const h = compact ? 120 : 160;

  const groundY = h * 0.78;
  const targetX = w * 0.5;

  // True start point is offset from the target line
  const startOffset =
    start === "left" ? -w * 0.18 : start === "right" ? w * 0.18 : 0;

  const sx = targetX + startOffset;
  const sy = groundY;

  // End point ALWAYS on target line (your requirement)
  const ex = targetX;
  const ey = h * 0.20;

  // Curve direction: draw = left, fade = right
  const sign = curve === "draw" ? 1 : curve === "fade" ? -1 : 0;

  const bend = sign * w * 0.22;
  const midX = (sx + ex) / 2;

  const c1x = sx + bend * 0.35;
  const c1y = h * 0.62;

  const c2x = midX + bend;
  const c2y = h * 0.28;

  const path = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;

  const startLabelX = Math.max(w * 0.06, Math.min(sx - 14, w * 0.94));

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line
        x1={w * 0.1}
        y1={groundY}
        x2={w * 0.9}
        y2={groundY}
        stroke="rgb(226 232 240)"
        strokeWidth="2"
      />

      <line
        x1={targetX}
        y1={groundY}
        x2={targetX}
        y2={h * 0.12}
        stroke="rgb(203 213 225)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      <path
        d={path}
        fill="none"
        stroke="rgb(15 23 42)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={staticRender ? undefined : "900"}
        strokeDashoffset={staticRender ? undefined : "900"}
      >
        {!staticRender && <animate attributeName="stroke-dashoffset" from="900" to="0" dur="0.9s" fill="freeze" />}
      </path>

      <text x={startLabelX} y={h * 0.95} fontSize="10" fill="rgb(100 116 139)">
        start
      </text>
      <text x={targetX + 10} y={h * 0.16} fontSize="10" fill="rgb(100 116 139)">
        target
      </text>
    </svg>
  );
}

/**
 * FaceStrikeViz:
 * - Heel/toe always show
 * - Shaft/hosel reference on RIGHT (toe side)
 */
function FaceStrikeViz({
  strike,
}: {
  strike: "heel" | "center" | "toe" | "mixed" | "unsure" | "all_over";
}) {
  const w = 260;
  const h = 120;

  const faceX = w * 0.22;
  const faceY = h * 0.30;
  const faceW = w * 0.56;
  const faceH = h * 0.50;

  const hoselX = faceX + faceW + 6;
  const hoselY = faceY + faceH * 0.25;
  const hoselW = 10;
  const hoselH = faceH * 0.55;

  const shaftX1 = hoselX + hoselW * 0.65;
  const shaftY1 = hoselY + hoselH * 0.15;
  const shaftX2 = shaftX1 + 22;
  const shaftY2 = shaftY1 - 26;

  const y = faceY + faceH * 0.55;
  const heelX = faceX + faceW * 0.25;
  const centerX = faceX + faceW * 0.50;
  const toeX = faceX + faceW * 0.75;

  const normalized = strike === "all_over" ? "mixed" : strike;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <rect
        x={faceX}
        y={faceY}
        width={faceW}
        height={faceH}
        rx="18"
        fill="rgb(248 250 252)"
        stroke="rgb(226 232 240)"
        strokeWidth="2"
      />

      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={faceX + faceW * 0.06}
          x2={faceX + faceW * 0.94}
          y1={faceY + faceH * (0.18 + i * 0.12)}
          y2={faceY + faceH * (0.18 + i * 0.12)}
          stroke="rgb(226 232 240)"
          strokeWidth="2"
        />
      ))}

      <rect
        x={hoselX}
        y={hoselY}
        width={hoselW}
        height={hoselH}
        rx="6"
        fill="rgb(241 245 249)"
        stroke="rgb(226 232 240)"
        strokeWidth="2"
      />
      <line
        x1={shaftX1}
        y1={shaftY1}
        x2={shaftX2}
        y2={shaftY2}
        stroke="rgb(226 232 240)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {normalized === "mixed" && (
        <>
          <circle cx={heelX} cy={y} r={4} fill="rgb(148 163 184)" />
          <circle cx={centerX} cy={y} r={5} fill="rgb(100 116 139)" />
          <circle cx={toeX} cy={y} r={4} fill="rgb(148 163 184)" />
        </>
      )}

      {normalized === "center" && <circle cx={centerX} cy={y} r={7} fill="rgb(15 23 42)" />}
      {normalized === "heel" && <circle cx={heelX} cy={y} r={6} fill="rgb(148 163 184)" />}
      {normalized === "toe" && <circle cx={toeX} cy={y} r={6} fill="rgb(148 163 184)" />}
      {normalized === "unsure" && <circle cx={centerX} cy={y} r={5} fill="rgb(203 213 225)" />}

      <text x={faceX} y={faceY + faceH + 16} fontSize="10" fill="rgb(100 116 139)">
        heel
      </text>
      <text x={faceX + faceW - 22} y={faceY + faceH + 16} fontSize="10" fill="rgb(100 116 139)">
        toe
      </text>
      <text x={hoselX - 2} y={faceY - 6} fontSize="10" fill="rgb(100 116 139)">
        shaft
      </text>
    </svg>
  );
}

/**
 * LowPointViz:
 * - U-shaped divot (dips into ground)
 */
function LowPointViz({ lowPoint, staticRender = false }: { lowPoint: IronLowPoint; staticRender?: boolean }) {
  const w = 260;
  const h = 120;

  const groundY = h * 0.72;
  const ballX = w * 0.5;
  const ballY = groundY - 10;

  let divotX = ballX;
  let divotKind: "before" | "after" | "shallow" | "none" = "none";

  if (lowPoint === "fat") {
    divotKind = "before";
    divotX = ballX - 40;
  } else if (lowPoint === "ball_first") {
    divotKind = "after";
    divotX = ballX + 32;
  } else if (lowPoint === "shallow") {
    divotKind = "shallow";
    divotX = ballX + 18;
  } else {
    divotKind = "none";
  }

  const depth =
    divotKind === "before" ? 14 : divotKind === "after" ? 16 : divotKind === "shallow" ? 8 : 0;

  const divotPath =
    divotKind === "none"
      ? ""
      : `M ${divotX - 22} ${groundY}
         Q ${divotX} ${groundY + depth}
         ${divotX + 22} ${groundY}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={w * 0.1} y1={groundY} x2={w * 0.9} y2={groundY} stroke="rgb(226 232 240)" strokeWidth="3" />
      <circle cx={ballX} cy={ballY} r={6} fill="rgb(15 23 42)" />

      {divotPath ? (
        <path
          d={divotPath}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={staticRender ? undefined : "200"}
          strokeDashoffset={staticRender ? undefined : "200"}
        >
          {!staticRender && <animate attributeName="stroke-dashoffset" from="200" to="0" dur="0.55s" fill="freeze" />}
        </path>
      ) : (
        <text x={w * 0.34} y={h * 0.5} fontSize="11" fill="rgb(100 116 139)">
          {lowPoint === "thin" ? "thin contact (no divot)" : "—"}
        </text>
      )}

      <text x={w * 0.1} y={h * 0.95} fontSize="10" fill="rgb(100 116 139)">
        ground
      </text>
    </svg>
  );
}

/**
 * WedgeTurfViz:
 * - Same “style language” as LowPointViz, but tailored to wedges.
 * - Digger: deeper entry + longer “trench”
 * - Sweeper: very shallow brush
 * - Neutral: moderate divot
 */
function WedgeTurfViz({ turf }: { turf: Turf }) {
  const w = 260;
  const h = 120;

  const groundY = h * 0.72;
  const impactX = w * 0.52;

  const kind =
    turf === "digger" ? "digger" : turf === "sweeper" ? "sweeper" : turf === "neutral" ? "neutral" : "unsure";

  const depth = kind === "digger" ? 18 : kind === "neutral" ? 12 : kind === "sweeper" ? 6 : 0;
  const length = kind === "digger" ? 70 : kind === "neutral" ? 52 : kind === "sweeper" ? 40 : 0;

  const startX = impactX - length * 0.55;
  const endX = impactX + length * 0.45;

  const path =
    kind === "unsure"
      ? ""
      : `M ${startX} ${groundY}
         Q ${impactX} ${groundY + depth}
         ${endX} ${groundY}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={w * 0.1} y1={groundY} x2={w * 0.9} y2={groundY} stroke="rgb(226 232 240)" strokeWidth="3" />

      {/* reference “impact” tick */}
      <line
        x1={impactX}
        y1={groundY - 18}
        x2={impactX}
        y2={groundY - 2}
        stroke="rgb(203 213 225)"
        strokeWidth="2"
        strokeDasharray="4 5"
      />

      {path ? (
        <path
          d={path}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset="220"
        >
          <animate attributeName="stroke-dashoffset" from="220" to="0" dur="0.55s" fill="freeze" />
        </path>
      ) : (
        <text x={w * 0.38} y={h * 0.5} fontSize="11" fill="rgb(100 116 139)">
          —
        </text>
      )}

      <text x={w * 0.1} y={h * 0.95} fontSize="10" fill="rgb(100 116 139)">
        ground
      </text>
      <text x={impactX - 18} y={h * 0.20} fontSize="10" fill="rgb(100 116 139)">
        entry
      </text>
    </svg>
  );
}

/**
 * WedgeMissViz:
 * - Fat: low point before ball (chunk)
 * - Thin: no-divot / skim + “thin” label
 * - Both: show both markers lightly
 */
function WedgeMissViz({ miss }: { miss: WedgeMiss }) {
  const w = 260;
  const h = 120;

  const groundY = h * 0.72;
  const ballX = w * 0.52;
  const ballY = groundY - 10;

  const showFat = miss === "fat" || miss === "both";
  const showThin = miss === "thin" || miss === "both";

  const fatX = ballX - 34;
  const fatDepth = 14;

  const fatPath = `M ${fatX - 18} ${groundY} Q ${fatX} ${groundY + fatDepth} ${fatX + 18} ${groundY}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={w * 0.1} y1={groundY} x2={w * 0.9} y2={groundY} stroke="rgb(226 232 240)" strokeWidth="3" />
      <circle cx={ballX} cy={ballY} r={6} fill="rgb(15 23 42)" />

      {showFat && (
        <path
          d={fatPath}
          fill="none"
          stroke={miss === "both" ? "rgb(148 163 184)" : "rgb(15 23 42)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="200"
          strokeDashoffset="200"
        >
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="0.5s" fill="freeze" />
        </path>
      )}

      {showThin && (
        <>
          <line
            x1={ballX - 18}
            y1={groundY - 1}
            x2={ballX + 26}
            y2={groundY - 6}
            stroke={miss === "both" ? "rgb(148 163 184)" : "rgb(15 23 42)"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="140"
            strokeDashoffset="140"
          >
            <animate attributeName="stroke-dashoffset" from="140" to="0" dur="0.45s" fill="freeze" />
          </line>
          {miss === "thin" && (
            <text x={w * 0.34} y={h * 0.5} fontSize="11" fill="rgb(100 116 139)">
              thin contact
            </text>
          )}
        </>
      )}

      {miss === "unsure" && (
        <text x={w * 0.38} y={h * 0.5} fontSize="11" fill="rgb(100 116 139)">
          —
        </text>
      )}

      <text x={w * 0.1} y={h * 0.95} fontSize="10" fill="rgb(100 116 139)">
        ground
      </text>
    </svg>
  );
}
