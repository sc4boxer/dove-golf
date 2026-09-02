import { STRIKE_FACE_SEMANTICS, type StrikeLocation } from "@/lib/visual/strikeFaceSemantics";

export type StrikeDisplay = StrikeLocation | "mixed" | "unsure";

type StrikeFaceGlyphProps = {
  strike: StrikeDisplay;
  width?: number;
  height?: number;
};

const STRIKE_LABELS: Record<StrikeDisplay, string> = {
  heel: "Heel strike nearest the hosel",
  center: "Center strike",
  toe: "Toe strike farthest from the hosel",
  mixed: "Mixed strike locations across the face",
  unsure: "Strike location not recorded",
};

export function StrikeFaceGlyph({ strike, width = 260, height = 120 }: StrikeFaceGlyphProps) {
  const faceX = width * 0.22;
  const faceY = height * 0.3;
  const faceW = width * 0.56;
  const faceH = height * 0.5;
  const hoselX = faceX - 16;
  const hoselY = faceY + faceH * 0.25;
  const y = faceY + faceH * 0.55;

  const heelX = faceX + faceW * STRIKE_FACE_SEMANTICS.heel.normalizedX;
  const centerX = faceX + faceW * STRIKE_FACE_SEMANTICS.center.normalizedX;
  const toeX = faceX + faceW * STRIKE_FACE_SEMANTICS.toe.normalizedX;

  return (
    <>
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
      <rect
        x={hoselX}
        y={hoselY}
        width="10"
        height={faceH * 0.55}
        rx="6"
        fill="rgb(241 245 249)"
        stroke="rgb(226 232 240)"
        strokeWidth="2"
      />
      <line
        x1={hoselX + 4}
        y1={hoselY + 8}
        x2={hoselX - 18}
        y2={hoselY - 18}
        stroke="rgb(226 232 240)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {strike === "mixed" ? (
        <>
          <circle cx={heelX} cy={y} r="4" fill="rgb(148 163 184)" />
          <circle cx={centerX} cy={y} r="5" fill="rgb(100 116 139)" />
          <circle cx={toeX} cy={y} r="4" fill="rgb(148 163 184)" />
        </>
      ) : null}
      {strike === "heel" ? <circle cx={heelX} cy={y} r="6" fill="rgb(15 23 42)" /> : null}
      {strike === "center" ? <circle cx={centerX} cy={y} r="7" fill="rgb(15 23 42)" /> : null}
      {strike === "toe" ? <circle cx={toeX} cy={y} r="6" fill="rgb(15 23 42)" /> : null}
      {strike === "unsure" ? (
        <>
          <circle
            cx={centerX}
            cy={y}
            r="9"
            fill="white"
            stroke="rgb(148 163 184)"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <text x={centerX} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="rgb(100 116 139)">
            ?
          </text>
        </>
      ) : null}

      <text x={faceX + faceW * 0.12} y={faceY + faceH + 18} fontSize="12" fill="rgb(100 116 139)">
        heel
      </text>
      <text x={faceX + faceW * 0.78} y={faceY + faceH + 18} fontSize="12" fill="rgb(100 116 139)">
        toe
      </text>
      <text x={hoselX - 4} y={faceY - 6} fontSize="12" fill="rgb(100 116 139)">
        shaft
      </text>
    </>
  );
}

export function StrikeFaceDiagram({ strike }: { strike: StrikeDisplay }) {
  const width = 260;
  const height = 120;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={STRIKE_LABELS[strike]}
    >
      <StrikeFaceGlyph strike={strike} width={width} height={height} />
    </svg>
  );
}
