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

type BallFlightChartGlyphProps = {
  shape: BallFlightChartShape;
  width: number;
  height: number;
  staticRender?: boolean;
  showAllPaths?: boolean;
};

export const BALL_FLIGHT_CHART_LABELS: Record<BallFlightChartShape, string> = {
  "pull-draw": "Pull Draw",
  pull: "Pull Straight",
  "pull-fade": "Pull Fade",
  draw: "Straight Draw",
  straight: "Straight",
  fade: "Straight Fade",
  "push-draw": "Push Draw",
  push: "Push Straight",
  "push-fade": "Push Fade",
};

export function BallFlightChartGlyph({
  shape,
  width,
  height,
  staticRender = false,
  showAllPaths = false,
}: BallFlightChartGlyphProps) {
  const centerX = width * 0.5;
  const sharedStartY = BALL_FLIGHT_CHART_PATHS_NORMALIZED.straight.startY * height;
  const singlePathGeometry = getBallFlightChartPathGeometry({ shape, width, height });

  return (
    <>
      <line
        x1={centerX}
        y1={height * 0.06}
        x2={centerX}
        y2={sharedStartY}
        stroke="rgb(203 213 225)"
        strokeDasharray="4 5"
        strokeWidth="1.5"
      />
      <line
        x1={width * 0.12}
        y1={sharedStartY}
        x2={width * 0.88}
        y2={sharedStartY}
        stroke="rgb(226 232 240)"
        strokeWidth="1.5"
      />

      {showAllPaths ? (
        <>
          {CANONICAL_BALL_FLIGHT_SHAPES.map((shapeKey) => {
            const path = getBallFlightChartPathGeometry({ shape: shapeKey, width, height });
            return (
              <path
                key={shapeKey}
                d={toBallFlightChartSvgPath(path)}
                fill="none"
                stroke={shapeKey === shape ? "rgb(15 23 42)" : "rgb(148 163 184)"}
                strokeWidth={shapeKey === shape ? 3.5 : 2}
                strokeLinecap="round"
              />
            );
          })}
          <text
            x={singlePathGeometry.endX + 6}
            y={singlePathGeometry.endY}
            fontSize="12"
            fill="rgb(71 85 105)"
          >
            {BALL_FLIGHT_CHART_LABELS[shape]}
          </text>
        </>
      ) : (
        <path
          key={shape}
          d={toBallFlightChartSvgPath(singlePathGeometry)}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth={width <= 300 ? 3 : 4}
          strokeLinecap="round"
          className={
            staticRender
              ? undefined
              : "[stroke-dasharray:900] [stroke-dashoffset:900] animate-[dash_0.9s_ease-out_forwards] motion-reduce:animate-none motion-reduce:[stroke-dasharray:none] motion-reduce:[stroke-dashoffset:0]"
          }
        />
      )}

      <circle cx={singlePathGeometry.startX} cy={singlePathGeometry.startY} r="3" fill="rgb(15 23 42)" />
      <text x={centerX + 8} y={height * 0.1} fontSize="12" fill="rgb(100 116 139)">
        Target line
      </text>
      <text
        x={singlePathGeometry.startX + 8}
        y={Math.min(singlePathGeometry.startY + 12, height - 8)}
        fontSize="12"
        fill="rgb(100 116 139)"
      >
        Origin
      </text>
    </>
  );
}

export function BallFlightChart({
  shape,
  className,
  compact = false,
  staticRender = false,
  showAllPaths = false,
}: BallFlightChartProps) {
  const width = compact ? 300 : 520;
  const height = compact ? 150 : 210;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${BALL_FLIGHT_CHART_LABELS[shape]} ball flight for a right-handed golfer. The path begins at one shared origin.`}
      >
        <BallFlightChartGlyph
          shape={shape}
          width={width}
          height={height}
          staticRender={staticRender}
          showAllPaths={showAllPaths}
        />
      </svg>
    </div>
  );
}
