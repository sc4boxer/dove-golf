import { TestCueViz } from "@/components/clinic/TestCueViz";
import { CauseTest } from "@/lib/clinic/causeLibrary";

type CauseTestCardProps = {
  test: CauseTest;
};

export function CauseTestCard({ test }: CauseTestCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{test.title}</p>
        <TestCueViz type={test.cueType} />
      </div>
      <p className="mt-2 text-sm text-slate-700">{test.instruction}</p>
      <p className="mt-2 text-xs text-slate-500">Watch for: {test.watchFor}</p>
    </article>
  );
}
