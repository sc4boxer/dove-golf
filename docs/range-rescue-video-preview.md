# Range Rescue: local shot tracking experiment

## Current direction

The owner chose local-first analysis: record/select a video, tap the ball, analyze movement on the device, and confirm the outcome. External AI APIs are not required for this experiment. The unused cloud integration was removed before commit; no clips were sent, no API key configured, and no billing enabled.

The owner authorized full available QC followed by push and merge, with real range footage and native phone recording reserved for their trial. This is an experimental feature, not a validated golf-video diagnosis.

## Try it

Open `/range-rescue`, select Irons, choose “Film a shot. Find your next step.”, then “Start my practice”. The experimental entry is enabled by default; `NEXT_PUBLIC_SWING_VIDEO_PREVIEW=false` at build time hides it. `.env.example` documents the enabled default.

Choose a clip from the device or use “Or record a new shot”. Supported mobile browsers may open their native camera; desktop browsers may present a file chooser. No permission is requested automatically. Use a steady, rear-offset view in a safe position within the bay.

Pause just before the ball moves. Choose “Mark the ball”, tap its center, then choose “Track ball movement on this device”. Keyboard users can move the crosshair with arrows and confirm with Enter; Escape cancels marking. Tracking inspects the next three seconds at most. A candidate path appears only from positions extracted from the selected video's frames. Replay to check whether the candidate was the ball, then confirm Airborne, Rolled, Missed, or Unclear yourself.

The separate sample-session mode remains illustrated and clearly labeled. It has no connection to the local tracking algorithm or real shot results.

## What the local analysis does

`local-ball-tracking.ts` reads decoded video frames through a browser canvas, scaled to a maximum 640-pixel dimension. A tapped seed anchors a compact bright component. The tracker checks nearby candidates against motion, brightness, area, shape, and ambiguity limits, and compares background patches for camera movement. It stops when the candidate disappears, becomes ambiguous, or the background moves too much. It never bridges a detection gap or extrapolates a flight.

At most 90 frame samples over three seconds are inspected. Source videos with lower frame rates may repeat decoded frames; the algorithm does not turn those into motion/speed measurements. A four-second seek timeout and overall processing time check bound slow-device work. Cancellation stops processing and restores the starting replay position. All processing happens in this browser; the site server only serves the application.

The first version is intended for a small light-colored ball and a steady camera. Colored balls, bright mats/clothing, blur, occlusion, rapid motion, very small balls, busy ranges, or handheld footage may fail or produce the wrong candidate. A user tap narrows the search but does not establish the candidate's identity. Thresholds are hypotheses tested on synthetic data, not validated golf-video accuracy.

Image-space movement does not prove contact or height. In particular, no movement or a lost track must never be labeled a miss. There is no measured distance, launch angle, speed, trajectory in 3D, or swing-fault diagnosis. The user still confirms outcomes before the existing local practice rules select an exercise.

## Practice flow

Record five starting attempts, correct/undo entries as needed, choose one controlled task, then record five more attempts and compare. Any unclear starting attempt requires a fresh baseline. No-contact suggests smaller contact practice; limited airborne results suggest the small-swing brush exercise; repeatable airborne results suggest keeping the same easy swing. These are practice choices, not validated readiness grades. Unclear comparison results prevent improvement claims.

The same iron and setup must be used across sets. Normal beginner/driver flows, public routes, canonical URLs, analytics, lead capture, and deterministic scoring remain unchanged.

## Privacy and lifecycle

The replay accepts clips up to 50 MiB and 30 seconds with MIME/metadata/decode checks. Supported codecs depend on the browser. Files use temporary object URLs; frame buffers and tracking points remain in local memory. There is no fetch, upload endpoint, external model, account, API fee, or credential for this feature.

Clips clear on replacement, removal, shot confirmation, navigation to another shot, or leaving the component. Editing requires selecting a clip again. Removing a clip does not delete the original device file. Results clear on exit/refresh. No frame contents, file names, trajectories, or outcomes are added to analytics. Native camera software may save recordings to the device according to its own settings.

## Validation and remaining work

Synthetic pixel tests cover moving/stationary balls, disappearance, equally plausible candidates, an oversized bright occluder, invalid or ambiguous seeds, frame dimensions, translated backgrounds, and a static-background control. Browser testing uses locally generated moving-ball, stationary-ball, and disappearing-ball MP4s. Actual video-frame processing produced the expected tentative track/loss/no-movement outcomes. This is not evidence of accuracy on real golf footage.

Full lint, Range Rescue tests, production-contract checks, and build pass. The literal visual test command fails on TypeScript imports in Node 22.17; visual tests pass with `--experimental-strip-types`. Build uses placeholder backend settings and network access for existing Google Fonts. No application dependencies or lockfiles changed.

Browser verification covers local loading, keyboard marking, actual tracking, restored starting time, cancellation, replacement/removal, and mobile/desktop layout. Earlier prototype checks cover correction/undo, baseline uncertainty, full comparison, invalid/overlong/oversized clips, reset, and driver isolation. Native phone camera capture, broad iPhone/Android codec coverage, low-end-device performance, and real range tracking accuracy remain unverified. Synthetic screenshots are in `artifacts/local-ball-tracking/`.

Next evaluate real range clips with manual ball-position annotations: measure how often the intended ball is acquired, when identity is lost, how quickly the algorithm stops, false tracks, processing time, and whether users understand uncertainty. Include rolling shots, misses, both handednesses, mat glare, camera movement, and busy backgrounds. Have qualified coaches review any future new exercise rules. Consider different local algorithms or a hosted model only if evidence shows a benefit.

## Rollback

Disable the preview flag and rebuild, or revert the feature commits. There is no migration or cloud resource to remove. Preserve the production domain and `archive/pre-revival-2026-08-23`. Remote CI and a successful Vercel preview are required before the authorized merge. See the release QC record for evidence and remaining trial limitations.

