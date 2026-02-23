type SetupPattern = "square" | "aimLeft" | "ballBack" | "closedStance" | "unsure";

const labels: Record<SetupPattern, string> = {
  square: "Square: aim and start line stay near neutral.",
  aimLeft: "Aim Left: stance and start line both shift left.",
  ballBack: "Ball Back: ball sits farther back with left-start bias risk.",
  closedStance: "Closed Stance: feet line mismatch can pre-bias left start.",
  unsure: "Unsure: neutral reference shown.",
};

export function PullHookSetupVisual({ selected = "unsure" }: { selected?: string }) {
  const mode = (selected as SetupPattern) || "unsure";
  const ballX = mode === "ballBack" ? 145 : 160;
  const aim = mode === "aimLeft" ? { x1: 160, y1: 142, x2: 108, y2: 46 } : { x1: 160, y1: 142, x2: 160, y2: 46 };
  const startLine =
    mode === "aimLeft"
      ? { x1: ballX, y1: 122, x2: 122, y2: 56 }
      : mode === "closedStance"
        ? { x1: ballX, y1: 122, x2: 132, y2: 54 }
        : { x1: ballX, y1: 122, x2: 160, y2: 56 };
  const feetLine =
    mode === "closedStance"
      ? { x1: 118, y1: 154, x2: 204, y2: 136 }
      : mode === "aimLeft"
        ? { x1: 112, y1: 150, x2: 184, y2: 124 }
        : { x1: 118, y1: 148, x2: 202, y2: 148 };

  const isBallBack = mode === "ballBack";
  const aimLabel = mode === "aimLeft" ? { x: 34, y: 46 } : { x: 82, y: 48 };
  const startLabel = mode === "aimLeft" ? { x: 186, y: 52 } : { x: 184, y: 62 };

  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-label="Setup quick check top-down range map">
      <line x1="160" y1="22" x2="160" y2="128" stroke="rgb(148 163 184)" strokeDasharray="5 4" strokeWidth="2" />
      <text x="166" y="24" className="fill-slate-500 text-[9px]">target line</text>

      <line x1={aim.x1} y1={aim.y1} x2={aim.x2} y2={aim.y2} stroke="rgb(71 85 105)" strokeWidth="3" strokeLinecap="round" />
      <text x={aimLabel.x} y={aimLabel.y} className="fill-slate-500 text-[9px]">aim line</text>

      <line x1={startLine.x1} y1={startLine.y1} x2={startLine.x2} y2={startLine.y2} stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" />
      <text x={startLabel.x} y={startLabel.y} className="fill-slate-500 text-[9px]">start line / face line</text>

      <line x1={feetLine.x1} y1={feetLine.y1} x2={feetLine.x2} y2={feetLine.y2} stroke="rgb(100 116 139)" strokeWidth="4" strokeLinecap="round" />
      <text x="78" y={isBallBack ? "170" : "178"} className="fill-slate-500 text-[9px]">feet / stance line</text>

      <circle cx="160" cy="162" r="4" fill="rgb(100 116 139)" />
      <text x="168" y="186" className="fill-slate-500 text-[9px]">stance center</text>

      <circle cx={ballX} cy="122" r="6" fill="white" stroke="rgb(15 23 42)" strokeWidth="2" />
      <text x={mode === "ballBack" ? "102" : "168"} y="112" className="fill-slate-500 text-[9px]">ball position</text>

      {isBallBack ? (
        <>
          <line x1="160" y1="122" x2={ballX + 8} y2="122" stroke="rgb(239 68 68 / 0.9)" strokeWidth="2" />
          <text x="76" y="92" className="fill-rose-600 text-[10px]">de-loft / earlier closure risk / left-start bias</text>
        </>
      ) : null}

      {mode === "unsure" ? <text x="228" y="138" className="fill-slate-500 text-sm">?</text> : null}
      <text x="24" y="210" className="fill-slate-700 text-[11px]">{labels[mode]}</text>
    </svg>
  );
}
