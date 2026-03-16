"use client";

import {
  BALL_FLIGHT_CHART_PATHS_NORMALIZED,
  CANONICAL_BALL_FLIGHT_SHAPES,
  getBallFlightChartPathGeometry,
  toBallFlightChartSvgPath,
  type BallFlightChartShape,
} from "@/lib/visual/ballFlightChartPaths";

type BallFlightChartProps = {
  shape: BallFlightChartShape;
  className?: string;
  compact?: boolean;
  staticRender?: boolean;
  showAllPaths?: boolean;
};

const SHAPE_LABELS: Record<BallFlightChartShape, string> = {
  "pull-draw": "Pull Draw",
  pull: "Pull",
  "pull-fade": "Pull Fade",
  draw: "Draw",
  straight: "Straight",
  fade: "Fade",
  "push-draw": "Push Draw",
  push: "Push",
  "push-fade": "Push Fade",
};

export function BallFlightChart({ shape, className, compact = false, staticRender = false, showAllPaths = false }: BallFlightChartProps) {
  const width = compact ? 300 : 520;
  const height = compact ? 150 : 210;
  const centerX = width * 0.5;
  const sharedStartY = BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.startY * height;
  const singlePathGeometry = getBallFlightChartPathGeometry({ shape, width, height });

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`${SHAPE_LABELS[shape]} ball flight chart`}>
        <line x1={centerX} y1={height * 0.06} x2={centerX} y2={sharedStartY} stroke="rgb(203 213 225)" strokeDasharray="4 5" strokeWidth="1.5" />
        <line x1={width * 0.12} y1={sharedStartY} x2={width * 0.88} y2={sharedStartY} stroke="rgb(226 232 240)" strokeWidth="1.5" />

        {showAllPaths
          ? CANONICAL_BALL_FLIGHT_SHAPES.map((shapeKey) => {
              const path = getBallFlightChartPathGeometry({ shape: shapeKey, width, height });
              return (
                <g key={shapeKey}>
                  <path d={toBallFlightChartSvgPath(path)} fill="none" stroke={shapeKey === shape ? "rgb(15 23 42)" : "rgb(148 163 184)"} strokeWidth={shapeKey === shape ? 3.5 : 2} strokeLinecap="round" />
                  <text x={path.endX + 4} y={path.endY} fontSize="10" fill="rgb(71 85 105)">{SHAPE_LABELS[shapeKey]}</text>
                </g>
              );
            })
          : (
            <path
              key={shape}
              d={toBallFlightChartSvgPath(singlePathGeometry)}
              fill="none"
              stroke="rgb(15 23 42)"
              strokeWidth={compact ? 3 : 4}
              strokeLinecap="round"
              className={staticRender ? undefined : "[stroke-dasharray:900] [stroke-dashoffset:900] animate-[dash_0.9s_ease-out_forwards]"}
            />
            )}

        <circle cx={singlePathGeometry.startX} cy={singlePathGeometry.startY} r={3} fill="rgb(15 23 42)" />
        <text x={centerX + 8} y={height * 0.1} fontSize="10" fill="rgb(100 116 139)">Target line</text>
        <text x={singlePathGeometry.startX + 8} y={singlePathGeometry.startY + 10} fontSize="10" fill="rgb(100 116 139)">Origin</text>
      </svg>
    </div>
  );
}
