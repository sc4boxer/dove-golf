export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-24">
        {/* Micro-brand line */}
        <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-slate-500">
          <span className="text-slate-600">Dove Golf, Inc.</span>
          <span className="h-px w-6 bg-slate-300" />
          <span>Golf Equipment Diagnostic</span>
        </div>

        {/* Headline block (independent positioning) */}
        <h1 className="mt-6 max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08] sm:leading-tight">
          Independent fitting.
          <span className="block">
            Driven by <span className="font-bold">physics.</span>
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
          A deterministic diagnostic that fits your gear to how you actually swing.
          <span className="block mt-2">No hype. No brand bias. Just logic.</span>
        </p>

        {/* Viz moved below copy, above buttons (mobile-friendly) */}
        <div className="mt-10">
          <TrajectoryHeroViz />
        </div>

        {/* 3-button CTA row */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/diagnostic"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-white font-medium shadow-sm hover:bg-slate-800 transition"
          >
            Start Free Diagnostic
          </a>

          <a
            href="/method"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-8 py-4 font-medium text-slate-900 hover:bg-slate-50 transition"
          >
            How it works
          </a>

          <a
            href="/about"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-8 py-4 font-medium text-slate-900 hover:bg-slate-50 transition"
          >
            About Dove Golf
          </a>
        </div>

        <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          For golfers who care about cause and effect — and want clear, data-driven reasoning behind
          equipment decisions.
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  TrajectoryHeroViz
    Requirements implemented:
    ✅ NOTHING visible at start except axes after they animate in
    ✅ Sequence: axes -> dotted high/short -> dotted low/mid -> solid optimal
    ✅ Dotted paths "grow" smoothly (not flashing), slower than solid
    ✅ Solid peak is BETWEEN the two dotted peaks
    ✅ No target marker/line
/* -------------------------------------------------------------------------- */

function TrajectoryHeroViz() {
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

  // Helper: quadratic curve from origin to end, with a peak height.
  // Returns SVG path string using a smooth cubic that "peaks" at cpY.
  function curvePath(endX: number, endY: number, peakY: number) {
    // Two control points:
    // - early lift control (near origin)
    // - late descent control (near end)
    const c1x = originX + (endX - originX) * 0.28;
    const c2x = originX + (endX - originX) * 0.72;
    const c1y = peakY;
    const c2y = peakY;

    return `M ${originX} ${originY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
  }

  // Three trajectories:
  // 1) High height, low distance (dotted)
  // 2) Low height, mid distance (dotted)
  // 3) Optimal (solid): peak BETWEEN the two dotted peaks + furthest distance
  const highShortEndX = originX + (xMax - originX) * 0.52;
  const highShortPeakY = yMax + (originY - yMax) * 0.10; // highest
  const highShortEndY = originY - 2;

  const lowMidEndX = originX + (xMax - originX) * 0.76;
  const lowMidPeakY = yMax + (originY - yMax) * 0.58; // lowest
  const lowMidEndY = originY - 2;

  const optimalEndX = originX + (xMax - originX) * 0.92;
  const optimalPeakY = yMax + (originY - yMax) * 0.36; // between high + low
  const optimalEndY = originY - 2;

  const pathHigh = curvePath(highShortEndX, highShortEndY, highShortPeakY);
  const pathLow = curvePath(lowMidEndX, lowMidEndY, lowMidPeakY);
  const pathOptimal = curvePath(optimalEndX, optimalEndY, optimalPeakY);

  // Animation timings (slowed down a lot)
  const tAxes = 0.9; // axes draw
  const tGap = 0.2;

  const tHighStart = tAxes + tGap; // 1.1s
  const tHighDur = 3.0; // dotted grows slowly

  const tLowStart = tHighStart + tHighDur + 0.35;
  const tLowDur = 3.0;

  const tOptStart = tLowStart + tLowDur + 0.35;
  const tOptDur = 2.2; // solid slightly faster than dotted, but still smooth

  // We’ll use stroke-dasharray/offset for growth.
  // Use a big enough length; SVG will clamp fine.
  const dashLen = 1200;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        aria-label="Trajectory visualization"
      >
        {/* subtle grid (appears with axes via opacity) */}
        <g opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur={`${tAxes}s`} fill="freeze" />
          {Array.from({ length: 6 }).map((_, i) => {
            const x = originX + ((xMax - originX) * (i + 1)) / 7;
            return (
              <line
                key={`gx-${i}`}
                x1={x}
                y1={yMax}
                x2={x}
                y2={originY}
                stroke="rgb(241 245 249)"
                strokeWidth="2"
              />
            );
          })}
          {Array.from({ length: 3 }).map((_, i) => {
            const y = yMax + ((originY - yMax) * (i + 1)) / 4;
            return (
              <line
                key={`gy-${i}`}
                x1={originX}
                y1={y}
                x2={xMax}
                y2={y}
                stroke="rgb(241 245 249)"
                strokeWidth="2"
              />
            );
          })}
        </g>

        {/* AXES: start with NOTHING else visible */}
        <g>
          {/* y-axis */}
          <line
            x1={originX}
            y1={originY}
            x2={originX}
            y2={yMax}
            stroke="rgb(203 213 225)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={dashLen}
            strokeDashoffset={dashLen}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={dashLen}
              to="0"
              dur={`${tAxes}s`}
              fill="freeze"
            />
          </line>

          {/* x-axis */}
          <line
            x1={originX}
            y1={originY}
            x2={xMax}
            y2={originY}
            stroke="rgb(203 213 225)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={dashLen}
            strokeDashoffset={dashLen}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={dashLen}
              to="0"
              dur={`${tAxes}s`}
              fill="freeze"
            />
          </line>

          {/* axis labels appear AFTER axes */}
          <text x={originX + 6} y={yMax + 14} fontSize="12" fill="rgb(100 116 139)" opacity="0">
            Height
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              begin={`${tAxes}s`}
              dur="0.35s"
              fill="freeze"
            />
          </text>

          <text
            x={xMax - 62}
            y={originY + 26}
            fontSize="12"
            fill="rgb(100 116 139)"
            opacity="0"
          >
            Distance
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              begin={`${tAxes}s`}
              dur="0.35s"
              fill="freeze"
            />
          </text>
        </g>

        {/* 1) HIGH / SHORT dotted path (appears only when it starts growing) */}
        <path
          d={pathHigh}
          fill="none"
          stroke="rgb(148 163 184)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="14 26"
          opacity="0"
          strokeDashoffset={dashLen}
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin={`${tHighStart}s`}
            dur="0.01s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dashoffset"
            from={dashLen}
            to="0"
            begin={`${tHighStart}s`}
            dur={`${tHighDur}s`}
            fill="freeze"
          />
        </path>

        {/* 2) LOW / MID dotted path */}
        <path
          d={pathLow}
          fill="none"
          stroke="rgb(148 163 184)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="14 26"
          opacity="0"
          strokeDashoffset={dashLen}
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin={`${tLowStart}s`}
            dur="0.01s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dashoffset"
            from={dashLen}
            to="0"
            begin={`${tLowStart}s`}
            dur={`${tLowDur}s`}
            fill="freeze"
          />
        </path>

        {/* 3) OPTIMAL solid path */}
        <path
          d={pathOptimal}
          fill="none"
          stroke="rgb(15 23 42)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0"
          strokeDasharray={dashLen}
          strokeDashoffset={dashLen}
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin={`${tOptStart}s`}
            dur="0.01s"
            fill="freeze"
          />
          <animate
            attributeName="stroke-dashoffset"
            from={dashLen}
            to="0"
            begin={`${tOptStart}s`}
            dur={`${tOptDur}s`}
            fill="freeze"
          />
        </path>
      </svg>

      <div className="mt-3 text-xs text-slate-500">
        Different swings → different trajectories. Fit optimizes your “default.”
      </div>
    </div>
  );
}