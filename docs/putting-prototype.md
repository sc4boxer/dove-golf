# Putting Break prototype

## First playable scope

One flat, bounded green at `/play/putting`. Drag back from the ball and release, or use the labelled aim/power sliders and Putt button. Keyboard users can focus the green and use arrows plus Enter/Space; Escape cancels a drag. Three strokes end a round. A sunk ball scores 300/200/100 points for one/two/three putts. Replay resets the same hole for informal pass-and-play; there is no automatic multiplayer scoreboard. Best strokes stays in memory for this visit only.

The homepage has a secondary putting-break card; existing tool links and analytics stay intact. Route metadata and sitemap include the game. No accounts, network scoring, uploads, storage, purchases, audio, timers, rewards, or backend changes.

## Implementation

Canvas draws a 360 × 480 course at 2× resolution. HTML provides instructions, controls, score, and live result announcements. Simulation runs at fixed 1/120-second UI steps with swept 1/240-second physics substeps. Constant deceleration, damped wall rebounds, and slow-speed cup capture keep results predictable. Essential ball motion has no celebration flashes or decorative animations. Idle rounds stop scheduling animation frames; hidden tabs suspend progress and do not replay elapsed wall time.

The model uses fictional course units and is not intended to teach real putting physics. Direct aim is about 27° clockwise from up; a first-putt power around 80 sinks the ball. Opening power 60 leaves room to discover the pace. A canceled drag does not use a stroke; pointer capture handles releases outside the green.

## Evaluation before expansion

Touch-flow update: after the ball settles on a win or the third missed putt, a result card appears over the green with a Play again button. Focus moves to the result heading and the card is brought into view if necessary. The course header announces remaining putts, the last putt, rolling, and completion. Alternative controls are collapsed by default; the same sliders, keyboard support, and Putt action remain available. A clamped power meter appears beside the ball during an active pull. Physics and scoring are unchanged.

Have several people play on real phones while waiting between turns. Observe whether they discover dragging, distinguish aim from stopping distance, understand overshooting the cup, and want a second round. Confirm comfortable touch targets, course scrolling, and drag reach on short screens. Tune feel before building additional holes. Next candidates are a bank-shot hole and same-hole two-player scoring; saved records or leaderboards require separate design.

## Validation and release

Physics tests cover stopping distance, all walls, invalid input, slow capture/fast overshoot, timestep consistency, and an achievable first putt. The script is part of npm test and CI. Full lint, production build with CI placeholders, visual tests, and production-contract tests are required. Browser checks exercise mobile/desktop, both input methods, victory, exhaustion, reset, and focus. Real touch-device testing and screen-reader testing remain separate from browser emulation.

No migrations. Review the feature preview before publishing; rollback is a revert of the feature commit. Production merge requires explicit approval.
