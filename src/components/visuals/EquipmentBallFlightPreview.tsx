"use client";

import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import {
  EQUIPMENT_BALL_FLIGHT_LABELS,
  getEquipmentBallFlightShape,
  type EquipmentCurve,
  type EquipmentStartLine,
} from "@/lib/visual/equipmentBallFlightShape";

type EquipmentBallFlightPreviewProps = {
  start: EquipmentStartLine;
  curve: EquipmentCurve;
  startOnly?: boolean;
  compact?: boolean;
  className?: string;
};

const START_ONLY_LABELS: Record<Exclude<EquipmentStartLine, "unsure">, string> = {
  left: "Launches left",
  center: "Launches on the target line",
  right: "Launches right",
};

export function EquipmentBallFlightPreview({
  start,
  curve,
  startOnly = false,
  compact = true,
  className,
}: EquipmentBallFlightPreviewProps) {
  const displayedCurve = startOnly ? "straight" : curve;
  const shape = getEquipmentBallFlightShape(start, displayedCurve);

  if (!shape) {
    return (
      <div
        className={["grid min-h-32 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center", className]
          .filter(Boolean)
          .join(" ")}
        role="img"
        aria-label="Ball flight is not drawn because the start line or curve was not recorded"
      >
        <div>
          <p className="text-sm font-medium text-slate-700">Not enough information to draw this flight.</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Choose a start line and curve, or continue with lower confidence.
          </p>
        </div>
      </div>
    );
  }

  const label = startOnly
    ? START_ONLY_LABELS[start as Exclude<EquipmentStartLine, "unsure">]
    : EQUIPMENT_BALL_FLIGHT_LABELS[shape];

  return (
    <figure className={className}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <span className="text-xs text-slate-500">Right-handed view</span>
      </div>
      <BallFlightChart shape={shape} compact={compact} className="mx-auto mt-3 w-full max-w-xl" />
      <figcaption className="mt-2 text-xs leading-5 text-slate-500">
        {startOnly
          ? "Start line only. The curve is added on the next step."
          : "Illustrative direction and curve; the endpoint is not a measured landing position."}
      </figcaption>
    </figure>
  );
}
