# Experimental shot tracking release QC

The owner authorized push and merge after available QC, accepting that real range footage and native phone capture will be tested in their own trial. Release review performed September 8, 2026 UTC on `codex/range-rescue-video-preview`, incorporating main through `bc5ea57`.

## Automated checks

- Full ESLint passed.
- All 124 tests in `npm test` passed using `NODE_OPTIONS=--experimental-strip-types` on local Node 22.17. The literal `node --test src/lib/visual/*.test.js` was attempted and fails because this local Node version needs the TypeScript flag. CI uses current Node 22.
- Range Rescue has 29 passing tests, including 14 tracking tests. Added browser-boundary mocks cover detected motion, no motion, cancellation, decode failures, canvas cleanup, replay restoration, and source replacement protection.
- Production build passed with placeholder backend configuration and network access for existing Google Fonts.
- Production dependency audit reported zero vulnerabilities. No dependency or lockfile changes, so a new local `npm ci` was not needed; remote CI performs a clean install.
- Separate tracking and UI/flow code reviews found no release blockers. New feature code contains no upload/network/persistent-storage calls.

## Browser checks

- Recorded a full starting set, corrected a result, undid and re-entered a shot, selected a practice task, completed five comparison attempts, and verified totals (contact 4/5 to 5/5; airborne 0/5 to 5/5).
- An unclear starting result requires a fresh baseline and does not produce a confident coaching recommendation. Confirm buttons require an explicit selection. Reset clears records.
- Invalid, over-50-MiB, and over-30-second clips show appropriate errors. A valid clip loads after errors.
- Real decoded synthetic landscape clips previously verified moving, stationary, disappearing-ball, cancellation, replay restoration, and replacement/removal behavior. This release check adds a portrait MP4 with pointer marking and successful local frame tracking. Confirmation unmounts the video.
- Desktop 1280px setup and 390px comparison/portrait tracking layouts inspected. Portrait aspect ratio preserved and no horizontal overflow. Saved screenshots are in `artifacts/range-rescue-release-qc/`; earlier tracking screenshots remain in `artifacts/local-ball-tracking/`.
- Keyboard marking/Enter/Escape and visible focus checked during prototype QC. Heading focus after recording and page transitions verified again. Outcome controls, form labels, status/errors, table headers and basic contrast reviewed.
- Mirrored left-handed camera guide inspected. Driver selection hides video entry and opens the existing driver practice flow. Existing Range Rescue canonical URL and title verified.

## Release and rollback

The entry is enabled by default so the owner can trial it after deployment. Setting `NEXT_PUBLIC_SWING_VIDEO_PREVIEW=false` and rebuilding disables it. No cloud service, account, credential, migration, or infrastructure change is introduced. A revert of the feature PR is the code rollback.

Require successful PR CI and Vercel preview deployment before merging. Hosted UI checks and final URLs are recorded in the PR. Preserve existing production domain and archive branch.

## Remaining trial limitations

Synthetic tests do not establish tracking accuracy on golf footage. Real range videos, actual iPhone/Android capture, broad codec support, low-end-device performance, handheld shots, glare, small/fast/colored balls and busy backgrounds remain unvalidated. Tracking is experimental; it may follow the wrong bright object. It cannot measure distance, height, speed or contact, and coaching uses user-confirmed outcomes. The user plans to trial their own range recording after release.
