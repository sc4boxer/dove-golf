# Range Rescue beginner program

## Direction

Upgrade the existing range companion into a guided practice program, while retaining the seven quick-rescue choices. The first release teaches contact and a little height through an observable before/after session. It does not infer a swing fault from ball flight. This document supersedes the original MVP's five-ball-only scope; current route metadata, feedback, navigation, and analytics integrations remain in place.

## Phase 1 — implemented in this branch

- A prominent beginner entry, including people unsure what their miss is.
- Five stages: preparation, five starting attempts, three small practice swings without a ball, five comparison attempts, and a concrete next-session action.
- Record airborne, rolling contact, missed ball, or unclear result. Airborne shots also count as contact. Unclear results prevent comparison claims. Every attempt counts; undo corrects the last entry. Incomplete sets cannot advance or produce advice.
- Compare counts using the same club and setup. No distance target, accuracy grade, diagnosis, or promise of improvement. Feedback distinguishes progress, repeatability, no contact, and an easier next task.
- Session results stay in React memory and clear on exit or refresh. No new upload, persistence, account, API, or tracking feature.
- All quick plans use plain instructions and count five actual balls. Starting-shot instructions supply a comparison. Diagrams distinguish straight offline shots from curves; reduced-motion users see a static endpoint.

## Phase 2 — validate and expand the curriculum

Observe 5–8 first-time golfers using the preview without prompting. Have a qualified golf instructor review each exercise and animation. This is a proposed evaluation, not a completed coaching endorsement.

Acceptance questions: Can users select a club, understand hands-to-waist, distinguish airborne from rolling, record five attempts accurately, and explain their next practice action? Can they complete the flow at 320px and with a keyboard? Do animations communicate the intended observation without implying a universal cause?

Prioritize issues that cause an incorrect physical action or false conclusion. Then develop separate lessons for comfortable setup, repeatable contact, aiming toward a broad target, and gradually adding distance. Each lesson needs a single goal, illustrated action, observable measure, simpler fallback, and a repeat-session check. Progression should use repeated sessions and readiness, not one arbitrary score. Optional saved history needs a separately designed persistence and consent experience.

## Phase 3 — video feasibility and evaluation

Do not add an upload button until the analysis pipeline and user-data lifecycle exist. First define an observation rubric with qualified coaches, then evaluate candidate approaches on consented videos across handedness, clothing, body types, camera placements, lighting, devices, and swing speeds.

Capture instructions should visually explain face-on (camera facing the chest) and down-the-line (behind the golfer looking toward the target). Check full-body and club visibility, lighting, framing, camera stability, and a complete swing. Two separately recorded swings must not be treated as synchronized views of the same movement.

The response contract should separate visible observations, uncertain interpretations, and a single proposed exercise. Include clip timestamps and an explicit insufficient-evidence outcome. Evaluate unsupported claims, coach agreement, confidence calibration, and whether the suggested lesson actually follows from the evidence. Define acceptance thresholds with coaches before selecting or releasing a model; do not advertise diagnostic accuracy without evaluation.

Before implementation, decide supported formats and duration/size limits, upload consent, access controls, retention, user deletion, provider data use, and cost limits. Cover upload progress/cancel, invalid media, poor footage, processing timeout, retry, and deletion success/failure. Video should inform the existing practice program, with follow-up observations to check whether advice helped.

## Release and rollback

Feature branch and draft PR only. Review the Vercel preview; merge to production requires explicit approval and successful CI. No infrastructure or data migration. Roll back by reverting the feature commit. Preserve the archived pre-revival branch.

## Validation record

Local validation: npm ci and full lint passed. Range Rescue and visual semantics tests passed with --experimental-strip-types (required by the installed Node 22.17); the literal visual-test command without that flag fails on TypeScript imports. Production-contract tests passed. Production build passed with documented CI placeholder Supabase/Resend settings and network access for existing Google Fonts.

Browser checks covered 320px/390px mobile and 1280px desktop layouts, guided before/after completion, both recorders, undo and incomplete-set gating, final-ball focus, exit focus, refresh clearing, all seven quick-plan selections, both aiming-animation stages, scrolling to the plan, and canonical metadata. Feedback branches have focused unit tests. Reduced-motion fallback was inspected in code but not emulated in the browser. Existing production feedback submissions were not sent; their network loading/error/success states are unverified in this session. Human beginner usability and qualified coaching validation remain future work.

The feature is committed locally. Automated approval review blocked pushing to the GitHub remote pending explicit user approval, so a draft PR, hosted Vercel preview, and remote CI results are not yet available.
