// src/lib/engine/driverShaftShortlist.ts
import { DRIVER_SHAFT_CATALOG, DriverShaftModel, LaunchBand, StabilityBand, WeightClass } from "@/lib/catalog/driverShafts";

export type DriverProfileForShortlist = {
  weightRange: string; // e.g. "60–70g"
  flex: string; // e.g. "Stiff (S)" or "Regular (R) to Stiff (S)"
  torqueRange: string; // e.g. "2.8–3.6° (mid-low torque)"
  launchBias: "low" | "mid" | "high";
  balanceBias: "neutral" | "counterbalanced" | "head-heavy";
};

export type DriverContextForShortlist = {
  primaryFix: "slice" | "hook" | "dispersion";
  tempo: "smooth" | "moderate" | "aggressive";
};

export type ShortlistItem = {
  rank: 1 | 2 | 3;
  name: string;
  weightClass: "50g" | "60g" | "70g";
  flex: "R" | "S" | "X";
  msrpUSD: string;
  why: string[];
  // for later (affiliate / retailer)
  buyLink?: string;
  debugScore?: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function parseWeightClass(weightRangeLabel: string): WeightClass {
  // Extract midpoint from "60–70g" etc; fallback to 60.
  const m = weightRangeLabel.match(/(\d+)\D+(\d+)/);
  const mid = m ? (Number(m[1]) + Number(m[2])) / 2 : 60;

  if (mid < 58) return "50";
  if (mid < 68) return "60";
  return "70";
}

function pickFlexFromLabel(flexLabel: string): "R" | "S" | "X" {
  // v1: choose the “middle” if range; prioritize S for most ranges
  const s = flexLabel.toUpperCase();
  if (s.includes("X")) return "X";
  if (s.includes("STIFF") || s.includes("(S)")) return "S";
  if (s.includes("REG") || s.includes("(R)")) return "R";
  // default
  return "S";
}

function stabilityNeed(ctx: DriverContextForShortlist): StabilityBand {
  // v1:
  // - dispersion or aggressive tempo => stable/very_stable
  // - slice => stable
  // - hook => very_stable (anti-left)
  if (ctx.primaryFix === "hook") return "very_stable";
  if (ctx.primaryFix === "dispersion") return ctx.tempo === "aggressive" ? "very_stable" : "stable";
  if (ctx.primaryFix === "slice") return ctx.tempo === "aggressive" ? "very_stable" : "stable";
  return "stable";
}

function mapLaunchBiasToTarget(launchBias: "low" | "mid" | "high"): LaunchBand[] {
  // Acceptable matches (tight-ish but not brittle)
  if (launchBias === "low") return ["low", "mid"];
  if (launchBias === "high") return ["high", "mid_high"];
  return ["mid", "mid_high"];
}

function torqueHintFromLabel(torqueRangeLabel: string): "low" | "mid" | "mid_high" {
  const t = torqueRangeLabel.toLowerCase();
  if (t.includes("lower") || t.includes("mid-low") || t.includes("2.")) return "low";
  if (t.includes("mid-high") || t.includes("4.")) return "mid_high";
  return "mid";
}

function scoreModel(model: DriverShaftModel, target: {
  weightClass: WeightClass;
  flex: "R" | "S" | "X";
  launchTargets: LaunchBand[];
  stability: StabilityBand;
  torque: "low" | "mid" | "mid_high";
  ctx: DriverContextForShortlist;
}): { score: number; why: string[] } {
  let score = 0;
  const why: string[] = [];

  // Weight class match
  if (model.weightClasses.includes(target.weightClass)) {
    score += 22;
    why.push(`${target.weightClass}g class matches your recommended weight range.`);
  } else {
    // adjacent class penalty
    score -= 8;
  }

  // Flex match (must be available)
  if (model.flexes.includes(target.flex)) {
    score += 18;
    why.push(`Available in ${target.flex} flex, matching your driver flex target.`);
  } else {
    score -= 20;
  }

  // Launch match
  if (target.launchTargets.includes(model.launch)) {
    score += 18;
    why.push(`Launch profile aligns with your ${target.launchTargets[0]}-bias target.`);
  } else {
    score -= 8;
  }

  // Stability match
  const stabilityRank = (s: StabilityBand) => (s === "neutral" ? 0 : s === "stable" ? 1 : 2);
  const need = stabilityRank(target.stability);
  const have = stabilityRank(model.stability);

  if (have >= need) {
    score += 18;
    why.push(`Stability is ${model.stability.replace("_", " ")}, which supports your miss/tempo needs.`);
  } else {
    score -= 10;
  }

  // Torque hint
  const torqueRank = (t: "low" | "mid" | "mid_high") => (t === "low" ? 0 : t === "mid" ? 1 : 2);
  const tNeed = torqueRank(target.torque);
  const tHave = torqueRank(model.torque);

  if (Math.abs(tNeed - tHave) <= 1) {
    score += 8;
    why.push(`Torque feel (${model.torque.replace("_", " ")}) is compatible with your stability goal.`);
  } else {
    score -= 4;
  }

  // Context nudges (small, so we don’t overfit)
  if (target.ctx.primaryFix === "hook" && model.launch === "low" && model.spin === "low") {
    score += 6;
    why.push("Lower launch/spin can help reduce left + ballooning tendency.");
  }
  if (target.ctx.primaryFix === "slice" && model.feel === "smooth") {
    score += 4;
    why.push("Smoother feel can help some players square the face more consistently.");
  }
  if (target.ctx.primaryFix === "dispersion" && model.stability !== "neutral") {
    score += 4;
    why.push("Stability bias is a good fit for two-way miss / dispersion control.");
  }

  // Keep “why” concise (cap)
  return { score, why: why.slice(0, 4) };
}

export function getTopDriverShaftShortlist(
  profile: DriverProfileForShortlist,
  ctx: DriverContextForShortlist
): ShortlistItem[] {
  const weightClass = parseWeightClass(profile.weightRange);
  const flex = pickFlexFromLabel(profile.flex);
  const launchTargets = mapLaunchBiasToTarget(profile.launchBias);
  const stability = stabilityNeed(ctx);
  const torque = torqueHintFromLabel(profile.torqueRange);

  const scored = DRIVER_SHAFT_CATALOG.map((m) => {
    const { score, why } = scoreModel(m, {
      weightClass,
      flex,
      launchTargets,
      stability,
      torque,
      ctx,
    });
    return { m, score, why };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map((s, idx) => ({
    rank: (idx + 1) as 1 | 2 | 3,
    name: `${s.m.brand} ${s.m.model}`,
    weightClass: `${weightClass}g`,
    flex,
    msrpUSD: s.m.msrpUSD,
    why: s.why,
    buyLink: s.m.buyLink,
    debugScore: s.score,
  }));
}