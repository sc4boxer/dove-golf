import { BallFlightViz } from "@/components/clinic/BallFlightViz";

type ClinicSymptomHeroProps = {
  title: string;
  description: string;
};

export function ClinicSymptomHero({ title, description }: ClinicSymptomHeroProps) {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1.2fr_0.8fr] sm:p-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-slate-500">Symptom</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
        <BallFlightViz startDirection="center" curveDirection="right" curveSeverity="medium" className="h-28 w-full" />
      </div>
    </section>
  );
}
