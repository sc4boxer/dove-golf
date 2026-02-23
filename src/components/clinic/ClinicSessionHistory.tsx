"use client";

import { ClinicSession } from "@/lib/clinic/types";

function MiniBars({ values }: { values: number[] }) {
  return (
    <div className="flex items-end gap-1">
      {values.map((value, i) => (
        <span key={`${value}-${i}`} className="w-1.5 rounded-sm bg-slate-400" style={{ height: `${Math.max(8, value)}px` }} />
      ))}
    </div>
  );
}

export function ClinicSessionHistory({
  sessions,
  onOpen,
}: {
  sessions: ClinicSession[];
  onOpen?: (session: ClinicSession) => void;
}) {
  if (sessions.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        No clinic sessions yet. Run a DoveClinic™ module once to save your first baseline.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">Session history</h3>
      <ul className="mt-3 space-y-3">
        {sessions.slice(0, 5).map((session) => {
          const created = new Date(session.createdAt).toLocaleString();
          const values = Object.values(session.result.split);
          return (
            <li key={session.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{created}</p>
                <p className="text-xs text-slate-600">Outcome: {session.feedbackOutcome ?? "pending"}</p>
              </div>
              <div className="flex items-center gap-3">
                <MiniBars values={values} />
                {onOpen ? (
                  <button
                    type="button"
                    onClick={() => onOpen(session)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Open
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
