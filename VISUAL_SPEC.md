# Dove Golf Visual Specification

This specification defines expected behavior for visualization surfaces so the visual agent can audit and improve them consistently.

## 1) Shot Shape Semantics (Critical)

### 1.1 Canonical Terms
- **Draw**: Controlled shot shape bending toward the player's dominant side target line outcome convention used in-app.
- **Fade**: Controlled shot shape bending opposite the draw convention used in-app.
- **Hook**: Over-rotated draw-like curvature beyond intended amount.
- **Slice**: Over-rotated fade-like curvature beyond intended amount.

> Implementation note: if handedness is supported, semantics must be explicit and consistently mapped in both copy and rendering logic.

### 1.2 Non-Negotiable Rules
- Labels and rendered path curvature must agree.
- Legend semantics must match canvas semantics.
- Axis orientation and sign conventions must be documented in code comments where curvature is computed.
- Reversed draw/fade behavior is a **Critical** defect.

### 1.3 Required Audit Checks
- Compare textual label vs rendered curve direction.
- Compare mini-preview cards vs full simulator behavior.
- Compare right-handed and left-handed modes (if available).

## 2) Diagram Clarity Standards
- Every instructional diagram must communicate one primary concept.
- Include directional anchors where movement/flight is shown:
  - Start point
  - End point
  - Arrow direction
- Keep labels close to targets; avoid detached legend-only interpretation.
- Avoid overcrowding: if >3 concurrent concepts are shown, split into steps/states.

## 3) Visual Grammar

### 3.1 Color Semantics
- Use consistent meaning for each semantic color across all golf visuals.
- Do not use color as the only encoding mechanism; pair with shape/label.
- Keep warning/error semantics distinct from instructional/accent semantics.

### 3.2 Line and Arrow Semantics
- Solid line: actual/selected path.
- Dashed line: projected/alternative/reference path.
- Arrowheads: indicate directionality only; style should be uniform across modules.
- Stroke weight hierarchy should indicate importance without clutter.

### 3.3 Icon and Card Consistency
- Fitting option cards must use consistent icon placement and label hierarchy.
- Direction indicators should use standardized arrow geometry and orientation conventions.

## 4) Reusable Component Strategy
The visual agent should prefer extracting shared primitives where duplication appears.

### 4.1 Candidate Shared Components
- `ShotPathCanvas` (normalized coordinate and path rendering)
- `ShotShapeLegend` (draw/fade/hook/slice mapping)
- `DirectionalArrow` (single directional grammar)
- `InstructionDiagramFrame` (title, annotation, legend slots)
- `FittingOptionVisualCard` (consistent card layout + icon/metric slots)

### 4.2 Extraction Triggers
Extract when one or more are true:
- Same visual primitive repeated in 2+ surfaces.
- Inconsistent semantics observed across implementations.
- Bug fix would otherwise need parallel changes in multiple modules.

## 5) Accessibility Requirements
- Minimum contrast for critical labels and key paths.
- Dual encoding for state/direction (not color-only).
- Reduced-motion friendly behavior for animated trajectories.
- Diagrams remain interpretable under common color-vision deficiencies.

## 6) Audit-First Execution Protocol
Before any code changes:
1. Enumerate impacted surfaces from `APP_VISUAL_SURFACE_MAP.md`.
2. Capture findings in `VISUALIZATION_BUG_LOG.md`.
3. Assign severity/category for each finding.
4. Propose fix + reusability decision.

## 7) Acceptance Checklist (Per Visual Change)
- [ ] No reversed draw/fade logic.
- [ ] Diagram is clear without external explanation.
- [ ] Visual grammar aligns with this spec.
- [ ] Accessibility rules met.
- [ ] Reusable component considered and documented.
