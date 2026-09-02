export function TrajectoryComparison() {
  const w = 760;
  const h = 240;
  const padL = 56;
  const padR = 34;
  const padT = 26;
  const padB = 44;
  const originX = padL;
  const originY = h - padB;
  const xMax = w - padR;
  const yMax = padT;

  function curvePath(endX: number, endY: number, peakY: number) {
    const c1x = originX + (endX - originX) * 0.28;
    const c2x = originX + (endX - originX) * 0.72;
    return `M ${originX} ${originY} C ${c1x} ${peakY}, ${c2x} ${peakY}, ${endX} ${endY}`;
  }

  const highShortEndX = originX + (xMax - originX) * 0.52;
  const highShortPeakY = yMax + (originY - yMax) * 0.1;
  const highShortEndY = originY - 2;
  const lowMidEndX = originX + (xMax - originX) * 0.76;
  const lowMidPeakY = yMax + (originY - yMax) * 0.58;
  const lowMidEndY = originY - 2;
  const optimalEndX = originX + (xMax - originX) * 0.92;
  const optimalPeakY = yMax + (originY - yMax) * 0.36;
  const optimalEndY = originY - 2;

  const pathHigh = curvePath(highShortEndX, highShortEndY, highShortPeakY);
  const pathLow = curvePath(lowMidEndX, lowMidEndY, lowMidPeakY);
  const pathOptimal = curvePath(optimalEndX, optimalEndY, optimalPeakY);
  const tAxes = 0.9;
  const tHighStart = 1.1;
  const tHighDur = 3;
  const tLowStart = tHighStart + tHighDur + 0.35;
  const tLowDur = 3;
  const tOptStart = tLowStart + tLowDur + 0.35;
  const tOptDur = 2.2;
  const dashLen = 1200;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label="Three golf ball trajectories plotted by height and distance"
      >
        <g opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur={`${tAxes}s`} fill="freeze" />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = originX + ((xMax - originX) * (i + 1)) / 7;
            return <line key={`gx-${i}`} x1={x} y1={yMax} x2={x} y2={originY} stroke="rgb(241 245 249)" strokeWidth="2" />;
          })}
          {Array.from({ length: 3 }).map((_, i) => {
            const y = yMax + ((originY - yMax) * (i + 1)) / 4;
            return <line key={`gy-${i}`} x1={originX} y1={y} x2={xMax} y2={y} stroke="rgb(241 245 249)" strokeWidth="2" />;
          })}
        </g>

        <g>
          <line x1={originX} y1={originY} x2={originX} y2={yMax} stroke="rgb(203 213 225)" strokeWidth="3" strokeLinecap="round" strokeDasharray={dashLen} strokeDashoffset={dashLen}>
            <animate attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tAxes}s`} fill="freeze" />
          </line>
          <line x1={originX} y1={originY} x2={xMax} y2={originY} stroke="rgb(203 213 225)" strokeWidth="3" strokeLinecap="round" strokeDasharray={dashLen} strokeDashoffset={dashLen}>
            <animate attributeName="stroke-dashoffset" from={dashLen} to="0" dur={`${tAxes}s`} fill="freeze" />
          </line>
          <text x={originX + 6} y={yMax + 14} fontSize="12" fill="rgb(100 116 139)" opacity="0">
            Height
            <animate attributeName="opacity" from="0" to="1" begin={`${tAxes}s`} dur="0.35s" fill="freeze" />
          </text>
          <text x={xMax - 62} y={originY + 26} fontSize="12" fill="rgb(100 116 139)" opacity="0">
            Distance
            <animate attributeName="opacity" from="0" to="1" begin={`${tAxes}s`} dur="0.35s" fill="freeze" />
          </text>
        </g>

        <path d={pathHigh} fill="none" stroke="rgb(148 163 184)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 26" opacity="0" strokeDashoffset={dashLen}>
          <animate attributeName="opacity" from="0" to="1" begin={`${tHighStart}s`} dur="0.01s" fill="freeze" />
          <animate attributeName="stroke-dashoffset" from={dashLen} to="0" begin={`${tHighStart}s`} dur={`${tHighDur}s`} fill="freeze" />
        </path>

        <path d={pathLow} fill="none" stroke="rgb(148 163 184)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 26" opacity="0" strokeDashoffset={dashLen}>
          <animate attributeName="opacity" from="0" to="1" begin={`${tLowStart}s`} dur="0.01s" fill="freeze" />
          <animate attributeName="stroke-dashoffset" from={dashLen} to="0" begin={`${tLowStart}s`} dur={`${tLowDur}s`} fill="freeze" />
        </path>

        <path d={pathOptimal} fill="none" stroke="rgb(15 23 42)" strokeWidth="4" strokeLinecap="round" opacity="0" strokeDasharray={dashLen} strokeDashoffset={dashLen}>
          <animate attributeName="opacity" from="0" to="1" begin={`${tOptStart}s`} dur="0.01s" fill="freeze" />
          <animate attributeName="stroke-dashoffset" from={dashLen} to="0" begin={`${tOptStart}s`} dur={`${tOptDur}s`} fill="freeze" />
        </path>
      </svg>

      <div className="mt-3 text-xs text-slate-500">
        Different swings → different trajectories. Fit optimizes your “default.”
      </div>
    </div>
  );
}
