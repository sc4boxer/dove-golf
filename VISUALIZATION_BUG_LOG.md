# Visualization Bug Log

This log tracks visualization-specific defects and improvement opportunities discovered by the visual agent.

## Usage
- Add entries after each audit pass.
- Keep newest entries at the top.
- Link findings to relevant surfaces in `APP_VISUAL_SURFACE_MAP.md`.
- Validate expected behavior against `VISUAL_SPEC.md`.

## Entry Template

### [ID: VIS-XXXX] <Short title>
- **Date:** YYYY-MM-DD
- **Status:** `Open` | `In Progress` | `Blocked` | `Resolved`
- **Surface:**
- **Location (file/module):**
- **Severity:** `Critical` | `High` | `Medium` | `Low`
- **Category:** `Logic` | `Clarity` | `Consistency` | `Accessibility` | `Performance` | `Maintainability`
- **Problem Summary:**
- **Current Behavior:**
- **Expected Behavior:**
- **User Impact:**
- **Evidence (screenshots/notes):**
- **Proposed Fix:**
- **Reusable Component Candidate:** `Yes` | `No`
- **Owner:**
- **Related Spec Section:**
- **Related Surface Map Section:**

---

## Seed Findings (Initial Audit Targets)

### [ID: VIS-0001] Verify draw/fade direction semantics
- **Date:** TBD
- **Status:** Open
- **Surface:** Ball flight path simulator + shot-shape visuals
- **Location (file/module):** TBD during audit
- **Severity:** Critical
- **Category:** Logic
- **Problem Summary:** Potential reversal of draw/fade logic.
- **Current Behavior:** Unknown until audited.
- **Expected Behavior:** Draw and fade labels must match actual rendered curvature and directional outcome conventions.
- **User Impact:** Incorrect instructional guidance and reduced trust.
- **Evidence (screenshots/notes):** Pending audit.
- **Proposed Fix:** Validate sign/axis mapping and handedness assumptions; centralize shot-shape mapping if duplicated.
- **Reusable Component Candidate:** Yes
- **Owner:** Visual Agent
- **Related Spec Section:** VISUAL_SPEC.md → Shot Shape Semantics
- **Related Surface Map Section:** APP_VISUAL_SURFACE_MAP.md → Flight + Shot Shape Surfaces

### [ID: VIS-0002] Audit diagram clarity for instructional visuals
- **Date:** TBD
- **Status:** Open
- **Surface:** Clinic visuals + instructional diagrams
- **Location (file/module):** TBD during audit
- **Severity:** High
- **Category:** Clarity
- **Problem Summary:** Some diagrams may be ambiguous without strong directional annotation.
- **Current Behavior:** Unknown until audited.
- **Expected Behavior:** Each diagram should communicate a single clear teaching point with readable labels and cues.
- **User Impact:** Misinterpretation of golf concepts.
- **Evidence (screenshots/notes):** Pending audit.
- **Proposed Fix:** Improve labeling hierarchy, add explicit start/end anchors, standardize arrow grammar.
- **Reusable Component Candidate:** Yes
- **Owner:** Visual Agent
- **Related Spec Section:** VISUAL_SPEC.md → Diagram Clarity Standards
- **Related Surface Map Section:** APP_VISUAL_SURFACE_MAP.md → Instructional Surfaces

### [ID: VIS-0003] Identify inconsistent visual grammar across cards and indicators
- **Date:** TBD
- **Status:** Open
- **Surface:** Fitting tool option cards + directional indicators
- **Location (file/module):** TBD during audit
- **Severity:** Medium
- **Category:** Consistency
- **Problem Summary:** Potential inconsistency in colors, icons, and directional cues.
- **Current Behavior:** Unknown until audited.
- **Expected Behavior:** Shared visual grammar across comparable UI patterns.
- **User Impact:** Slower comprehension and reduced confidence.
- **Evidence (screenshots/notes):** Pending audit.
- **Proposed Fix:** Consolidate tokens/components; apply consistent semantics.
- **Reusable Component Candidate:** Yes
- **Owner:** Visual Agent
- **Related Spec Section:** VISUAL_SPEC.md → Visual Grammar
- **Related Surface Map Section:** APP_VISUAL_SURFACE_MAP.md → Option Card + Indicator Surfaces
