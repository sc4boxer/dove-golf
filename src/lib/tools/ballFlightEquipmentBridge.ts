export type DecoderStart = "left" | "straight" | "right";
export type DecoderCurve = "left" | "straight" | "right";
export type DecoderStrike = "heel" | "center" | "toe" | "unknown";

export type EquipmentFitStart = "left" | "center" | "right";
export type EquipmentFitCurve = "draw" | "straight" | "fade";
export type EquipmentFitStrike = "heel" | "center" | "toe" | "unsure";
export type EquipmentFitFocus = "driver_woods" | "irons" | "wedges" | "full_bag";

export type EquipmentFitContext = {
  source: "ball-flight-decoder";
  version: "1";
  start: EquipmentFitStart;
  curve: EquipmentFitCurve;
  strike: EquipmentFitStrike;
  pattern: string;
};

export type EquipmentFitPrefill = {
  driverStartLine?: EquipmentFitStart;
  driverCurve?: EquipmentFitCurve;
  driverStrike?: Exclude<EquipmentFitStrike, "unsure">;
  ironStartLine?: EquipmentFitStart;
  ironCurve?: EquipmentFitCurve;
  ironFaceStrike?: Exclude<EquipmentFitStrike, "unsure">;
};

const STARTS = new Set<EquipmentFitStart>(["left", "center", "right"]);
const CURVES = new Set<EquipmentFitCurve>(["draw", "straight", "fade"]);
const STRIKES = new Set<EquipmentFitStrike>(["heel", "center", "toe", "unsure"]);

const START_QUERY_MAP: Record<DecoderStart, EquipmentFitStart> = {
  left: "left",
  straight: "center",
  right: "right",
};

const CURVE_QUERY_MAP: Record<DecoderCurve, EquipmentFitCurve> = {
  left: "draw",
  straight: "straight",
  right: "fade",
};

const STRIKE_QUERY_MAP: Record<DecoderStrike, EquipmentFitStrike> = {
  heel: "heel",
  center: "center",
  toe: "toe",
  unknown: "unsure",
};

function hasOne(params: URLSearchParams, key: string): boolean {
  return params.getAll(key).length === 1;
}

function isStart(value: string | null): value is EquipmentFitStart {
  return value !== null && STARTS.has(value as EquipmentFitStart);
}

function isCurve(value: string | null): value is EquipmentFitCurve {
  return value !== null && CURVES.has(value as EquipmentFitCurve);
}

function isStrike(value: string | null): value is EquipmentFitStrike {
  return value !== null && STRIKES.has(value as EquipmentFitStrike);
}

function patternFrom(start: EquipmentFitStart, curve: EquipmentFitCurve): string {
  const startName = start === "left" ? "pull" : start === "right" ? "push" : "straight";
  return `${startName}-${curve}`;
}

export function buildEquipmentFitHref(input: {
  start: DecoderStart;
  curve: DecoderCurve;
  strike: DecoderStrike;
}): string {
  const params = new URLSearchParams({
    source: "ball-flight-decoder",
    v: "1",
    start: START_QUERY_MAP[input.start],
    curve: CURVE_QUERY_MAP[input.curve],
    strike: STRIKE_QUERY_MAP[input.strike],
  });

  return `/diagnostic?${params.toString()}`;
}

export function parseEquipmentFitContext(params: URLSearchParams): EquipmentFitContext | null {
  for (const key of ["source", "v", "start", "curve", "strike"]) {
    if (!hasOne(params, key)) return null;
  }

  if (params.get("source") !== "ball-flight-decoder" || params.get("v") !== "1") return null;

  const start = params.get("start");
  const curve = params.get("curve");
  const strike = params.get("strike");

  if (!isStart(start) || !isCurve(curve) || !isStrike(strike)) return null;

  return {
    source: "ball-flight-decoder",
    version: "1",
    start,
    curve,
    strike,
    pattern: patternFrom(start, curve),
  };
}

export function equipmentFitPrefill(
  context: EquipmentFitContext,
  focus: EquipmentFitFocus
): EquipmentFitPrefill {
  if (focus === "driver_woods") {
    return {
      driverStartLine: context.start,
      driverCurve: context.curve,
      ...(context.strike === "unsure" ? {} : { driverStrike: context.strike }),
    };
  }

  if (focus === "irons") {
    return {
      ironStartLine: context.start,
      ironCurve: context.curve,
      ...(context.strike === "unsure" ? {} : { ironFaceStrike: context.strike }),
    };
  }

  return {};
}

export function formatEquipmentFitContext(context: EquipmentFitContext): string {
  const startLabel = context.start === "center" ? "On target" : capitalize(context.start);
  const curveLabel =
    context.curve === "straight"
      ? "Mostly straight"
      : context.curve === "draw"
        ? "Left (draw)"
        : "Right (fade)";
  const strikeLabel = context.strike === "unsure" ? "Not measured" : capitalize(context.strike);

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
