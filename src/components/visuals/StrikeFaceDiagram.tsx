import { STRIKE_FACE_SEMANTICS, type StrikeLocation } from "@/lib/visual/strikeFaceSemantics";

type StrikeDisplay = StrikeLocation | "mixed" | "unsure";

export function StrikeFaceDiagram({ strike }: { strike: StrikeDisplay }) {
  const w = 260;
  const h = 120;
  const faceX = w * 0.22;
  const faceY = h * 0.3;
  const faceW = w * 0.56;
  const faceH = h * 0.5;
  const hoselX = faceX + faceW + 6;
  const hoselY = faceY + faceH * 0.25;
  const y = faceY + faceH * 0.55;

  const heelX = faceX + faceW * STRIKE_FACE_SEMANTICS.heel.normalizedX;
  const centerX = faceX + faceW * STRIKE_FACE_SEMANTICS.center.normalizedX;
  const toeX = faceX + faceW * STRIKE_FACE_SEMANTICS.toe.normalizedX;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Strike face location">
      <rect x={faceX} y={faceY} width={faceW} height={faceH} rx="18" fill="rgb(248 250 252)" stroke="rgb(226 232 240)" strokeWidth="2" />
      <rect x={hoselX} y={hoselY} width="10" height={faceH * 0.55} rx="6" fill="rgb(241 245 249)" stroke="rgb(226 232 240)" strokeWidth="2" />
      <line x1={hoselX + 6} y1={hoselY + 8} x2={hoselX + 28} y2={hoselY - 18} stroke="rgb(226 232 240)" strokeWidth="4" strokeLinecap="round" />

      {strike === "mixed" && (
        <>
          <circle cx={heelX} cy={y} r="4" fill="rgb(148 163 184)" />
          <circle cx={centerX} cy={y} r="5" fill="rgb(100 116 139)" />
          <circle cx={toeX} cy={y} r="4" fill="rgb(148 163 184)" />
        </>
      )}
      {strike === "heel" && <circle cx={heelX} cy={y} r="6" fill="rgb(15 23 42)" />}
      {strike === "center" && <circle cx={centerX} cy={y} r="7" fill="rgb(15 23 42)" />}
      {strike === "toe" && <circle cx={toeX} cy={y} r="6" fill="rgb(15 23 42)" />}
      {strike === "unsure" && <circle cx={centerX} cy={y} r="5" fill="rgb(203 213 225)" />}

      <text x={faceX + faceW * 0.14} y={faceY + faceH + 16} fontSize="10" fill="rgb(100 116 139)">heel</text>
      <text x={faceX + faceW * 0.78} y={faceY + faceH + 16} fontSize="10" fill="rgb(100 116 139)">toe</text>
      <text x={hoselX - 2} y={faceY - 6} fontSize="10" fill="rgb(100 116 139)">shaft</text>
    </svg>
  );
}
