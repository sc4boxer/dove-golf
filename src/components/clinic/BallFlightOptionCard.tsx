import { BallFlightViz } from "@/components/clinic/BallFlightViz";
import { CurveSeverity, StartDirection } from "@/lib/clinic/ballFlightPatterns";

type BallFlightOptionCardProps = {
  title: string;
  startDirection: StartDirection;
  curveSeverity: CurveSeverity;
  selected: boolean;
  onSelect: () => void;
};

export function BallFlightOptionCard({ title, startDirection, curveSeverity, selected, onSelect }: BallFlightOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border p-4 text-left transition ${selected ? "border-slate-900 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
    >
      <BallFlightViz startDirection={startDirection} curveDirection="right" curveSeverity={curveSeverity} />
      <p className="mt-2 text-sm font-medium text-slate-900">{title}</p>
    </button>
  );
}
