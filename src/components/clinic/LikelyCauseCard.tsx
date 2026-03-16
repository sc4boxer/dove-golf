import { CauseMiniViz } from "@/components/clinic/CauseMiniViz";
import { ConfidenceLabel } from "@/lib/clinic/causeLibrary";

type LikelyCauseCardProps = {
  title: string;
  summary: string;
  explanation: string;
  confidence: ConfidenceLabel;
  visualType?: "open-face" | "across-path" | "weak-grip" | "glancing-strike";
};

export function LikelyCauseCard({ title, summary, explanation, confidence, visualType }: LikelyCauseCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600">{confidence.replace("-", " ")}</span>
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
        <CauseMiniViz type={visualType} />
      </div>
      <p className="mt-3 text-sm text-slate-700">{summary}</p>
      <p className="mt-2 text-xs text-slate-500">{explanation}</p>
    </article>
  );
}
