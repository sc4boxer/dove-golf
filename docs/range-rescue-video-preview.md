# Range Rescue shot replay prototype

## Current product

Film a shot. Find your next step. This prototype replaces the earlier face-on swing review with a rear-view, outcome-first experience for beginner iron practice. It keeps Range Rescue's typography, white/slate cards, muted green accents, navigation, and existing before/after semantics. The normal beginner and driver sessions remain separate and unchanged.

The owner requested a near-complete local prototype before pushing, merging, or publishing. This iteration stays local on `codex/range-rescue-video-preview`. No remote push or deployment is authorized by this build request.

## Try it

Enable `NEXT_PUBLIC_SWING_VIDEO_PREVIEW=true` locally and restart/rebuild. At `/range-rescue`, choose Irons, then “Film a shot. Find your next step.” The default flag in `.env.example` remains false. The flag is a discoverability switch, not an authentication boundary.

1. Prepare: rear, offset camera placement with right/left-handed diagrams; safe bay positioning; include the ground and the ball's initial movement.
2. Choose a sample session or your own practice. These modes do not mix results or media.
3. Review five shots. Samples have scrubbable, paused-by-default illustrated replays; own practice can replay a device-local video or work without a clip. Confirm Airborne, Rolled, Missed, or Unclear. Correct any recorded outcome or undo the last attempt.
4. Choose one controlled practice task from the confirmed set. Any unclear starting attempt requires a fresh baseline; no-contact suggests small contact practice; limited airborne results suggest the existing small-swing brush exercise; repeated airborne results suggest repeating the easy swing. These are practice choices, not diagnoses or validated readiness grades.
5. Record five further outcomes and compare confirmed contact and airborne counts. Sample comparisons are labeled examples; unknown comparison outcomes prevent improvement claims. Review/correct comparison outcomes or start fresh.

## Media and evidence boundaries

No camera request, upload, model call, inference, or automatic tracking exists in this prototype. SVG sample trajectories are illustrations, not measured flight. There is no distance, height, speed, club-path, or impact-angle measurement. A miss sample has a stationary ball; an unclear sample supplies no invented trajectory.

Own clips use temporary browser object URLs and native playback controls. Sample traces never overlay own clips. Files are limited to 50 MiB and 30 seconds with MIME/metadata/decode checks and a metadata-loading timeout. Actual format support depends on the browser; MP4 is suggested as a fallback. Clips are released on replacement, removal, confirmation, switching shots, or leaving the component. Editing an outcome requires selecting its clip again. Original files on the user's device are not deleted. No file contents or outcomes are added to analytics.

Session results remain in React memory and clear on exit or refresh. No storage service, account, migration, environment credential, or production configuration is added. Privacy/lead routes and existing analytics events are preserved.

## Architecture and verification

`ShotReplay` handles illustrated replay and local media. `SwingVideoPreview` owns preparation, mode separation, five-shot state, editing, practice, and comparison. `shot-practice.ts` validates exactly five outcomes and reuses `summarizeShots` plus `getSessionFeedback`; repeat-task feedback preserves the existing easy swing rather than incorrectly referring to a newly introduced smaller swing. The original beginner component is restored to its pre-preview version.

Focused tests cover input validation (including sparse arrays), unclear data, all practice branches, unchanged inputs, and feedback consistency. Browser verification covers a complete sample session, confirmed counts, correction/undo, no-data gating, unclear-baseline restart, reset, driver isolation, keyboard controls, 320px mobile and 1280px desktop. Synthetic local files exercise valid replay, removal, broken video, excessive duration, and excessive size; no personal video was used. The metadata timeout is implemented but not forced in browser testing. Native mobile camera recording and iPhone/Android codec coverage remain unverified.

Validation: full lint, Range Rescue tests, production-contract tests, and production build pass. The literal visual test command fails on TypeScript imports under installed Node 22.17; all visual tests pass with `--experimental-strip-types`. Build uses placeholder backend settings and network access for the existing Google Fonts. No dependencies or lockfiles changed. Remote CI/Vercel preview and real-world beginner/coach validation are not yet performed. Screenshots in `artifacts/shot-replay-prototype/` document the new design; older swing-video screenshots represent the superseded concept.

## Next step after prototype review

Evaluate consented rear-view range clips before promising tracking. Begin with detection of initial ball movement and user-confirmed outcomes; full-flight tracking is a separate feasibility project. Test busy backgrounds, other balls, moving phones, rolling shots, loss of visibility, body/club occlusion, and left/right-handed recordings. Stop observed traces when evidence ends. Any estimated continuation must be labeled and must not become a measured coaching claim.

If a real analysis service is selected, define provider terms, audience suitability, private direct uploads, owner-scoped access, bounded background jobs, retry/cancel semantics, spending limits, and verified deletion of storage/provider copies. Coach-defined evaluation and independent clips are required before accuracy claims. None of that service is implemented here.

## Rollback

Disable the preview flag and rebuild, or revert this feature's commits. No data migration is necessary. Preserve the production domain, main branch behavior, and `archive/pre-revival-2026-08-23`. Review the prototype first; a hosted PR preview, merge, and publication are later steps requiring explicit authorization and successful CI.
