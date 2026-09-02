# Voice-directed development and deployment

Dove Golf is configured for a GitHub-first workflow. The user can describe an outcome in conversation; implementation should happen on branches and pull requests without manual copying or pasting.

## Normal workflow

1. Clarify the outcome and production impact.
2. Inspect current repository state and assign specialized agents when the task is broad.
3. Create a focused feature branch from the latest `main`.
4. Implement and validate the change.
5. Open a pull request.
6. GitHub Actions runs lint, visual-logic tests, and a production build.
7. Vercel's GitHub integration creates a preview deployment.
8. Review the preview and report remaining risks.
9. Merge only after the user explicitly requests publication.
10. Vercel automatically deploys the merged `main` commit to production.

This removes the need for file uploads, pasted code, and manual Vercel deployments.

## Branches

- `main`: production source
- `archive/pre-revival-2026-08-23`: protected rollback snapshot
- `revamp/*`: redesign and infrastructure programs
- `feature/*`, `fix/*`, `content/*`: focused changes

## Release language

- “Build,” “change,” “revise,” or “preview” authorizes work on a feature branch and pull request.
- “Publish,” “deploy,” or “merge to production” authorizes merging a reviewed change after required checks succeed.
- If required checks fail, do not merge. Explain the failure and fix it or request a decision.

## Automated checks

The CI workflow validates:

- dependency installation from the lockfile
- ESLint
- existing ball-flight visualization tests
- a full Next.js production build

Vercel remains responsible for preview and production hosting through its native GitHub integration.

## Production services

The application currently depends on:

- Vercel for hosting and deployments
- Supabase for lead data
- Resend for verification email
- Google Analytics for traffic and product events
- `dovegolf.fit` as the canonical public domain

Environment variables belong in Vercel or the relevant service, never in commits. Keep `.env.example` synchronized with required variable names and harmless placeholder values.

## Rollback

If a production release regresses:

1. Identify the last known-good production deployment.
2. Prefer Vercel rollback for the fastest restoration.
3. Revert the offending GitHub commit on a new fix branch.
4. Run CI and preview validation.
5. Merge the revert so GitHub and Vercel return to a consistent state.

The archive branch is a long-term reference snapshot, not the everyday rollback mechanism.
