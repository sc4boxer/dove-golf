# Automatic video check trial

Selecting a playable local clip now starts ball acquisition and tracking automatically for irons and driver. The normal path does not expose a marking step. Successful detection offers a replay button that jumps to the detected moment; optional marking is available under “Help locate the ball (optional)”. Recording outcomes and choosing coaching remain user-confirmed. This iteration does not automatically classify airborne/contact/missed results.

The engine searches for a compact bright object that starts stationary and then moves uniquely. It rejects ambiguous, crowded, camera-moving, stationary and insufficiently trackable footage rather than guessing. All processing stays on the device. Detailed bounds and limitations are in `range-rescue-video-preview.md`.

## Validation

- 143 tests passed, including 48 Range Rescue tests and 29 tracker tests. New cases cover off-center acquisition, stationary objects, absent/already-moving balls, multiple moving balls, stationary neighbors, late shots, partial lost paths, cancellation, replacement, decoding and first-frame readiness.
- Full lint and production build passed. Local Node 22.17 uses `NODE_OPTIONS=--experimental-strip-types` for the full suite; the unflagged visual command retains the known TypeScript-extension issue. No application dependencies changed.
- Browser: fresh file selection successfully found and followed a generated moving ball without any marking; replay jumped to the detected moment. Confirm outcome remained disabled until a user selection.
- A generated stationary clip returned uncertainty, never a miss. Canceling a longer clip restored replay time and keyboard focus. Optional marking still ran the manual tracker. Replacement and both iron/driver entries were checked.
- Initial browser testing caught a transparent first frame despite readyState 4. The decoded seek roundtrip fixed fresh-load detection; a regression test covers it. Temporary diagnostics were removed.
- Desktop and mobile views inspected. Screenshots are in `artifacts/automatic-video-check/`.

## Remaining work

No real range recording has been supplied yet. The current thresholds are tested on generated footage only. Real golf balls may be too small, fast, obscured or similar to nearby balls/clothing. Native phone capture, codec breadth and low-end-device speed remain unverified. Reliable outcome suggestions require real-video evidence and possibly a stronger vision model; automatic ball acquisition alone is not swing diagnosis.

This remains a local trial on the video-refinements branch, together with the prior unpublished camera/spacing/driver/demo improvements. It has not been pushed or published. Existing feature-flag rollback remains available; there are no cloud services, credentials, migrations or infrastructure changes.
