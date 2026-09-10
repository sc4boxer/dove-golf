# Returning to Range Rescue

The existing guided beginner session now supports optional practice history. The Range Rescue page keeps its iron/driver selector, beginner entry, video entry and miss options, with a matching progress panel between guided practice and the quick-rescue choices.

## Product behavior

- Saving is off by default. “Remember my practice” enables future completed-session saves; “Save this and future sessions” also saves the just-completed session.
- A session is complete only after recording both sets of five and choosing the comparison. Unfinished attempts are not persisted.
- The browser retains at most 30 completed sessions across both clubs. The history panel shows the latest five for the selected club, including contact and airborne counts for each set and uncertainty notes.
- Next-practice advice uses the existing feedback logic for the latest session with the selected club. It does not combine irons and driver or claim a lasting improvement from a small sample.
- Each club has three practice visits: observe, repeat, review. Distinct saved local calendar dates advance the series, regardless of performance. Progress reflects retained history, not a lifetime achievement. The guided session highlights the current visit's focus and retains the established exercise and scoring.
- The weekly challenge counts completed sessions on two distinct local calendar days, across either club, Monday through Sunday. Repeating sessions or switching clubs on the same day does not earn another day. There are no prizes, streak penalties or required perfect shots.

## Storage and privacy

Only `dove-golf-practice-v1` is used. Version 1 stores an enabled flag and bounded sessions containing a random session ID, UTC completion time, the local calendar date at completion, club and the two sets of shot outcomes. These records stay in browser localStorage. No accounts, server requests, video storage or analytics payloads were added for practice history. Analytics consent remains independent.

Parsing rejects malformed or incomplete data. Storage failures show a message and do not report successful saving. Writes read the current stored value first, preserving other tabs' saves and honoring deletion/opt-out. Clearing history requires an inline confirmation, removes only this feature's key, and turns saving off. Other browser features and putting leaderboard records are untouched.

## Validation and rollback

`npm run test:range-rescue` includes focused history and storage regression tests: corrupt/incomplete records, duplicate saves, retention limit, club separation, date boundaries, blocked/full storage, deletion failure, and another tab disabling saving.

There is no server migration. A code revert stops using this key but does not destroy users' browser records. Keep the version stable for compatible fixes; a future schema change needs an explicit migration. Users can remove saved records through the feature or their browser's site-data controls.

This feature is based on the organic-growth foundation branch (PR #100). Review and merge that dependency before merging this feature into main.
