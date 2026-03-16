# Visualization Bug Log

## 2026-03-16 Visual Audit

- Surface scanned: `src/app/diagnostic/page.tsx` (`BallFlightViz`, `FaceStrikeViz`, `LowPointViz`, `WedgeTurfViz`, `WedgeMissViz`)
- Surface scanned: `src/app/page.tsx` (`TrajectoryHeroViz`)
- Spec inputs available: repository visual-spec files referenced by the automation prompt were not present in this worktree, so this audit used the in-code visual comments plus the required shot-shape conventions from the automation.

### Bugs detected

1. `BallFlightViz` rendered shot-shape curvature backwards.
   - Location: `src/app/diagnostic/page.tsx`
   - Impact: `draw` trajectories bent right and `fade` trajectories bent left, which inverted the golf convention shown to users in both the question flow and the fit summary.
   - Root cause: the horizontal bend sign assumed the wrong SVG X-axis direction.

### Fixes applied

1. Corrected the horizontal curve sign in `BallFlightViz`.
   - `draw` now bends left.
   - `fade` now bends right.
   - Ball flight continues to animate from bottom to top.

### Remaining risks

- The shared visual spec files referenced by the automation (`VISUAL_SPEC.md`, `APP_VISUAL_SURFACE_MAP.md`) were not present here, so repository-wide conformance could only be checked against the current code and the requested shot-shape rules.
- Several text strings in the app appear to have mojibake encoding artifacts (`â€¦`, `â€”`, `â†’`). That is a presentation-quality issue, but it is broader than this targeted visualization fix.
