type ResultInterpretationCardProps = {
  cue: string;
  meaning: string;
};

export function ResultInterpretationCard({ cue, meaning }: ResultInterpretationCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-900">{cue}</p>
      <p className="mt-1 text-sm text-slate-600">{meaning}</p>
    </article>
  );
}
