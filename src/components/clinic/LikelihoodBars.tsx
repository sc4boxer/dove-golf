import { BUCKET_LABELS, LikelihoodSplit } from "@/lib/clinic/types";

export function LikelihoodBars({ split }: { split: LikelihoodSplit }) {
  const entries = Object.entries(split).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
            <span>{BUCKET_LABELS[key as keyof LikelihoodSplit]}</span>
            <span className="font-medium">{value}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-800 transition-all"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
