import type { CurveInput, StartInput, StrikeInput } from "./model.ts";
import { deriveShotEvidence } from "./shotEvidence.ts";

export function ShotEvidenceView({
  start,
  curve,
  strike,
}: {
  start: StartInput;
  curve: CurveInput;
  strike: StrikeInput;
}) {
  const evidence = deriveShotEvidence({ start, curve, strike });
  const visualSummary = [
    "Illustrative player view looking down the target line",
    evidence.faceToTarget,
    evidence.faceToPath,
    evidence.strikeLabel + " strike",
  ].join(". ");

  return (
    <section
      aria-labelledby="shot-evidence-title"
      className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Player view
          </p>
          <h3
            id="shot-evidence-title"
            className="mt-3 text-2xl font-semibold tracking-tight"
          >
            See the relationship, not a swing verdict.
          </h3>
        </div>
        <span className="w-fit rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500">
          Illustrative · not measured angles
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <figure aria-label={visualSummary}>
          <div className="relative h-80 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="absolute left-1/2 top-5 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Target
            </div>

            <div
              aria-hidden
              className="absolute bottom-12 left-1/2 h-[76%] border-l border-dashed border-slate-300"
            />

            <div
              aria-hidden
              className="absolute bottom-12 left-1/2 h-[64%] w-0 origin-bottom"
              style={{ transform: `rotate(${evidence.pathAngle}deg)` }}
            >
              <div className="evidence-ray h-full w-0.5 origin-bottom bg-slate-400" />
            </div>

            <div
              aria-hidden
              className="absolute bottom-12 left-1/2 h-[70%] w-0 origin-bottom"
              style={{ transform: `rotate(${evidence.faceAngle}deg)` }}
            >
              <div className="evidence-ray evidence-ray-delay h-full w-[3px] origin-bottom bg-slate-900" />
              <span className="absolute -left-[5px] -top-1 size-3 rounded-full border-2 border-white bg-slate-900 shadow-sm" />
            </div>

            <div
              aria-hidden
              className="absolute bottom-9 left-1/2 size-6 -translate-x-1/2 rounded-full border-2 border-slate-900 bg-white shadow-sm"
            />

            <div
              aria-hidden
              className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1">
                <span className="h-px w-4 border-t border-dashed border-slate-300" />
                Target line
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1">
                <span className="h-0.5 w-4 bg-slate-400" />
                Club path
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1">
                <span className="h-[3px] w-4 bg-slate-900" />
                Face direction
              </span>
            </div>
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-slate-500">
            This view preserves the relationship implied by your inputs. It does not estimate exact face or path
            angles, identify a body-motion fault, or replace measured club data.
          </figcaption>
        </figure>

        <div className="grid content-start gap-4">
          <article className="rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Start line
            </p>
            <p className="mt-3 font-medium text-slate-900">{evidence.faceToTarget}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Start direction is used as a practical clue for delivered face direction.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Curve relationship
            </p>
            <p className="mt-3 font-medium text-slate-900">{evidence.faceToPath}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Curve shows the face-to-path relationship; it does not prove the path direction relative to target.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Strike modifier
                </p>
                <p className="mt-3 font-medium text-slate-900">{evidence.strikeLabel}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm">
                Heel · Center · Toe
              </span>
            </div>

            <div aria-hidden className="relative mt-5 h-16">
              <div className="absolute left-3 right-3 top-8 h-3 rounded-full border border-slate-300 bg-white" />
              <span className="absolute left-3 top-12 text-[10px] text-slate-400">Heel</span>
              <span className="absolute right-3 top-12 text-[10px] text-slate-400">Toe</span>
              <span
                className={[
                  "absolute top-5 grid size-7 -translate-x-1/2 place-items-center rounded-full border-2 border-slate-900 bg-white text-[10px] font-bold text-slate-900 shadow-sm",
                  strike === "unknown" ? "border-dashed" : "",
                ].join(" ")}
                style={{ left: `${evidence.strikePosition}%` }}
              >
                {strike === "unknown" ? "?" : ""}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">{evidence.strikeNote}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
