export type EquipmentFitStart = "left" | "straight" | "right";
export type EquipmentFitCurve = "left" | "straight" | "right";
export type EquipmentFitStrike = "heel" | "center" | "toe" | "unknown";
export type EquipmentFitFocus = "driver_woods" | "irons" | "wedges" | "full_bag";

export type EquipmentFitContext = {
  source: "ball-flight-decoder";
  start: EquipmentFitStart;
  curve: EquipmentFitCurve;
  strike: EquipmentFitStrike;
  pattern: string;
};

const STARTS = new Set<EquipmentFitStart>(["left", "straight", "right"]);
const CURVES = new Set<EquipmentFitCurve>(["left", "straight", "right"]);
const STRIKES = new Set<EquipmentFitStrike>(["heel", "center", "toe", "unknown"]);

const START_LINE_MAP = {
  left: "left",
  straight: "center",
  right: "right",
} as const;

const CURVE_MAP = {
  left: "draw",
  straight: "straight",
  right: "fade",
} as const;

function isStart(value: string | null): value is EquipmentFitStart {
  return value !== null && STARTS.has(value as EquipmentFitStart);
}

function isCurve(value: string | null): value is EquipmentFitCurve {
  return value !== null && CURVES.has(value as EquipmentFitCurve);
}

function isStrike(value: string | null): value is EquipmentFitStrike {
  return value !== null && STRIKES.has(value as EquipmentFitStrike);
}

function safePattern(value: string | null, start: EquipmentFitStart, curve: EquipmentFitCurve): string {
  if (value && /^[a-z]+-[a-z]+$/.test(value) && value.length <= 40) return value;

  const startName = start === "left" ? "pull" : start === "right" ? "push" : "straight";
  const curveName = curve === "left" ? "draw" : curve === "right" ? "fade" : "straight";
  return `${startName}-${curveName}`;
}

export function buildEquipmentFitHref(input: {
  start: EquipmentFitStart;
  curve: EquipmentFitCurve;
  strike: EquipmentFitStrike;
  patternSlug: string;
}): string {
  const params = new URLSearchParams({
    source: "ball-flight-decoder",
    start: input.start,
    curve: input.curve,
    strike: input.strike,
    pattern: input.patternSlug,
  });

  return `/diagnostic?${params.toString()}`;
}

export function parseEquipmentFitContext(params: URLSearchParams): EquipmentFitContext | null {
  if (params.get("source") !== "ball-flight-decoder") return null;

  const start = params.get("start");
  const curve = params.get("curve");
  const strike = params.get("strike");

  if (!isStart(start) || !isCurve(curve) || !isStrike(strike)) return null;

  return {
    source: "ball-flight-decoder",
    start,
    curve,
    strike,
    pattern: safePattern(params.get("pattern"), start, curve),
  };
}

export function equipmentFitPrefill(context: EquipmentFitContext, focus: EquipmentFitFocus) {
  const flight = {
    startLine: START_LINE_MAP[context.start],
    curve: CURVE_MAP[context.curve],
  };

  if (focus === "driver_woods") {
    return {
      driverStartLine: flight.startLine,
      driverCurve: flight.curve,
      ...(context.strike === "unknown" ? {} : { driverStrike: context.strike }),
    };
  }

  if (focus === "irons") {
    return {
      ironStartLine: flight.startLine,
      ironCurve: flight.curve,
      ...(context.strike === "unknown" ? {} : { ironFaceStrike: context.strike }),
    };
  }

  return {};
}

export function formatEquipmentFitContext(context: EquipmentFitContext): string {
  const startLabel = context.start === "straight" ? "On target" : capitalize(context.start);
  const curveLabel = context.curve === "straight" ? "Mostly straight" : capitalize(context.curve);
  const strikeLabel = context.strike === "unknown" ? "Not measured" : capitalize(context.strike);

  return `Start: ${startLabel} · Curve: ${curveLabel} · Strike: ${strikeLabel}`;
}

export function formatEquipmentFitPattern(context: EquipmentFitContext): string {
  return context.pattern
    .split("-")
    .map(capitalize)
    .join(" ");
}

function capitalize(value: string): string {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}
