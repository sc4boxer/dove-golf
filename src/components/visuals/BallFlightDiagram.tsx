"use client";

import {
  BALL_FLIGHT_SEMANTICS,
  getBallFlightPathGeometry,
  type FlightSide,
  type ShotShape,
} from "@/lib/visual/ballFlightSemantics";

type BallFlightDiagramProps = {
  shape: ShotShape;
  startSide?: FlightSide;
  className?: string;
  compact?: boolean;
  staticRender?: boolean;
  showSelector?: boolean;
  onShapeChange?: (shape: ShotShape) => void;
};

const SHAPE_OPTIONS: ShotShape[] = ["draw", "fade", "hook", "slice", "straight"];

export function BallFlightDiagram({
  shape,
  startSide,
  className,
  compact = true,
  staticRender = false,
  showSelector = false,
  onShapeChange,
}: BallFlightDiagramProps) {
  const width = compact ? 260 : 520;
  const height = compact ? 120 : 180;
  const targetX = width * 0.5;
  const geometry = getBallFlightPathGeometry({ width, height, shape, startSide });
  const path = `M ${geometry.startX} ${geometry.startY} C ${geometry.c1x} ${geometry.c1y}, ${geometry.c2x} ${geometry.c2y}, ${geometry.endX} ${geometry.endY}`;

  return (
    <div className={className}>
      {showSelector && onShapeChange ? (
        <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white p-1">
          {SHAPE_OPTIONS.map((option) => {
            const active = option === shape;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onShapeChange(option)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${active ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`${shape} ball flight`}>
        <line x1={width * 0.1} y1={geometry.startY} x2={width * 0.9} y2={geometry.startY} stroke="rgb(226 232 240)" strokeWidth="2" />
        <line x1={targetX} y1={height * 0.1} x2={targetX} y2={geometry.startY} stroke="rgb(203 213 225)" strokeDasharray="6 6" strokeWidth="2" />

        <path
          key={`${shape}-${startSide ?? "auto"}`}
          d={path}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth={compact ? 3 : 4}
          strokeLinecap="round"
          className={staticRender ? undefined : "[stroke-dasharray:900] [stroke-dashoffset:900] animate-[dash_0.9s_ease-out_forwards]"}
        />

        <text x={geometry.startX - 14} y={height * 0.96} fontSize="10" fill="rgb(100 116 139)">Start</text>
        <text x={targetX + 10} y={height * 0.12} fontSize="10" fill="rgb(100 116 139)">Target</text>
        <text x={width * 0.08} y={height * 0.14} fontSize="10" fill="rgb(71 85 105)">{BALL_FLIGHT_SEMANTICS[shape].label}</text>
      </svg>
    </div>
  );
}
