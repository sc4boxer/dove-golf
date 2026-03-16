type RangePlanCardProps = {
  steps: string[];
};

export function RangePlanCard({ steps }: RangePlanCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold tracking-tight">Quick range plan</h3>
      <ol className="mt-3 space-y-2 text-sm text-slate-700">
        {steps.map((step, idx) => (
          <li key={step}>
            <span className="mr-2 text-slate-400">{idx + 1}.</span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
