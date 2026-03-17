"use client";

import { TrackLink } from "@/components/analytics/TrackLink";
import { useState } from "react";
import { HomeLinkPill } from "@/components/HomeLinkPill";
import { ClinicSessionHistory } from "@/components/clinic/ClinicSessionHistory";
import { loadClinicSessions } from "@/lib/clinic/storage";
import { ClinicSession } from "@/lib/clinic/types";
import { CLINIC_MODULES } from "@/lib/clinic/modules";

export default function ClinicPage() {
  const [sessions] = useState<ClinicSession[]>(() => loadClinicSessions());

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <HomeLinkPill />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-medium tracking-wide text-slate-500">DoveClinic™</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Symptom → causes → tests → interpretation</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Start with the ball flight you can see. We rank likely causes, then help you test one change at a time.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Modules</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {CLINIC_MODULES.map((problem) => (
              <article key={problem.id} className={`rounded-xl border p-4 ${problem.id === "ball-curves-right" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"}`}>
                <p className={`font-medium ${problem.id === "ball-curves-right" ? "text-white" : "text-slate-900"}`}>{problem.title}</p>
                <p className={`mt-1 text-sm ${problem.id === "ball-curves-right" ? "text-slate-200" : "text-slate-600"}`}>
                  {problem.status === "active" ? problem.cardDescription : "Coming soon"}
                </p>
                {problem.status === "active" ? (
                  <TrackLink
                    className={`mt-3 inline-block text-sm font-medium underline ${problem.id === "ball-curves-right" ? "text-white" : "text-slate-900"}`}
                    href={problem.route}
                    eventParams={{ module: "doveclinic", placement: "clinic_problem_card", version: "v2" }}
                  >
                    Start now
                  </TrackLink>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <ClinicSessionHistory sessions={sessions} />
      </div>
    </main>
  );
}
