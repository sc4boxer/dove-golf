# Range Rescue video review release

The final flow automatically checks a selected clip for a possible shot moment, offers a replay, and asks the beginner to confirm Airborne, Rolled, Missed, or Unclear. Manual ball marking and the real-video path overlay are removed. This is not automatic outcome classification: stationary or lost footage remains uncertain, never an inferred miss.

File replacement is tucked under Change video. Replay actions have space below instructions, file controls retain accessible labels, and cancellation/removal restore keyboard focus. Decoded-frame readiness keeps the load timeout active until the video can actually be checked.

This release includes the preceding camera-guide, driver, and sample-animation changes: film from behind looking down the range; one primary practice entry with a small optional sample link; synchronized sample launch; club-specific practice tasks and comparisons.

## Validation

- Full lint and production build passed; no dependency or lockfile changes.
- All 143 tests passed, including 48 Range Rescue tests. Local Node 22.17 requires NODE_OPTIONS=--experimental-strip-types. The literal unflagged visual command fails on TypeScript imports; the same 12 visual tests pass with that flag.
- Browser QC: automatic success with generated moving-ball footage, uncertain stationary footage, invalid-video error, replacement, removal, retry, cancellation, replay controls, disabled confirmation until selection, and video cleanup on confirmation.
- Full driver session checked from five rolled attempts through the appropriate driver task to five airborne attempts and comparison. Sample entry and launch behavior were checked during this workstream.
- Mobile 390px, narrow 320px, and desktop 1280px inspected. No horizontal overflow at 320px; one h1 and canonical URL preserved. Labeled controls, focus styles, and cancellation/removal/stage focus checked.
- Screenshots: artifacts/video-review-release/. Prior detailed tracker and camera/driver checks: docs/automatic-video-check.md and docs/range-rescue-video-refinements.md.

CI and a successful Vercel preview deployment are required before merge. Preview UI may require Vercel authentication; when protected, local browser checks cover the implementation and public production is smoke-tested after deployment.

## Trial limits and rollback

Real range footage, native phone recording, codec breadth, and low-end-device performance remain unverified. Synthetic footage validates mechanics, not real-world accuracy. The owner authorized publishing for their range-video trial. No uploads, API keys, cloud vision services, credentials, migrations, or infrastructure changes are introduced.

Set NEXT_PUBLIC_SWING_VIDEO_PREVIEW=false and redeploy to hide the experimental entry, or revert this release's merge commit. Preserve the existing public routes and production configuration.
