# Film your swing. Get one thing to work on.

## Product decision

Start with an interactive preview inside beginner iron practice. The user selected a preview before connecting AI. This release uses illustrated examples only: no camera request, file selection, upload, processing service, new account, or personal swing assessment. It preserves the existing driver flow and deterministic shot comparison.

Enable `NEXT_PUBLIC_SWING_VIDEO_PREVIEW=true` in local development or a review deployment, then rebuild/restart. The default is false. The flag controls discoverability, not access to confidential information; all example content is public-safe. Do not enable or publish to production without explicit owner approval.

## Experience

1. Enter from the beginner card in Range Rescue with irons selected.
2. Prepare and record five starting attempts using the existing recorder. Every attempt counts; unknown outcomes stay unknown.
3. Explore face-on filming guidance: show the complete golfer and club, use a stable phone outside the swing area, and capture setup through finish. The preview illustrates framing without accessing a camera.
4. Explore a supported example, footage needing a retake, or a clear clip with no supported finding. All results are explicitly examples.
5. A supported example describes hands traveling above waist height. It does not label a longer swing a fault or claim it caused a miss. Offer the existing smaller-swing exercise as an experiment.
6. Rehearse and record five comparison attempts. Reuse existing feedback; do not claim the example video explains the golfer's actual results.

Back from the preview preserves starting shots. Skipping the preview leads to the usual exercise. Leaving the session or refreshing clears its state. Keep the same club and setup across the comparison; any future setup-changing recommendation requires a new baseline.

## Path to a working private beta

First evaluate consented clips against a rubric defined with a qualified instructor. Start with one face-on view and irons. Candidate observations are visible swing length and a finish step; setup diagnosis, exact joint/club angles, impact conditions, and ball-flight causation are outside the first scope. A finish step is an observation, not proof of imbalance or a cause of poor contact. Two separately recorded swings are not synchronized camera views.

Use 20–30 clips for initial feasibility, including left/right-handed players, different clothing/body types, lighting, device formats, camera errors, and unclear clips. This is not a validation sample sufficient to advertise accuracy. Reserve independent evaluation clips and agree release thresholds with coaches for observation agreement, unsupported claims, appropriate abstention, and exercise suitability before choosing a model. Measure processing time and cost per completed review.

The analysis contract should contain a supported observation code, evidence timestamps within the clip, footage quality issues, and an allowed exercise ID. Reject malformed output and unsupported claims. Render controlled coaching copy from exercise IDs rather than unrestricted model advice. Treat any instructions embedded in uploaded media as content, never as system instructions. A usable clip can still produce no supported finding.

Proposed service flow: browser receives a narrowly scoped upload authorization; clip uploads directly to private storage; server validates media and starts a bounded background job; client polls status; model output passes validation; the user receives one observation and one exercise. API keys remain server-side. Use owner-scoped job/result/delete access and durable per-user and overall spending limits. Do not accept arbitrary remote URLs as media sources.

Proposed capture limits for testing: one 5–15 second swing clip, up to 50 MB, with supported codecs confirmed on iPhone and Android. Keep native upload as a fallback when browser recording is unsupported. Validate true media type, duration, size, and frame decoding on the server; client checks are only convenience. Evaluate sampling around fast motion rather than trusting low-rate defaults.

Define and test upload progress/cancel, invalid media, footage retake, timeout, retry, unavailable provider, no finding, successful result, deletion, and failed deletion. Canceling a client request alone must not imply a job or stored video was deleted. Make retries idempotent to avoid duplicate charges.

For the beta, propose deleting the source clip after processing, with a bounded cleanup deadline for failed jobs and an explicit delete action. The exact promise must cover our storage and provider copies, distinguish operational logs/backups, and be verified before it appears in product copy. No model-training reuse without a separate opt-in. Choose provider terms appropriate to the audience, including junior golfers if supported; do not assume a consumer developer API permits every age group.

## Effort and prerequisites

Planning estimate: a few development days for the interaction preview; 3–5 days for initial model feasibility; roughly 3–6 weeks for a narrow private beta with upload lifecycle and testing, assuming one experienced developer and timely coach/provider access. These are estimates, not delivery commitments. A provider account, server-side credentials, consented evaluation footage, coaching review, and preview infrastructure configuration are needed for real analysis.

No AI provider has been selected. Gemini supports video input, but its developer API terms include audience restrictions that need to fit the product. Paid-service handling differs from unpaid-service handling. Provider choice should follow evaluation and audience requirements, not just a successful demo.

## Technical references checked during planning

- [Vercel function limits](https://vercel.com/docs/functions/limitations): normal function payloads are limited to 4.5 MB, motivating direct uploads.
- [Video understanding](https://ai.google.dev/gemini-api/docs/video-understanding): video input and sampling controls.
- [Gemini API terms](https://ai.google.dev/gemini-api/terms): audience and data-use requirements; paid use is not a promise of zero retention.
- [Files API](https://ai.google.dev/gemini-api/docs/files): provider file deletion facilities and automatic expiry.

## Release and rollback

Feature branch and review deployment only. The preview adds no backend service or migration. Disable the preview flag and rebuild to remove its entry, or revert the feature commit. Preserve established routes, metadata, analytics, lead capture, scoring, and the archive branch. Before production merge, require successful CI, a Vercel preview, and explicit publication approval.

The implementation is committed locally on `codex/range-rescue-video-preview`. Automatic approval review rejected pushing to `https://github.com/sc4boxer/dove-golf.git` because it requires explicit authorization for exporting repository source to that destination. No push, draft PR, hosted preview, or production deployment occurred.

## Validation

Local verification passed: dependency install, full lint, seven Range Rescue tests, thirteen production-contract checks, and production build with placeholder backend settings and network access for existing Google Fonts. The literal `node --test src/lib/visual/*.test.js` fails on TypeScript imports under Node 22.17; rerunning with `--experimental-strip-types` passes all twelve visual tests.

Browser checks covered 1280px desktop and 320px mobile, all three example outcomes, retake recovery, preserved starting shots after Back, undo/incomplete-set gating, keyboard activation and heading focus, skip to practice, completed before/after comparison, driver isolation, refresh reset, and the unchanged canonical URL. Screenshots: `artifacts/swing-video-preview/desktop.png` and `artifacts/swing-video-preview/mobile.png`. Real recording, upload, model behavior, latency, deletion, and coaching accuracy are outside this preview and remain unverified. Existing external feedback/lead submissions were not exercised. Remote CI and a hosted Vercel preview are not yet verified.
