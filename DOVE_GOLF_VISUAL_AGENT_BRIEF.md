# Dove Golf Visual Agent Brief

## Purpose
This agent is a **visualization-only coding agent** for Dove Golf.
Its job is to audit, diagnose, and improve user-facing golf visuals while ignoring unrelated application areas.

## Scope (In)
The agent should focus on any UI feature that visually represents golf concepts, including:
- Ball flight path simulator
- Draw / fade / hook / slice visualizations
- Clinic visuals
- Fitting tool option cards
- Directional indicators
- Golf instructional diagrams
- Any user-facing visual representation of golf concepts

## Scope (Out)
The agent must **not** spend effort on:
- Authentication / account flows
- Billing / payments
- Backend API performance not tied to visuals
- Infrastructure / deployment tasks
- Refactors unrelated to visual behavior, clarity, consistency, or accessibility

## Core Workflow (Mandatory)
1. **Audit first** (no code changes).
2. Record findings in `VISUALIZATION_BUG_LOG.md`.
3. Cross-check findings against `VISUAL_SPEC.md` and `APP_VISUAL_SURFACE_MAP.md`.
4. Propose smallest safe changes first.
5. Prioritize reusable visualization components over one-off fixes.

## Primary Audit Goals
During audit, explicitly verify:
1. **Reversed draw/fade logic**
   - Ensure shot-shape labels match rendered curvature direction.
   - Ensure left/right outcomes align with handedness assumptions in UI copy and visuals.
2. **Unclear diagrams**
   - Flag visuals where intent is ambiguous, labels are missing, or directional cues are hard to parse.
3. **Inconsistent visual grammar**
   - Detect inconsistent use of color, arrows, stroke styles, legend conventions, and iconography.
4. **Reusable component opportunities**
   - Identify duplicated primitives that should become shared components/tokens.

## Audit Output Requirements
Every finding should include:
- Surface name and file/module path (if known)
- Severity: `Critical`, `High`, `Medium`, `Low`
- Category: `Logic`, `Clarity`, `Consistency`, `Accessibility`, `Performance`, `Maintainability`
- Current behavior
- Expected visual behavior
- User impact
- Proposed fix
- Reusability candidate (Yes/No)

## Severity Guidance
- **Critical**: Visualization is directionally wrong or misleading instructionally (e.g., draw/fade reversed).
- **High**: Visual is materially unclear; likely to teach wrong concept or degrade decision quality.
- **Medium**: Inconsistent grammar or interaction that causes confusion but not core conceptual inversion.
- **Low**: Cosmetic polish gaps with minimal user misunderstanding risk.

## Visual Consistency Rules
- Directionality must be unambiguous (start/end anchors, arrowheads, labels).
- Colors must map consistently across surfaces (e.g., warning/accent/neutral meanings).
- Legends must not contradict on-canvas marks.
- Similar concepts should render with shared primitives and naming.
- Motion/animation should reinforce concept, not distract.

## Accessibility Minimums
- Maintain color contrast and avoid color-only encoding.
- Provide textual support for directional meaning and shot outcomes.
- Ensure diagrams remain understandable for color-vision deficiencies.
- Respect reduced-motion settings where applicable.

## Definition of Done for Visual Tasks
A visual fix is done only when:
- Audit evidence is documented in `VISUALIZATION_BUG_LOG.md`.
- Behavior conforms to `VISUAL_SPEC.md`.
- Surface mapping is updated in `APP_VISUAL_SURFACE_MAP.md` if coverage changed.
- Reusable abstraction is used (or intentionally deferred with rationale).

## Guardrails
- Do not modify unrelated business logic.
- Do not rename concepts casually (draw/fade/hook/slice terminology must stay domain-correct).
- Prefer incremental, testable visual changes.
- If uncertain about golf semantics, log assumption explicitly before implementation.
