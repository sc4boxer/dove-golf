// src/app/method/page.tsx
import React from "react";
import type { Metadata } from "next";
import { HomeLinkPill } from "@/components/HomeLinkPill";

export const metadata: Metadata = {
  title: "Method",
  description:
    "How DoveFit™ Engine works: a deterministic, physics-aware fitting model that converts swing tendencies into a testable shaft + build blueprint.",
  alternates: {
    canonical: "/method",
  },
};

export default function MethodPage() {
  const brand = "Dove Golf";
  const engineName = "DoveFit™ Engine";
  const founderName = "Joshua";
  const founderTitle = "Founder · Engineer · Amateur golfer";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top canvas */}
      <div className="relative overflow-hidden">
        {/* subtle background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <HomeLinkPill />
            <span className="text-xs font-medium text-slate-500">How it works</span>
          </div>

          {/* Hero */}
          <header className="mt-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              {/* Left hero */}
              <div>
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                  <span className="inline-flex items-center gap-2">
                    {/* ✅ removed dove logo mark */}
                    <span className="font-semibold text-slate-900">{brand}</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Deterministic fitting model</span>
                  <span className="text-slate-300">·</span>
                  <span>Brand-neutral outputs</span>
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                  A fitter-style engine that converts your answers into a testable shaft + build blueprint.
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
                  {engineName} is a deterministic scoring model grounded in ball-flight constraints. It maps measurable
                  tendencies (tempo, miss, strike, flight window, speed proxies) into a repeatable equipment profile:
                  <span className="font-medium text-slate-900">
                    {" "}
                    weight band, flex band, stability/torque bias, launch/spin direction, and setup guidance.
                  </span>
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Pill>Same inputs → same output</Pill>
                  <Pill>Physics-aware heuristics</Pill>
                  <Pill>Transparent structure</Pill>
                  <Pill>No pay-to-play</Pill>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <HeroChip label="Output" value="Blueprint" />
                  <HeroChip label="Model" value="Deterministic" />
                  <HeroChip label="Goal" value="Reduce guesswork" />
                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    {/* ✅ removed small icon next to Scientific posture */}
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Scientific posture</div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        We treat fitting like an inference problem: measure signal → normalize → score → map into
                        practical test bands. The goal is not “perfect numbers,” but repeatable guidance you can verify
                        with real shots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right hero card */}
              <aside className="lg:sticky lg:top-10">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-600">Core promise</div>
                      <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                        Clear logic, repeatable results.
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        We don’t recommend “the hottest” gear. We recommend fit traits you can validate: weight, flex,
                        stability, and launch direction.
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        Live
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniStat label="Latency" value="Instant" />
                    <MiniStat label="Bias" value="Brand-neutral" />
                    <MiniStat label="Output" value="Blueprint" />
                    <MiniStat label="Method" value="Scoring model" />
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-600">Engine label</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{engineName}</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500">
                      Structure is publishable. Calibration remains internal to keep outputs stable and prevent gaming.
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold text-slate-600">What you get</div>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      <Step n={1}>A driver blueprint (shaft profile + setup bias)</Step>
                      <Step n={2}>An iron blueprint (shaft profile + build bias)</Step>
                      <Step n={3}>Transparent “why” — what drove the result</Step>
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    <a
                      href="/diagnostic"
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Start Diagnostic →
                    </a>
                    <a
                      href="/about"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      About Dove Golf
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </header>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mt-10 grid gap-8">
          {/* Section: Inputs */}
          <Section title="1) What we measure" subtitle="Short questions. High signal. Built for real golfers.">
            <p className="text-sm leading-relaxed text-slate-700">
              We ask for variables that materially influence delivery and dispersion. Some are direct measurements
              (mph). Others are practical proxies (carry → speed) designed to capture signal without turning this into a
              10-minute intake form.
            </p>

            <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2">
              <Card title="Driver inputs" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>
                    <Code>v</Code> driver speed (mph) or estimated from carry
                  </Li>
                  <Li>
                    <Code>m</Code> miss tendency (slice / hook / two-way dispersion)
                  </Li>
                  <Li>
                    <Code>t</Code> transition / tempo (smooth ↔ aggressive)
                  </Li>
                  <Li>
                    <Code>s</Code> strike pattern (center / heel / toe / inconsistent)
                  </Li>
                  <Li>
                    <Code>f</Code> typical flight window (low / mid / high)
                  </Li>
                  <Li>
                    <Code>w₀</Code> current shaft weight class (optional anchor)
                  </Li>
                  <Li>
                    <Code>c</Code> physical constraints (comfort bias)
                  </Li>
                </ul>
              </Card>

              <Card title="Iron inputs" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>
                    <Code>vᵢ</Code> iron speed proxy (or carry proxy)
                  </Li>
                  <Li>
                    <Code>p</Code> peak height tendency (low / mid / high)
                  </Li>
                  <Li>
                    <Code>sᵢ</Code> strike tendency (thin / fat / center / inconsistent)
                  </Li>
                  <Li>
                    <Code>fat</Code> fatigue sensitivity (none ↔ high)
                  </Li>
                  <Li>
                    <Code>w₀ᵢ</Code> current iron shaft weight (optional anchor)
                  </Li>
                  <Li>
                    <Code>c</Code> physical constraints (comfort bias)
                  </Li>
                </ul>
              </Card>
            </div>

            <Callout>
              This tool is honest about reality: some misses are equipment-sensitive, others are mostly mechanics. The
              engine outputs the best-fit profile given your answers — and flags when mechanics likely dominate.
            </Callout>
          </Section>

          {/* Section: Physics */}
          <Section
            title="2) The science we anchor to"
            subtitle="Ball-flight constraints, impact stability, and repeatability."
          >
            <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
              <Card title="Ball-flight constraints" className="h-full">
                <p className="text-sm leading-relaxed text-slate-700">
                  We frame fit around outcomes you can validate: launch window, spin tendency, curvature, and carry
                  stability — not “magic shafts.”
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <Li>Launch vs spin is governed largely by delivered loft & spin loft</Li>
                  <Li>Curvature responds to face-to-path and strike/gear effect</Li>
                  <Li>Carry stability is driven by strike efficiency + repeatable delivery</Li>
                </ul>
              </Card>

              <Card title="Shaft as timing + stability" className="h-full">
                <p className="text-sm leading-relaxed text-slate-700">
                  We treat the shaft as a component that influences timing, closure feel, and impact stability under
                  load — especially under transition and fatigue.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <Li>
                    <Code>weight</Code> is the biggest lever for tempo, sequencing, and strike quality
                  </Li>
                  <Li>
                    <Code>profile</Code> (stiffness distribution) impacts load/unload timing
                  </Li>
                  <Li>
                    <Code>torque</Code> influences closure feel and perceived stability
                  </Li>
                </ul>
              </Card>

              <Card title="Head as stability + bias" className="h-full">
                <p className="text-sm leading-relaxed text-slate-700">
                  Head geometry changes forgiveness and flight bias. We model it as a stability and launch/spin
                  component that interacts with strike tendencies.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <Li>CG/MOI influences twist resistance on off-center hits</Li>
                  <Li>Loft/lie/face angle influences start line + curvature</Li>
                  <Li>Face tech influences ball speed retention across the face</Li>
                </ul>
              </Card>
            </div>
          </Section>

          {/* Section: Signals */}
          <Section
            title="3) How we convert answers into signals"
            subtitle="We normalize subjective answers into variables a model can reason about."
          >
            <p className="text-sm leading-relaxed text-slate-700">
              Deterministic engines require structured inputs. Each answer is normalized into signals (tiers, bands, and
              directional biases) that combine consistently into a final blueprint.
            </p>

            <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-3">
              <Card title="Speed tier" className="h-full">
                <p className="text-sm text-slate-700">Speed is the strongest baseline for weight and flex.</p>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div>
                    <Code>tier(v)</Code> ∈ {"{slow, mid, fast, very_fast}"}
                  </div>
                  <div className="mt-2 text-slate-600">If mph is unknown, we estimate via carry proxies.</div>
                </div>
              </Card>

              <Card title="Stability demand" className="h-full">
                <p className="text-sm text-slate-700">
                  Two-way dispersion and aggressive transitions increase stability demand.
                </p>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div>
                    <Code>stab</Code> = g(m, t, s)
                  </div>
                  <div className="mt-2 text-slate-600">
                    Hook risk → anti-left bias. Slice/heel/toe variance → stability + forgiveness bias.
                  </div>
                </div>
              </Card>

              <Card title="Launch direction" className="h-full">
                <p className="text-sm text-slate-700">
                  Flight window + goal tune launch/spin directionally (up/down, more/less spin).
                </p>
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <div>
                    <Code>launch</Code> = h(f, goal)
                  </div>
                  <div className="mt-2 text-slate-600">
                    Low flight → add launch. High flight → control spin/launch.
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          {/* Section: Scoring */}
          <Section
            title="4) How we score and produce the blueprint"
            subtitle="Transparent structure — with internal calibration."
          >
            <p className="text-sm leading-relaxed text-slate-700">
              We compute intermediate scores and map them into labeled test bands that match real-world fitting: weight
              ranges, flex bands, stability/torque direction, and launch/spin direction. These outputs are designed to
              be verifiable in a bay or on-course.
            </p>

            <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2">
              <Card title="Profile generation" className="h-full">
                <p className="text-sm text-slate-700">
                  Conceptually, we combine speed tier, stability demand, launch direction, and comfort bias into a
                  profile that targets weight/flex/stability.
                </p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
                  <div className="font-semibold">Conceptual form</div>
                  <div className="mt-3 space-y-2 font-mono text-[13px] text-slate-800">
                    <div>weightScore = a·tier(v) + b·tempo + c·comfort + d·anchorWeight</div>
                    <div>flexScore   = e·tier(v) + f·transition</div>
                    <div>stabScore   = g·miss + h·tempo + i·strikeVariance</div>
                    <div>launchScore = j·flight + k·goal</div>
                    <div className="pt-2 text-slate-600">
                      map scores → labeled bands (example: 60–70g, Stiff, stable / low-torque)
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  We publish the structure so it’s understandable. Calibration coefficients remain internal to preserve
                  consistency and resist “gaming.”
                </p>
              </Card>

              <Card title="Fit score & confidence" className="h-full">
                <p className="text-sm leading-relaxed text-slate-700">
                  Fit score is a conservative compatibility marker based on alignment and signal quality. It is not a
                  promise of performance.
                </p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
                  <div className="font-semibold">Calibration idea</div>
                  <div className="mt-3 space-y-2 font-mono text-[13px] text-slate-800">
                    <div>score = base + 36·(alignment − 0.5) + 20·(signalQuality − 0.5)</div>
                    <div>      − 10·volatility − 2.5·unknownCount</div>
                    <div className="pt-2 text-slate-600">Clamped to a conservative range.</div>
                  </div>
                </div>

                <Callout>
                  If everything is always “perfect,” nothing is believable. We bias toward conservative, testable
                  recommendations.
                </Callout>
              </Card>
            </div>
          </Section>

          {/* Section: Output */}
          <Section title="5) What you get" subtitle="A blueprint you can test — not hype you have to believe.">
            <p className="text-sm leading-relaxed text-slate-700">
              The output is a fit blueprint that tells you what to target. No paid placements. No brand pushing. Just
              fit traits you can validate with your own swings.
            </p>

            <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-3">
              <Card title="Driver blueprint" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>Weight band and flex band</Li>
                  <Li>Stability and torque direction</Li>
                  <Li>Launch/spin direction</Li>
                  <Li>Setup starting point based on miss + flight</Li>
                </ul>
              </Card>

              <Card title="Iron blueprint" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>Weight band and flex band</Li>
                  <Li>Peak height / launch direction</Li>
                  <Li>Material bias (steel vs graphite)</Li>
                  <Li>Fatigue/comfort bias</Li>
                </ul>
              </Card>

              <Card title="Why this result" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>Shows what drove stability vs launch vs weight</Li>
                  <Li>Flags when mechanics likely dominate</Li>
                  <Li>Gives clear next steps for validation</Li>
                </ul>
              </Card>
            </div>
          </Section>

          {/* Section: Limits */}
          <Section title="Assumptions & limits" subtitle="Honest boundaries improve trust and usability.">
            <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
              <Card title="What this is great at" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>Weight/flex/stability direction for amateurs without full LM data</Li>
                  <Li>Conservative starting points for testing and fitter conversations</Li>
                  <Li>Spotting mismatches (too light, too soft, too unstable, too spinny)</Li>
                </ul>
              </Card>
              <Card title="Where you still need real measurement" className="h-full">
                <ul className="space-y-2 text-sm text-slate-700">
                  <Li>Precise launch/spin optimization at the edge of your speed window</Li>
                  <Li>Lie/loft gapping decisions and detailed wedge matrix work</Li>
                  <Li>When strike is highly volatile (major face/low-point control issues)</Li>
                </ul>
              </Card>
            </div>
          </Section>

          {/* Founder */}
          <Section title="Founder note" subtitle="A Southern California family company built to fight marketing hype.">
            <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              {/* Founder card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">
                      {founderName.slice(0, 1)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900">{founderName}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{founderTitle}</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      Free for public use
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-600">Mission</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Give golfers a data-driven fitting blueprint that’s deterministic, transparent, and not tied to
                    brand incentives.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-600">Philosophy</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    The dove is intentionally minimal: calm signal over loud marketing. One mark, one idea — clarity.
                  </p>
                </div>
              </div>

              {/* Founder story */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="text-lg font-semibold tracking-tight">Why I built Dove Golf</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  I’m a Southern California golfer who got tired of the same cycle: new “must-buy” shafts every year,
                  influencer hype, and advice that’s hard to verify. Equipment matters — but the signal is often buried
                  under marketing.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  So I built a deterministic engine that turns a golfer’s tendencies into a blueprint you can actually
                  test. It’s designed to be practical, conservative, and brand-neutral. If you want to validate it, you
                  can — with your own swings.
                </p>

                <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-3">
                  <FounderChip title="No pay-to-play" body="No sponsored recommendations mixed into the core output." />
                  <FounderChip title="Deterministic" body="Same answers produce the same blueprint every time." />
                  <FounderChip title="Built to test" body="Outputs are bands you can validate in a bay or on-course." />
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="text-sm font-semibold text-slate-900">Transparency policy</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    If Dove Golf ever adds partner catalogs or sponsored placements, they will be clearly labeled and
                    separated from the core {engineName} output. The engine’s structure remains consistent and
                    interpretable.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <footer className="pt-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Try the diagnostic</div>
                  <p className="mt-1 text-sm text-slate-600">Get your personalized blueprint in under a minute.</p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="/diagnostic"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Start Diagnostic →
                  </a>
                  <a
                    href="https://dovegolf.fit/learn"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Learn more
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} · {brand} · {engineName}
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* ---------- UI helpers ---------- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
      {children}
    </span>
  );
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {n}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 ${className}`}>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          i
        </div>
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-white px-2 py-0.5 text-[12px] text-slate-900 ring-1 ring-slate-200">
      {children}
    </code>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

function FounderChip({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{body}</div>
    </div>
  );
}
