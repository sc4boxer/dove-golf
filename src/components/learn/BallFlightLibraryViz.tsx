import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import type { BallFlightChartShape } from "@/lib/visual/ballFlightChartPaths";
import type { Curve, StartLine } from "@/lib/learn/ballFlightPatterns";

function toChartShape(startLine: StartLine, curve: Curve): BallFlightChartShape {
  if (startLine === "left") {
    if (curve === "draw") return "pull-draw";
    if (curve === "fade") return "pull-fade";
    return "pull";
  }

  if (startLine === "right") {
    if (curve === "draw") return "push-draw";
    if (curve === "fade") return "push-fade";
    return "push";
  }

  if (curve === "draw") return "straight-draw";
  if (curve === "fade") return "straight-fade";
  return "straight";
}

export function BallFlightLibraryViz({ startLine, curve }: { startLine: StartLine; curve: Curve }) {
  const shape = toChartShape(startLine, curve);
  const showAllPaths = process.env.NODE_ENV !== "production";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <BallFlightChart shape={shape} className="mx-auto max-w-3xl" />
      {showAllPaths ? (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Dev validation view (all nine)</p>
          <BallFlightChart shape={shape} className="mx-auto max-w-3xl" showAllPaths staticRender />
        </div>
      ) : null}
    </div>
  );
}
