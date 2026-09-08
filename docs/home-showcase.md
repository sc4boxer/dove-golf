# Homepage preview interactions

The existing three tool cards retain their copy, layout, destinations, and analytics parameters. The selector uses a sliding pale-blue active state and its existing hover treatment, while launch buttons remain dark. The Putting Break link now uses the same action treatment with a high-score challenge, without a prize offer.

Click a tab, use arrow/Home/End keys, or swipe horizontally across the selector or non-interactive card surface to choose a preview. Vertical gestures preserve scrolling and pinch zoom. Touch capture transfers from the tab to the swipe container without canceling the gesture. A swipe suppresses its synthetic click; inactive panels remain inert.

Automatic previews cycle Range Rescue, Ball Flight, Equipment Fit, and back. Each selection receives at least ten seconds and waits for its illustration to finish. Illustrations start when at least 20% visible: five balls illuminate in sequence (5.2 seconds), the existing flight chart traces its path (2.8 seconds), and equipment rows then the heading illuminate (4.5 seconds). Returning from offscreen restarts the visible illustration.

Mouse hover temporarily suspends rotation. A manual selection or keyboard focus stops rotation until Resume previews is selected. Pause previews stops automatic motion; hidden pages and offscreen sections suspend work. Reduced-motion preference shows static illustrations and disables automatic rotation. Automatic selection never moves focus or produces repeated live announcements.

## Validation

- Full lint, full test suite, final production build, and homepage tests passed. The new homepage test command runs in CI and covers swipe thresholds, vertical-scroll rejection, wraparound, existing routes, and metadata. On this machine's Node 22.17, existing TypeScript-importing suites require `NODE_OPTIONS=--experimental-strip-types`.
- Local production-build checks at 1280, 390, and 320px covered tab clicks, selector drag swipes, Home/End, active CTA keyboard focus, manual pause, resume, automatic cycling, animation visibility, layout, and all four launch destinations. The 320px page had no horizontal overflow. Canonical metadata is retained.
- Physical touch/pinch gestures, screen-reader announcements, and OS-level reduced-motion emulation remain unverified. Reduced-motion code and touch-capture handling were reviewed. UI interaction used browser automation rather than a physical phone.
- Review this change through its feature-branch PR and Vercel preview. The local production preview is also available on port 3111 while its server is running. Confirm successful CI and preview deployment before any production merge.

No dependencies, data, engine rules, database schema, or infrastructure configuration change. Rollback is a revert of the eventual feature commit.
