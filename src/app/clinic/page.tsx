"use client";

import { TrackLink } from "@/components/analytics/TrackLink";
import { useState } from "react";
import { HomeLinkPill } from "@/components/HomeLinkPill";
import { ClinicHero } from "@/components/clinic/ClinicHero";
import { ClinicSessionHistory } from "@/components/clinic/ClinicSessionHistory";
import { loadClinicSessions } from "@/lib/clinic/storage";
import { ClinicSession } from "@/lib/clinic/types";
import { CLINIC_MODULES } from "@/lib/clinic/modules";

export default function ClinicPage() {
  const [sessions] = useState<ClinicSession[]>(() => loadClinicSessions());

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <HomeLinkPill />

        <ClinicHero />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight">Common problems</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {CLINIC_MODULES.map((problem) => (
              <article key={problem.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{problem.title}</p>
                <p className="mt-1 text-sm text-slate-600">{problem.status === "active" ? problem.cardDescription : "Coming soon"}</p>
                {problem.status === "active" ? (
                  <TrackLink
                    className="mt-3 inline-block text-sm font-medium text-slate-900 underline"
                    href={problem.route}
                    eventParams={{ module: "doveclinic", placement: "clinic_problem_card", version: "v1" }}
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
