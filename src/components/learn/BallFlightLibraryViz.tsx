import type { Curve, StartLine } from "@/lib/learn/ballFlightPatterns";
import { BallFlightDiagram } from "@/components/visuals/BallFlightDiagram";

export function BallFlightLibraryViz({ startLine, curve }: { startLine: StartLine; curve: Curve }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <BallFlightDiagram shape={curve} startSide={startLine} compact={false} className="mx-auto max-w-3xl" />
    </div>
  );
}
