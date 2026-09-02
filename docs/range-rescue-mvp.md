# Range Rescue MVP

## Repository audit

- **Product architecture:** The repository is a Next.js 16 App Router application. Dove Golf's fitting, learning, and DoveClinic experiences live in `src/app` and share a global layout.
- **Existing diagnostic model:** DoveClinic uses multi-step, problem-specific diagnosis, local session history, and analytics. Range Rescue must not reuse that product model because its job is immediate recovery, not root-cause diagnosis.
- **Visual system:** Existing pages use a restrained slate palette, rounded cards, clear type hierarchy, and responsive Tailwind utilities. Range Rescue can retain the repository's legibility conventions while using an independent warm-green and cream identity.
- **Design principle:** Keep the product Apple-like in restraint: strong hierarchy, generous whitespace, quiet grouped surfaces, minimal copy, and no decoration that competes with the next action.
- **State and data:** The application already has Supabase, email, Google Analytics, and local-storage code. Range Rescue needs none of them. Its state is in-memory only and resets on refresh.
- **Deployment:** The repository documents and configures Next.js deployment through Vercel, with `dovegolf.fit` as the production origin. No Sites or other deployment manifest exists in the checkout.
- **Constraints:** Preserve Dove Golf and DoveClinic behavior, avoid their navigation and tracked links, do not add the new product to their product hierarchy, and suppress the global analytics script on the Range Rescue route.

## Product boundary

Range Rescue is a standalone, mobile-first range companion. It helps a golfer settle down and choose one simple experiment during a bad practice session. It does not diagnose a swing, recommend equipment, or teach ball-flight physics.

## MVP scope

1. A single route at `/range-rescue` with independent metadata and visual identity.
2. One question: choose the closest current miss from seven plain-language, diagram-first options that do not require knowing golf terminology.
3. One immediate five-ball plan with a reset, one change, a success cue, and a safe fallback.
4. In-memory selection only. Back and start-over controls clear the current choice.
5. Responsive, keyboard-operable controls with visible focus, 48px minimum targets, reduced-motion support, and live announcement of the selected plan.

### Non-goals

- Accounts, email capture, personalization profiles, saved sessions, history, analytics, trackers, databases, or browser storage.
- Equipment fitting, root-cause probabilities, swing mechanics lessons, advanced terminology, or claims of fixing a swing.
- Integration into Dove Golf/DoveClinic navigation or reuse of their naming and product positioning.
- Multiple routes, content management, payments, sharing, or social features.

## User flow and content model

`Open Range Rescue -> pause and breathe -> choose the closest miss -> follow a five-ball plan -> keep it if 3/5 improve, otherwise use the fallback -> start over if the miss changes`

Each plan contains:

- a short issue label and reassuring summary;
- a `Reset` action that lowers effort and narrows attention;
- a single `Try this` adjustment;
- an exact five-ball test;
- a visible definition of better (`3 of 5`);
- a fallback that favors an easier club/shot or ending on a calm strike.

## Acceptance criteria

- A golfer can reach an actionable plan with one choice and no sign-in.
- Every plan uses plain, target-relative language and asks for only one change at a time.
- No Range Rescue interaction calls analytics, an API, local storage, or a database.
- The route has no Dove Golf or DoveClinic navigation and does not present itself as part of those products.
- The primary options are usable at a 320px viewport, by keyboard, and with a screen reader.
- Every miss option has a beginner-readable impact or ball-flight diagram, repeated on the selected plan as a confirmation cue.
- Refreshing the route clears the choice.
- Lint, type/build checks, content-model tests, and direct mobile/desktop functional checks pass.
