import { BALL_FLIGHT_PATTERNS } from "@/lib/learn/ballFlightPatterns";
import { decodeBallFlight } from "@/components/tools/ball-flight-decoder/model";

export type DiagnosisInsightLabel =
  | "Impact interpretation"
  | "Fit rationale"
  | "Leading hypothesis";

type Lever =
  | "faceControl"
  | "pathDirection"
  | "strikeGearEffect"
  | "setupAlignment"
  | "equipmentContribution";

export type DiagnosisEmailInput =
  | {
      kind: "ball_flight_decoder";
      start: "left" | "straight" | "right";
      curve: "left" | "straight" | "right";
      strike: "heel" | "center" | "toe" | "unknown";
    }
  | {
      kind: "equipment_fit";
      focus: "driver_woods" | "irons" | "wedges" | "full_bag";
      driverStart: "left" | "center" | "right" | "unsure";
      driverCurve: "draw" | "straight" | "fade" | "unsure";
      driverStrike: "heel" | "center" | "toe" | "all_over";
      ironStart: "left" | "center" | "right" | "unsure";
      ironCurve: "draw" | "straight" | "fade" | "unsure";
      ironStrike: "heel" | "center" | "toe" | "mixed" | "unsure";
      ironLowPoint: "ball_first" | "shallow" | "fat" | "thin" | "unsure";
      wedgeMiss: "fat" | "thin" | "both" | "unsure";
      wedgeTurf: "digger" | "neutral" | "sweeper" | "unsure";
    }
  | {
      kind: "driver_slice";
      startLine: "left" | "center" | "right" | "unsure";
      curveSeverity: "none" | "slight" | "moderate" | "severe";
      strikeLocation: "heel" | "center" | "toe" | "high" | "low" | "unsure";
      primaryLever: Lever;
    }
  | {
      kind: "pull_hook";
      startLine: "left" | "center" | "right" | "unsure";
      curveSeverity: "none" | "slight" | "moderate" | "severe";
      strikeLocation: "heel" | "center" | "toe" | "high" | "low" | "unsure";
      primaryLever: Lever;
    }
  | {
      kind: "ball_curves_right";
      variantId:
        | "curves-right-center"
        | "curves-right-from-left"
        | "curves-right-from-right";
    };

export type DiagnosisEmailContent = {
  miss: string;
  insightLabel: DiagnosisInsightLabel;
  insight: string;
  rangePlan: string;
  shareUrl: string;
};

const STARTS = new Set(["left", "center", "right", "straight", "unsure"]);
const CURVES = new Set(["left", "right", "draw", "fade", "straight", "unsure"]);
const STRIKES = new Set(["heel", "center", "toe", "high", "low", "mixed", "all_over", "unknown", "unsure"]);
const SEVERITIES = new Set(["none", "slight", "moderate", "severe"]);
const LEVERS = new Set<Lever>([
  "faceControl",
  "pathDirection",
  "strikeGearEffect",
  "setupAlignment",
  "equipmentContribution",
]);
const FOCUSES = new Set(["driver_woods", "irons", "wedges", "full_bag"]);
const LOW_POINTS = new Set(["ball_first", "shallow", "fat", "thin", "unsure"]);
const WEDGE_MISSES = new Set(["fat", "thin", "both", "unsure"]);
const TURF_TYPES = new Set(["digger", "neutral", "sweeper", "unsure"]);
const VARIANTS = new Set([
  "curves-right-center",
  "curves-right-from-left",
  "curves-right-from-right",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, expected: string[]) {
  const actual = Object.keys(value).sort();
  const keys = [...expected].sort();
  return actual.length === keys.length && actual.every((key, index) => key === keys[index]);
}

function isAllowed(value: unknown, values: Set<string>) {
  return typeof value === "string" && values.has(value);
}

export function parseDiagnosisEmailInput(value: unknown): DiagnosisEmailInput | null {
  if (!isPlainObject(value) || typeof value.kind !== "string") return null;

  if (
    value.kind === "ball_flight_decoder" &&
    exactKeys(value, ["kind", "start", "curve", "strike"]) &&
    isAllowed(value.start, new Set(["left", "straight", "right"])) &&
    isAllowed(value.curve, new Set(["left", "straight", "right"])) &&
    isAllowed(value.strike, new Set(["heel", "center", "toe", "unknown"]))
  ) {
    return value as DiagnosisEmailInput;
  }

  if (
    value.kind === "equipment_fit" &&
    exactKeys(value, [
      "kind",
      "focus",
      "driverStart",
      "driverCurve",
      "driverStrike",
      "ironStart",
      "ironCurve",
      "ironStrike",
      "ironLowPoint",
      "wedgeMiss",
      "wedgeTurf",
    ]) &&
    isAllowed(value.focus, FOCUSES) &&
    isAllowed(value.driverStart, STARTS) &&
    value.driverStart !== "straight" &&
    isAllowed(value.driverCurve, CURVES) &&
    !["left", "right"].includes(String(value.driverCurve)) &&
    isAllowed(value.driverStrike, STRIKES) &&
    ["heel", "center", "toe", "all_over"].includes(String(value.driverStrike)) &&
    isAllowed(value.ironStart, STARTS) &&
    value.ironStart !== "straight" &&
    isAllowed(value.ironCurve, CURVES) &&
    !["left", "right"].includes(String(value.ironCurve)) &&
    isAllowed(value.ironStrike, STRIKES) &&
    !["all_over", "unknown", "high", "low"].includes(String(value.ironStrike)) &&
    isAllowed(value.ironLowPoint, LOW_POINTS) &&
    isAllowed(value.wedgeMiss, WEDGE_MISSES) &&
    isAllowed(value.wedgeTurf, TURF_TYPES)
  ) {
    return value as DiagnosisEmailInput;
  }

  if (
    (value.kind === "driver_slice" || value.kind === "pull_hook") &&
    exactKeys(value, ["kind", "startLine", "curveSeverity", "strikeLocation", "primaryLever"]) &&
    isAllowed(value.startLine, STARTS) &&
    value.startLine !== "straight" &&
    isAllowed(value.curveSeverity, SEVERITIES) &&
    isAllowed(value.strikeLocation, STRIKES) &&
    !["mixed", "all_over", "unknown"].includes(String(value.strikeLocation)) &&
    isAllowed(value.primaryLever, LEVERS)
  ) {
    return value as DiagnosisEmailInput;
  }

  if (
    value.kind === "ball_curves_right" &&
    exactKeys(value, ["kind", "variantId"]) &&
    isAllowed(value.variantId, VARIANTS)
  ) {
    return value as DiagnosisEmailInput;
  }

  return null;
}

const LEVER_COPY: Record<Lever, string> = {
  faceControl:
    "Impact geometry points first to face delivery. Ball flight identifies the face-to-path relationship, not the motion that created it.",
  pathDirection:
    "The face-to-path relationship points first to path direction. Exact path direction relative to the target remains a hypothesis to test.",
  strikeGearEffect:
    "Strike location may amplify curve with a driver or fairway wood. Face-to-path can still be involved.",
  setupAlignment:
    "Setup or aim may bias the start line, but ball flight alone does not prove a setup fault.",
  equipmentContribution:
    "Equipment may amplify the pattern, but these observations do not establish equipment as its root cause.",
};

function human(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function buildDiagnosisEmailContent(input: DiagnosisEmailInput): DiagnosisEmailContent {
  if (input.kind === "ball_flight_decoder") {
    const result = decodeBallFlight(input);
    return {
      miss: BALL_FLIGHT_PATTERNS[result.patternSlug].title,
      insightLabel: "Impact interpretation",
      insight: `${result.faceSummary} ${result.pathSummary} ${result.strikeSummary}`,
      rangePlan: result.nextTest,
      shareUrl: "https://dovegolf.fit/tools/ball-flight-decoder",
    };
  }

  if (input.kind === "equipment_fit") {
    const parts: string[] = [];
    if (input.focus === "driver_woods" || input.focus === "full_bag") {
      parts.push(
        `Driver/Woods: starts ${input.driverStart}, curves ${input.driverCurve}, strike ${human(input.driverStrike)}.`,
      );
    }
    if (input.focus === "irons" || input.focus === "full_bag") {
      parts.push(
        `Irons: starts ${input.ironStart}, curves ${input.ironCurve}, strike ${human(input.ironStrike)}, low point ${human(input.ironLowPoint)}.`,
      );
    }
    if (input.focus === "wedges" || input.focus === "full_bag") {
      parts.push(`Wedges: ${human(input.wedgeMiss)} miss, ${human(input.wedgeTurf)} turf interaction.`);
    }

    const rangePlan =
      input.focus === "wedges"
        ? "Alternate two five-shot sets from the same lie with the current and proposed bounce or sole setup; compare strike, turf entry, carry, and rollout."
        : input.focus === "irons"
          ? "Alternate two five-shot sets from the same lie; compare strike, low point, start line, curve, carry, and dispersion before changing another variable."
          : "Alternate two five-shot sets with the current club and recommended setup. Hold target, tee height, and speed constant; compare strike, start line, curve, and dispersion.";

    return {
      miss: parts.join(" "),
      insightLabel: "Fit rationale",
      insight:
        "The recommended fit is a controlled starting point for the reported pattern. Equipment may amplify a miss; these answers do not prove the club caused it.",
      rangePlan,
      shareUrl: "https://dovegolf.fit/diagnostic",
    };
  }

  if (input.kind === "driver_slice") {
    return {
      miss: `Driver shot: starts ${input.startLine}; ${input.curveSeverity === "none" ? "no meaningful right curve" : `${input.curveSeverity} right curve`}; ${input.strikeLocation} strike.`,
      insightLabel: "Leading hypothesis",
      insight: LEVER_COPY[input.primaryLever],
      rangePlan:
        "Hit two five-ball sets at 80% speed through a start-line gate 10–15 yards downrange. Change only the top-ranked cue; compare start line, curve, and strike.",
      shareUrl: "https://dovegolf.fit/clinic/driver-slice",
    };
  }

  if (input.kind === "pull_hook") {
    return {
      miss: `Observed shot: starts ${input.startLine}; ${input.curveSeverity === "none" ? "no meaningful left curve" : `${input.curveSeverity} left curve`}; ${input.strikeLocation} strike.`,
      insightLabel: "Leading hypothesis",
      insight: LEVER_COPY[input.primaryLever],
      rangePlan:
        "Hit two five-ball sets at 80% speed through a start-line gate 10–15 yards downrange. Change only the top-ranked cue; improvement supports the hypothesis but does not prove it.",
      shareUrl: "https://dovegolf.fit/clinic/pull-hook",
    };
  }

  const variantCopy: Record<
    Extract<DiagnosisEmailInput, { kind: "ball_curves_right" }>["variantId"],
    Pick<DiagnosisEmailContent, "miss" | "insight">
  > = {
    "curves-right-center": {
      miss: "Starts near the target line, then curves right",
      insight:
        "The face was likely open relative to a path left of the face. Exact path direction relative to the target is unmeasured.",
    },
    "curves-right-from-left": {
      miss: "Starts left, then curves right",
      insight:
        "The face was left of the target but open relative to an even farther-left path. This is impact geometry, not a body-motion verdict.",
    },
    "curves-right-from-right": {
      miss: "Starts right, then curves farther right",
      insight:
        "The face was right of the target and open relative to the path. Strike and equipment contributions remain unmeasured.",
    },
  };
  const content = variantCopy[input.variantId];
  return {
    ...content,
    insightLabel: "Leading hypothesis",
    rangePlan:
      "Run one five-ball A/B test at a time while holding club, target, tee height, and speed constant. Record start line, curve, and strike before changing another variable.",
    shareUrl: "https://dovegolf.fit/clinic/ball-curves-right",
  };
}
