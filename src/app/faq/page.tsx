import type { Metadata } from "next";
import { HomeLinkPill } from "@/components/HomeLinkPill";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Golf Fitting FAQ for Serious Amateurs",
  description:
    "Technical golf fitting answers on ball flight, shaft dynamics, strike, and when mechanics matter more than equipment.",
  alternates: { canonical: "/faq" },
};

type FAQItem = {
  question: string;
  answer: ReactNode;
};

const faqItems: FAQItem[] = [
  {
    question: "Why do I start the ball right but it curves left?",
    answer: (
      <>
        <p>
          That pattern usually means face and path are both right of target, but the face is left of the path. Start
          direction follows face orientation, while curvature follows face-to-path differential. So the ball can launch
          right and still draw back left if that differential is draw-biased. See <a className="text-slate-900 underline" href="/learn/start-line-vs-curve">Start Line vs Curve</a> for a full breakdown.
        </p>
      </>
    ),
  },
  {
    question: "Is shaft flex based on swing speed?",
    answer: (
      <p>
        Swing speed contributes, but it is not sufficient on its own. Transition tempo, release timing, and strike
        stability often explain why two players at equal speed fit different profiles. Flex labels also vary by
        manufacturer, so a letter code is not a precise engineering value. Use speed as a starting point, then test
        delivery behavior under load.
      </p>
    ),
  },
  {
    question: "Does torque mean softer?",
    answer: (
      <p>
        Torque describes resistance to twisting under applied moment, not overall longitudinal stiffness. A shaft can
        measure low torque and still feel smooth depending on bend profile and balance. Torque also interacts with head
        design and strike location, so it should not be interpreted in isolation. Treat it as one stability dimension,
        not a universal softness index.
      </p>
    ),
  },
  {
    question: "Can equipment fix an over-the-top swing?",
    answer: (
      <p>
        Equipment can reduce severity and improve playable outcomes, but it rarely eliminates a large path pattern.
        Over-the-top delivery is a motion-level issue tied to sequencing and plane management. Fit can narrow miss
        boundaries by improving timing and contact stability. Lasting correction usually requires mechanical work in
        parallel with fitting.
      </p>
    ),
  },
  {
    question: "Why do my irons balloon?",
    answer: (
      <p>
        Ballooning often comes from excessive dynamic loft, high spin loft, or a strike pattern that increases spin.
        Shaft profile and weight can influence delivery timing, but they are not the only contributors. Loft structure,
        strike height, and angle of attack should be reviewed before changing components aggressively. The useful target
        is a repeatable launch window, not simply lower peak height.
      </p>
    ),
  },
  {
    question: "What is swing weight actually measuring?",
    answer: (
      <p>
        Swing weight is a balance index around a fulcrum, not the club&apos;s total mass. It estimates head-heaviness feel
        and influences timing perception during motion. Two clubs can share a swing weight while having different total
        weights and different fatigue effects. Use it together with total mass and playing length, not as a standalone
        fit metric.
      </p>
    ),
  },
  {
    question: "Should driver and iron shafts match?",
    answer: (
      <p>
        They should coordinate, not necessarily match. Driver and iron swings have different delivery tasks and impact
        conditions, so identical profile choices are not always optimal. Many players fit better with different mass and
        stiffness distributions across the bag while preserving a consistent timing feel. Build coherence through
        transition feel and strike control rather than label symmetry.
      </p>
    ),
  },
  {
    question: "Is fitting necessary if my swing is inconsistent?",
    answer: (
      <p>
        Inconsistency does not eliminate fitting value, but it changes the objective. Instead of chasing peak outcomes,
        fitting should prioritize stability under your current variability. Appropriate weight and profile can reduce
        timing noise and tighten dispersion enough to make practice feedback clearer. Re-fit later as motion quality
        improves.
      </p>
    ),
  },
  {
    question: "Why does strike location change spin so much?",
    answer: (
      <p>
        Off-center contact changes effective loft and introduces gear-effect dynamics at impact. On driver, low-face
        strikes usually raise spin while high-face strikes often reduce it. Horizontal strike shifts can also tilt spin
        axis and alter curvature. See <a className="text-slate-900 underline" href="/learn/launch-spin-window">Launch and Spin</a> for the window-based interpretation.
      </p>
    ),
  },
  {
    question: "How many shots are needed to test a shaft properly?",
    answer: (
      <p>
        A small handful of shots is rarely enough because swing and strike have natural variance. For meaningful trends,
        collect enough shots to observe central tendency and spread, often in the 10 to 15 range per candidate profile.
        Remove obvious mishits only if the same filtering is applied consistently across all options. Decision quality
        improves when you compare distributions, not single best balls.
      </p>
    ),
  },
  {
    question: "Why does a shaft feel good but perform poorly?",
    answer: (
      <p>
        Feel and outcome are related but not identical signals. A profile may feel smooth while still delivering unstable
        face timing or variable strike depth. Conversely, a firmer-feeling profile can produce tighter launch and spin
        windows once you adapt. Use both subjective feedback and measured dispersion before concluding fit quality.
      </p>
    ),
  },
  {
    question: "Can a heavier shaft reduce a hook?",
    answer: (
      <p>
        It can for some players by slowing closure timing and stabilizing tempo, but it is not automatic. If the hook is
        primarily path-driven, mass alone may only reduce frequency, not remove bias. Heavier builds can also increase
        fatigue if they exceed your sustainable load. See <a className="text-slate-900 underline" href="/learn/shaft-weight-physics">Shaft Weight</a> for the trade-offs.
      </p>
    ),
  },
  {
    question: "What is the difference between launch angle and dynamic loft?",
    answer: (
      <p>
        Dynamic loft is the loft delivered at impact, while launch angle is the ball&apos;s initial vertical trajectory.
        Launch is influenced by dynamic loft, strike location, and impact efficiency, so it is a downstream result.
        Players with similar dynamic loft can still launch differently due to contact and attack differences. That is why
        launch and spin must be evaluated together.
      </p>
    ),
  },
  {
    question: "Do I need a fitting every season?",
    answer: (
      <p>
        Not necessarily. Re-fitting is most useful after meaningful swing changes, injury recovery, speed shifts, or
        clear changes in strike pattern. If your launch window and dispersion remain stable, frequent hardware changes
        may add noise rather than value. Periodic checks are useful, but annual replacement is not a technical
        requirement.
      </p>
    ),
  },
  {
    question: "Why do flex labels from different brands feel different?",
    answer: (
      <p>
        Because flex labels are not governed by a universal standard and do not encode full bend profile data. Two shafts
        labeled stiff can differ in butt frequency, tip stiffness, and torque behavior. Manufacturing tolerances and
        balance distribution add further differences in feel and timing. See <a className="text-slate-900 underline" href="/learn/tempo-vs-flex">Tempo vs Flex</a> for a profile-first framework.
      </p>
    ),
  },
  {
    question: "Should I optimize for distance or dispersion first?",
    answer: (
      <p>
        For most serious amateurs, dispersion stability should anchor the fit and distance should be optimized inside
        that stable envelope. Extra carry that widens start-line or strike variance often costs strokes over time.
        Consistent launch and spin windows usually create more usable distance anyway. The right answer depends on your
        scoring profile, but repeatability is rarely a bad priority.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <HomeLinkPill />

        <header className="mt-5 max-w-3xl">
          <p className="text-sm font-medium text-slate-500">FAQ</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Golf Fitting FAQ: Technical Answers for Serious Amateurs
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Straightforward answers to common fitting questions, grounded in impact physics and practical testing.
            Wherever possible, we separate mechanical constraints from equipment-sensitive variables.
          </p>
        </header>

        <section className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900">
                {item.question}
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-slate-700">{item.answer}</div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
