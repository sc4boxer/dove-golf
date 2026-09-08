# Homepage preview interactions

The existing three tool cards retain their copy, layout, destinations, and analytics parameters. The selector uses a sliding pale-blue active state and its existing hover treatment, while launch buttons remain dark. The Putting Break link now uses the same action treatment with a high-score challenge, without a prize offer.

Click a tab, use arrow/Home/End keys, or swipe horizontally across the selector or non-interactive card surface to choose a preview. Vertical gestures preserve scrolling and pinch zoom. Touch capture transfers from the tab to the swipe container without canceling the gesture. A swipe suppresses its synthetic click; inactive panels remain inert.

Automatic previews cycle Range Rescue, Ball Flight, Equipment Fit, and back. Each selection receives at least ten seconds and waits for its illustration to finish. Illustrations start when at least 20% visible: five balls illuminate in sequence, the existing flight chart traces its path, and equipment rows then the heading illuminate. Each ends with an explicitly labeled example takeaway (6.3 seconds for Range Rescue, 4 seconds for Ball Flight, 5.6 seconds for Equipment Fit). Returning from offscreen restarts the visible illustration.

Mouse hover temporarily suspends rotation. A manual selection or keyboard focus stops rotation until Resume previews is selected. Pause previews stops automatic motion; hidden pages and offscreen sections suspend work. Reduced-motion preference shows static illustrations and disables automatic rotation. Automatic selection never moves focus or produces repeated live announcements.

## Validation

- Full lint, full test suite, final production build, and homepage tests passed. The new homepage test command runs in CI and covers swipe thresholds, vertical-scroll rejection, wraparound, existing routes, and metadata. On this machine's Node 22.17, existing TypeScript-importing suites require `NODE_OPTIONS=--experimental-strip-types`.
- Local production-build checks at 1280, 390, and 320px covered tab clicks, selector drag swipes, Home/End, active CTA keyboard focus, manual pause, resume, automatic cycling, animation visibility, layout, and all four launch destinations. The 320px page had no horizontal overflow. Canonical metadata is retained.
- Physical touch/pinch gestures, screen-reader announcements, and OS-level reduced-motion emulation remain unverified. Reduced-motion code and touch-capture handling were reviewed. UI interaction used browser automation rather than a physical phone.
- Review this change through its feature-branch PR and Vercel preview. The local production preview is also available on port 3111 while its server is running. Confirm successful CI and preview deployment before any production merge.

No dependencies, data, engine rules, database schema, or infrastructure configuration change. Rollback is a revert of the eventual feature commit.

## Clearer examples and tool discovery

The previews now end with readable example takeaways and a subtle blue highlight. The content remains visible with reduced motion or paused previews. A compact problem-based guide links directly to all three tools and records `home_tool_guide` CTA placement using the existing analytics component.

The Putting Break card reads the existing current-course, all-time leaderboard. It displays the leading score and initials, an invitation to set the first score for an empty board, or a playable fallback after failure/timeout. Original-course history remains in the game leaderboard; no stored scores or course rules change. The homepage remains statically generated, with leaderboard loading on the client.

At widths up to 620px, Privacy choices appears in normal document flow after page content, with a 44px minimum target. Desktop positioning and the initial/reopened consent banner retain their behavior.

Validation for this follow-up: full lint, 11 homepage tests, 12 visual tests (with local Node type stripping enabled), and production build passed. Browser QC at desktop, 390px, and 320px covered readable preview takeaways, keyboard selection/focus, automatic preview progression, tool-guide navigation, leaderboard failure fallback, and mobile privacy reopening/saving. Empty, real-score, malformed-response, and wrong-edition cases are covered by focused unit tests. Physical touch, screen readers, and OS-level reduced motion were not exercised. Local preview uses port 3113; Vercel and CI must be checked before production merge.

No dependencies, database migrations, or credentials are added. Rollback is a revert of this feature commit.
