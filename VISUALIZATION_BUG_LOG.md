# Visualization Bug Log

This log tracks visualization-specific defects and improvements discovered during visual-agent audits.

---

### [ID: VIS-0104] Pull-hook hero chart started on the wrong side
- **Date:** 2026-03-16
- **Status:** `Resolved`
- **Component:** `PullHookMiniChart`
- **Path:** `src/components/clinic/ClinicHeroMiniCharts.tsx`
- **Bug Type:** Shot-shape semantic mismatch
- **Severity:** `Critical`
- **Explanation:** The hook mini chart rendered a left-starting path that curved further left. Per spec for right-handed semantics in this app pass, hook must start right then curve strongly left.
- **Proposed Fix:** Shift start marker to right of target line and redraw path to bend back left.
- **Related Spec:** `VISUAL_SPEC.md` §1.2 / §1.3

### [ID: VIS-0103] Driver-slice hero chart started from the wrong side
- **Date:** 2026-03-16
- **Status:** `Resolved`
- **Component:** `DriverSliceMiniChart`
- **Path:** `src/components/clinic/ClinicHeroMiniCharts.tsx`
- **Bug Type:** Shot-shape semantic mismatch
- **Severity:** `Critical`
- **Explanation:** The mini chart started right of target and curved right, conflicting with the required convention for this audit pass (slice starts left, then curves right).
- **Proposed Fix:** Move start marker left of target and redraw trajectory to finish right with clear rightward curvature.
- **Related Spec:** `VISUAL_SPEC.md` §1.2 / §1.3

### [ID: VIS-0102] Ball-flight library draw/fade controls were sign-inverted
- **Date:** 2026-03-16
- **Status:** `Resolved`
- **Component:** `BallFlightLibraryViz`
- **Path:** `src/components/learn/BallFlightLibraryViz.tsx`
- **Bug Type:** Label/path direction mismatch
- **Severity:** `Critical`
- **Explanation:** `startLine` and `curve` maps used inverted x-direction signs, causing right/left starts and draw/fade curvature to render opposite of labels.
- **Proposed Fix:** Correct `getEndX` and `getControlShift` polarity so right starts render right, left starts render left, and draw/fade bend in the expected directions.
- **Related Spec:** `VISUAL_SPEC.md` §1.2 / §1.3

### [ID: VIS-0101] Clinic step visuals duplicate shot-path grammar without shared primitive
- **Date:** 2026-03-16
- **Status:** `Open`
- **Component:** `ClinicWizard` + `PullHookWizard`
- **Path:** `src/components/clinic/ClinicWizard.tsx`, `src/components/clinic/PullHookWizard.tsx`
- **Bug Type:** Reusability / consistency risk
- **Severity:** `Major`
- **Explanation:** Both wizards hand-roll similar start-line/curve SVG logic. This increases drift risk (future direction fixes may land in one but not the other).
- **Proposed Fix:** Introduce a shared lightweight shot-path preview primitive and reuse in both wizard files.
- **Related Spec:** `VISUAL_SPEC.md` §3.2

---

## This Pass Summary
- **Bugs identified:** 4
- **Bugs fixed:** 3
- **Open bugs:** 1 (reusability refactor)
