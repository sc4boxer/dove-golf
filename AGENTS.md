# Dove Golf repository instructions

These instructions apply to the entire repository.

## Mission

Improve Dove Golf as a useful, trustworthy public product while preserving the live site's working behavior, search visibility, and rollback path.

## Collaboration model

For broad changes, divide the work among specialized agents when available:

- product and information architecture
- UI implementation and design-system consistency
- golf-domain logic and visualization correctness
- accessibility, SEO, analytics, and performance
- testing and release verification

Keep one integration owner responsible for resolving overlap, running validation, and preparing the pull request. Give agents non-overlapping file ownership whenever practical.

## Production safety

- Never delete or rewrite the `archive/pre-revival-2026-08-23` branch.
- Do not push experimental work directly to `main`.
- Develop on a feature branch and open a pull request.
- Treat a Vercel preview as the review environment. Production changes happen only after the pull request is approved and merged.
- A request to design, revise, or preview is not permission to publish. Require an explicit request such as “publish,” “deploy,” or “merge to production.”
- Do not change the production domain, DNS, Vercel project linkage, Supabase project, Resend sender, or analytics property unless explicitly requested.
- Never commit secrets or real production credentials.

## Preserve existing value

- Preserve public routes, metadata, canonical URLs, robots directives, sitemap coverage, analytics events, and lead-capture behavior unless the task explicitly changes them.
- When intentionally replacing a public route, add a permanent redirect and verify it.
- Preserve deterministic golf scoring and diagnostic behavior during visual refactors. Changes to engine logic require focused tests and an explanation in the pull request.
- Reuse the existing components and domain modules before duplicating logic.

## Required validation

Before marking a change ready:

1. Run `npm ci` when dependencies or lockfiles changed.
2. Run `npm run lint`.
3. Run `node --test src/lib/visual/*.test.js`.
4. Run `npm run build`.
5. Check affected pages at mobile and desktop widths.
6. For user flows, verify navigation, forms, loading, error, and success states.
7. For public-facing changes, check keyboard use, visible focus, headings, metadata, and obvious contrast issues.
8. Confirm the pull request has a successful CI run and a Vercel preview before production merge.

If a validation step cannot run, state exactly what remains unverified.

## Change quality

- Prefer small, reviewable pull requests with a single clear outcome.
- Add or update tests for reusable logic and regressions.
- Keep environment-variable names documented in `.env.example`, using placeholder values only.
- Include screenshots or preview links for visible changes.
- Document migrations and rollback steps for data or infrastructure changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
