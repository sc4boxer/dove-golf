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

  if (curve === "draw") return "draw";
  if (curve === "fade") return "fade";
  return "straight";
}

export function BallFlightLibraryViz({ startLine, curve }: { startLine: StartLine; curve: Curve }) {
  const shape = toChartShape(startLine, curve);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <BallFlightChart shape={shape} className="mx-auto max-w-3xl" />
    </div>
  );
}
