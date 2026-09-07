# Putting Break: five-hole challenge

## Player flow

The game lives at `/play/putting`. Players drag back from the ball and release, or use the labelled aim/power sliders and Putt button. Keyboard users can focus the green and use arrows plus Enter/Space; Escape cancels a drag. The fixed HTML power meter stays above the green, outside the playable canvas.

Each hole allows five putts. Sinking the ball or exhausting the allowance opens a result card. Players choose Next hole so they have time to read the result. After hole five, the round scorecard offers optional initials submission to the leaderboard and, after a verified submission, a shareable score image. Play again resets the course, shot log, and score. Playing does not require an account or a working leaderboard service.

| Hole | Name | Challenge |
| --- | --- | --- |
| 1 | Warm-up | Open green for learning aim and pace. |
| 2 | Around the corner | A barrier blocks the direct approach; bank around its end. |
| 3 | The gate | Two barriers leave an offset opening to navigate. |
| 4 | Zigzag | Staggered barriers require more positioning. |
| 5 | The finale | Three barriers protect the cup and require a longer route. |

Holes 2–5 require at least one rebound from a wall or barrier **during that hole** before the cup accepts the ball. The requirement is visible before putting and changes to a completion cue after a bank. A completed bank persists across subsequent putts and resets on the next hole. Barrier placement also blocks direct start-to-cup putts; players can take positioning shots.

A hole scores 500, 400, 300, 200, or 100 points for sinking in one through five putts. A hole left unfinished after five attempts scores zero. The round adds all five hole scores, with a nominal maximum of 2,500 points. There is no speed bonus or timer. The harder layouts are not a promise that every hole is achievable in one shot.

## Implementation

`src/lib/putting/physics.ts` defines the versioned courses, ball state, strike/step functions, and deterministic round replay. Canvas draws a 360 × 480 course at 2× resolution. HTML provides instructions, controls, scores, bank status, and live result announcements. Hidden tabs suspend progress; idle balls stop scheduling animation frames.

The UI and server replay both advance at fixed 1/120-second ticks. Physics uses swept substeps of at most 1/240 second, constant deceleration of 90 course units/second², maximum strike speed 300, and normal rebound restitution 0.65. Walls and rectangular obstacles reflect the ball and record the bank. Obstacle collision rectangles expand by the ball radius, with square collision corners. Capture checks stop at the first collision so a cup cannot be reached through a barrier. The cup captures slow approaches within 10 course units at less than 90 units/second. These are fictional arcade units, not a real putting instruction model.

`replayRound` accepts five arrays of `{angle, power}` shots. It rejects malformed or nonfinite inputs, out-of-range power/angle values, extra shots after a sink, and unfinished holes with fewer than five attempts. It derives every hole result and total score instead of trusting submitted points. Any future course, collision, or scoring change must increment `COURSE_VERSION` so leaderboards do not compare different rules.

## Leaderboard and score images

The optional leaderboard uses the existing server-side Supabase connection. Initials are three letters/numbers; weekly and all-time boards share ranks for equal scores. Initials are not unique or verified identities. Submission errors leave gameplay and the completed local score available for retry.

After a successful submission, the scorecard uses Dove Golf's cream and green design, player initials, points, and a dated weekly rank at submission. The stored result retains its course version. Story and feed image formats can be downloaded; compatible devices also offer the system file-share menu. Instagram publishing remains a player action. A historical rank on a certificate is not a promise of current leaderboard position.

See [Verified putting leaderboard](putting-leaderboard.md) for API contracts, rate limits, privacy, moderation, migration steps, database verification boundaries, and rollback instructions.

## Validation and release

The focused suite in `src/lib/putting/physics.test.js` passes 14 tests. It covers analytical stopping distance, input validation, all walls, slow capture/fast overshoot, timestep consistency, obstacle faces and corners, occluded cup capture, bank persistence/reset, scoring, and invalid/incomplete replay logs. A sweep of 300 maximum-power trajectories checks bounds and barrier exclusion. Direct start-to-cup attempts at every integer power from 1 through 100 fail on the four challenge holes.

The reproducible `solutions` fixture completes the five courses in 1, 2, 2, 4, and 5 shots at the same fixed timestep as the UI and server, totaling 1,600 points. This verifies feasibility, not an optimal route or a guarantee of perceived difficulty. Real player feedback should guide subsequent tuning and version changes.

Local full lint, the full npm test suite (including 14 physics and eight backend tests), TypeScript and production build passed. On Node 22.17, the existing TypeScript-importing Node suites ran with `--experimental-strip-types`.

Browser checks at 1280px, 390px and 320px covered slider/keyboard shots, all five successful holes (1,600 points), all five exhausted holes (zero points), bank cues, result/next-hole focus, replay reset, canonical metadata, leaderboard outage and recovery, empty and populated boards, weekly/all-time selection, submission success and highlighted entry, and both PNG downloads. A discovered 320px scorecard overflow was fixed and rechecked. Submission used the real server replay with a local mock of the Supabase RPC transport: it does not verify persisted database behavior. Screenshots and illustrative locally generated scorecards are in `artifacts/putting-arcade/`. Current pointer dragging, physical touch devices, screen readers and native Instagram handoff remain unverified. CI and Vercel preview checks are required before production merge.

Develop and review on a feature branch/preview. Publishing requires explicit production approval. The application can be rolled back by reverting the feature release; the leaderboard schema is additive and should be retained during rollback to preserve scores. Database migration execution and persisted success/concurrency checks require a test database; follow the linked leaderboard runbook before enabling production posting.

Final visual review: increased separation below the large numeric score to clear comma descenders in both PNG formats, and matched the established social-preview cream/green palette. Re-rendered and inspected the actual drawing module at full export resolution and 320px/1280px browser widths. Updated `scorecard-feed.png`, `scorecard-story.png`, and the standalone renderer comparison `desktop-scorecard.png`; the mobile component screenshot documents the corrected page width.
