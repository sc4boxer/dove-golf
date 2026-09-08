# Video practice refinements

The owner requested a straight view down the range, more space between explanatory text and actions, driver support, and a clearer sample animation. They chose to keep the demo as a small optional link rather than remove it.

## Changes

- The filming guide places the camera behind the ball at the back of the bay, facing straight down the range. Handedness changes the golfer's side, not the camera direction. Instructions retain safe separation from the swing area and the option to skip filming.
- Real-video practice is the main action. The competing demo card becomes a smaller “See a demo with sample shots” link. The primary action has a measured 24px gap above it on desktop and at 320px. Replay caption, privacy text, setup fields and tracking controls also have explicit spacing.
- Both irons and driver open video practice. Club context persists through the session, demo, exercise, and feedback. Driver practice keeps the driver, tee height and ball position fixed and uses an easy shorter swing above the mat; it never inherits the iron brush exercise. Airborne means flight beyond the tee, not the ball's initial raised position.
- The first sample is airborne, with unchanged aggregate starting results. Interpolated club movement reaches impact at the same point that the ball starts moving. Driver samples show a tee and driver head. Rolling samples move, and missed shots explicitly explain why the ball remains in place. Samples remain paused initially and can be played or scrubbed with the keyboard.

## Validation

Full lint and production build pass. All 128 tests pass, including 33 Range Rescue tests and four new driver practice/feedback regression tests. Local Node 22.17 requires `NODE_OPTIONS=--experimental-strip-types`; the literal visual test command was attempted and retains its known TypeScript-extension failure without that flag. Dependencies and lockfile are unchanged.

Browser checks cover desktop driver setup, 390px demo and practice, 320px iron setup, left-handed guide, exact 24px action spacing, no horizontal overflow, actual Play and keyboard Home/End scrubbing, airborne and rolling movement, explicitly stationary missed shot, full driver practice/comparison flow, club-specific feedback, and driver-mode synthetic local-video tracking. The full driver comparison showed contact 4/5 to 5/5 and airborne 2/5 to 5/5 using manual example selections. Screenshots: `artifacts/video-refinements/`.

These refinements are on `codex/range-rescue-video-refinements` for local review. The previous release remains live; this iteration has not been pushed, merged or published. Real range accuracy and native phone camera/codec/performance checks remain the owner's trial. The existing build flag and PR revert remain rollback options; no infrastructure or data changes.
