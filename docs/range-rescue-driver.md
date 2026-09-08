# Driver practice in Range Rescue

Range Rescue begins with an Irons / Driver radio choice. Irons remain the default and keep their original seven plans and comparison behavior. Driver selects seven separate tee-shot plans and a driver version of the guided session. Both share the same observation IDs and five-shot counts; analytics retain existing event names and add the club context on plan selection and starting a rescue.

Driver instructions keep tee height and ball position consistent between baseline and follow-up sets. Setup changes require a fresh baseline. Leaving the guided session clears its local React state; club selection is only available outside the session, so sets from two clubs cannot be combined. Unclear observations cannot produce an improvement claim. Flight height is an observation, not a launch optimization or diagnosis.

The new driver illustration shows a teed ball and club above the mat. It does not reuse iron ground-brushing guidance or prescribe a fixed tee height. Left/right observations are target-relative and avoid assuming handedness. The homepage mentions both clubs and labels its small-swing illustration as an example iron practice.

## Guidance references

- [PGA: Find the Fairway More Off the Tee](https://www.pga.com/story/find-the-fairway-more-off-the-tee) supports target selection and forward driver ball-position context. We do not adopt its broad attribution of every miss to a downward strike.
- [Titleist Learning Lab: Gear Effect](https://www.titleist.com/learning-lab/performance/golf-gear-effect) explains why driver impact location can contribute to curvature. Driver plans therefore do not infer a swing fault from curve alone.

These are educational practice experiments, with no promise of corrected mechanics or distance gains.

## Validation and release

Full lint, Range Rescue domain tests (all seven driver plans and driver feedback branches), 11 homepage tests, 12 visual tests, and production build pass. Local Node 22.17 needs `NODE_OPTIONS=--experimental-strip-types` for TypeScript imports in visual suites.

Browser checks at desktop, 390px and 320px cover club selection, a complete driver session with two sets of five, disabled progression for incomplete sets, undo, accurate results, finishing, driver quick-rescue focus, keyboard club switching, and restored iron instructions. Homepage rapid tab reversals and keyboard selection preserve one interactive panel; its CSS crossfade and settling movement are interruptible and preserve card height. Reduced-motion styles disable transitions. Physical touch, screen-reader announcements and OS-level reduced-motion emulation remain unverified.

No schema, stored scores, course rules, dependencies, routes, or canonical metadata change. Review the PR/Vercel preview before production merge. Revert the feature commit to roll back.

## Animated beginner guide

The guided driver's practice step now includes a one-pass, 4.6-second animation: shorter backswing, sweep through the teed ball, then controlled finish. The example ball moves away from the tee as the club reaches it, and three readable cues highlight in order. This is an illustrative tee shot, not a predicted trajectory or a full-body swing model. The driver remains above the ground.

The sequence starts when at least 30% of the figure is visible. Replay picture restarts the illustration and brings it into view without changing the recorded baseline. Reduced-motion users see the static diagram and three cues without autoplay or a replay control. Quick-rescue plans retain their existing setup reference; only the beginner practice step uses the new animation.

Validation for this follow-up: full lint, Range Rescue tests, visual tests, and production build passed. Desktop and 320px browser QC verified animation start/finish, replay, readable cues, and keyboard progression to the next five-shot recorder with focus on its heading. OS-level reduced-motion and physical touch were not exercised; the reduced-motion CSS was reviewed. No scoring, recorded data, or guidance rules change.
