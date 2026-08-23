# Dove Golf production contract

This contract defines the behavior that the revival must preserve while the design, tools, and content evolve. The archive branch remains the exact rollback point for the site that was live before the 2026 revival.

## Domain and deployment

- `https://dovegolf.fit` is the canonical public origin.
- `https://www.dovegolf.fit/*` permanently redirects to the matching apex-domain path.
- Vercel deploys `main` to production.
- Work on `revamp/studio-integration` is preview-only.
- A release may reach `main` only after the owner explicitly approves publishing.
- The archive branch `archive/pre-revival-2026-08-23` must remain available as a rollback point.

## Public pages

The following established routes must continue to build and remain reachable:

- `/`
- `/about`
- `/ball-flight-library`
- `/clinic`
- `/clinic/ball-curves-right`
- `/clinic/driver-slice`
- `/clinic/pull-hook`
- `/diagnostic`
- `/faq`
- `/learn`
- `/learn/ball-flight`
- `/learn/ball-flight/[pattern]`
- `/learn/launch-spin-window`
- `/learn/shaft-weight-physics`
- `/learn/start-line-vs-curve`
- `/learn/tempo-vs-flex`
- `/method`
- `/tools/ball-flight-decoder`

## Behavior-sensitive surfaces

Changes must preserve or deliberately migrate these behaviors:

- Driver and iron recommendation engines and their deterministic scoring.
- DoveClinic cause mapping, confidence scoring, and problem definitions.
- Ball-flight, shot-shape, and strike visual semantics.
- Lead capture, verification, context, email-results, and health route handlers.
- Existing analytics event names used for funnel continuity.
- Search indexing, robots directives, canonical metadata, and sitemap coverage.

The automated contract test confirms that the route files, handlers, domain rules, sitemap entries, analytics names, and documented environment-variable names remain present. It does not replace focused logic tests or browser review.

## Runtime configuration

The following names are documented in `.env.example` and must be configured in the deployment environment as applicable:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Real credentials, private keys, and production identifiers must not be committed.

## Analytics continuity

These established events are part of the production contract:

- `dov_cta_clicked`
- `dov_fit_started`
- `dov_fit_step_viewed`
- `dov_fit_results_viewed`
- `dov_fit_completed`
- `dov_clinic_completed`
- `dov_clinic_recommendation_viewed`

New revival tools may add events, but existing names should remain stable unless an intentional analytics migration is reviewed.

## Pull-request release gate

Every release candidate must pass:

1. Locked dependency installation.
2. Production-contract tests.
3. Existing visual-semantic tests.
4. Ball Flight Decoder model tests.
5. Linting for source files changed by the pull request.
6. A production build.
7. Preview review on both mobile and desktop for the changed user journeys.

The repository's historical full-lint debt is reported separately and does not hide new lint errors in changed files.

## Owner approval and rollback

The integration pull request remains a draft during active development. Vercel updates its preview after every push. Nothing is merged into production until the owner gives an explicit instruction such as “publish,” “go live,” or “merge.”

If a production release must be reversed, restore the last known-good production commit or the preserved archive branch through a reviewed GitHub change. Do not delete the current site, its history, or the archive branch.
