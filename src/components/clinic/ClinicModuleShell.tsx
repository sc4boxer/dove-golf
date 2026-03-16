import { ReactNode } from "react";
import Link from "next/link";

type ClinicModuleShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function ClinicModuleShell({ eyebrow, title, intro, children }: ClinicModuleShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-slate-500">{eyebrow}</p>
          <Link href="/clinic" className="text-sm text-slate-700 underline">
            Back to Clinic
          </Link>
        </div>
        <header className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{intro}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
