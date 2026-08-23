import type { PatternSlug } from "@/lib/learn/ballFlightPatterns";

export type StartInput = "left" | "straight" | "right";
export type CurveInput = "left" | "straight" | "right";
export type StrikeInput = "heel" | "center" | "toe" | "unknown";
export type StrikeRole = "supports" | "opposes" | "ambiguous" | "neutral" | "unknown";

export type DecoderInput = {
  start: StartInput;
  curve: CurveInput;
  strike: StrikeInput;
};

export type DecoderResult = {
  patternSlug: PatternSlug;
  faceSummary: string;
  pathSummary: string;
  strikeRole: StrikeRole;
  strikeSummary: string;
  techniqueGuidance: string;
  equipmentGuidance: string;
  nextTest: string;
  caveat: string;
};

const UNIVERSAL_CAVEAT =
  "Ball flight is evidence, not a swing diagnosis. Wind, lie, alignment, club type, strike height, and one-off timing can change the result. This tool cannot infer exact face or path angles, and its horizontal gear-effect note is most relevant to drivers and fairway woods. Use a cluster of comparable shots.";

const START_PREFIX: Record<StartInput, "pull" | "straight" | "push"> = {
  left: "pull",
  straight: "straight",
  right: "push",
};

const CURVE_SUFFIX: Record<CurveInput, "draw" | "straight" | "fade"> = {
  left: "draw",
  straight: "straight",
  right: "fade",
};

const FACE_COPY: Record<StartInput, string> = {
  left: "The start line suggests the delivered face was left of the target at impact.",
  straight: "The start line suggests the delivered face was near the target at impact.",
  right: "The start line suggests the delivered face was right of the target at impact.",
};

const PATH_COPY: Record<CurveInput, string> = {
  left:
    "The leftward curve suggests the face was closed to the club path—the path traveled farther right than the face. That does not prove the path was right of the target.",
  straight:
    "The mostly straight flight suggests face and path were closely matched. It does not prove either was square to the target.",
  right:
    "The rightward curve suggests the face was open to the club path—the path traveled farther left than the face. That does not prove the path was left of the target.",
};

function patternSlug(start: StartInput, curve: CurveInput): PatternSlug {
  return `${START_PREFIX[start]}-${CURVE_SUFFIX[curve]}` as PatternSlug;
}

function strikeRead(strike: StrikeInput, curve: CurveInput): Pick<DecoderResult, "strikeRole" | "strikeSummary"> {
  if (strike === "unknown") {
    return {
      strikeRole: "unknown",
      strikeSummary:
        "Strike location is unknown, so this result cannot separate face/path delivery from horizontal gear effect.",
    };
  }

  if (strike === "center") {
    return {
      strikeRole: "neutral",
      strikeSummary:
        "Centered contact makes horizontal gear effect less likely to be the main source, especially with a driver or fairway wood.",
    };
  }

  if (curve === "straight") {
    return {
      strikeRole: "ambiguous",
      strikeSummary:
        `A mostly straight flight despite ${strike} contact may mean face/path and strike effects offset one another. On a driver or fairway wood, horizontal gear effect may be part of that offset. One shot cannot separate them.`,
    };
  }

  const supports = (strike === "heel" && curve === "right") || (strike === "toe" && curve === "left");
  const strikeCurve = strike === "heel" ? "rightward" : "leftward";
  const observedCurve = curve === "right" ? "rightward" : "leftward";

  if (supports) {
    return {
      strikeRole: "supports",
      strikeSummary:
        `On a driver or fairway wood, ${strike} contact can add ${strikeCurve} gear-effect curve, so it may be amplifying this pattern.`,
    };
  }

  return {
    strikeRole: "opposes",
    strikeSummary:
      `On a driver or fairway wood, ${strike} gear effect usually bends ${strikeCurve.replace("ward", "")}, so it does not explain this ${observedCurve} curve; face-to-path likely outweighed it.`,
  };
}

function equipmentGuidance(strike: StrikeInput): string {
  if (strike === "unknown") {
    return "Do not choose a shaft, head setting, lie angle, or club length until you measure the strike cluster.";
  }

  if (strike === "center") {
    return "A centered strike does not identify a specific equipment change. Equipment can influence delivery and dispersion, but these inputs cannot prescribe shaft, loft, lie, or head bias.";
  }

  if (strike === "heel") {
    return "A repeated heel cluster can justify a controlled playing-length or setup test. A single heel strike does not prove the club is too long.";
  }

  return "A repeated toe cluster can justify checking setup and effective playing length with a fitter. A single toe strike does not prove the club is too short or the lie is wrong.";
}

function nextTest(input: DecoderInput): string {
  if (input.strike === "unknown") {
    return "Apply impact tape and hit seven shots with the same club, target, and tee height. Record the dominant heel/center/toe cluster, then run the decoder again.";
  }

  if (input.strike === "heel") {
    return "Use impact tape for two five-shot sets: normal grip, then gripping down 1/2 inch, with the same club, target, and tee height. If contact centers and dispersion improves, playing length or setup is worth testing with a fitter.";
  }

  if (input.strike === "toe") {
    return "Use impact tape for two five-shot sets: normal speed, then about 75% speed, with the same club and target. Compare curve only on centered strikes; that separates strike contribution from the face/path pattern.";
  }

  if (input.start === "straight" && input.curve === "straight") {
    return "Hit ten shots with impact tape on one target and record start and finish dispersion. If centered contact and the flight cluster are stable, keep the pattern and only fit for a separate distance, launch, or consistency goal.";
  }

  return "Choose an intermediate target three to five feet in front of the ball. Hit seven shots with impact tape and record start direction before curve. If centered strikes repeat this pattern, face/path delivery is the lead hypothesis.";
}

export function decodeBallFlight(input: DecoderInput): DecoderResult {
  const strike = strikeRead(input.strike, input.curve);
  const isNeutral = input.start === "straight" && input.curve === "straight";

  return {
    patternSlug: patternSlug(input.start, input.curve),
    faceSummary: FACE_COPY[input.start],
    pathSummary: PATH_COPY[input.curve],
    ...strike,
    techniqueGuidance: isNeutral
      ? "These inputs do not show an obvious directional fault. Verify the pattern over a group of shots before trying to change it."
      : "Treat impact delivery as the lead hypothesis: confirm alignment, then work from delivered face and face-to-path. Ball flight alone cannot name a body-motion fault.",
    equipmentGuidance: equipmentGuidance(input.strike),
    nextTest: nextTest(input),
    caveat: UNIVERSAL_CAVEAT,
  };
}
