# App Visual Surface Map

This map catalogs user-facing golf visualization surfaces for audit coverage.

## How to Use
1. Locate each surface in code.
2. Validate behavior against `VISUAL_SPEC.md`.
3. Record defects in `VISUALIZATION_BUG_LOG.md`.
4. Track reusable component opportunities.

---

## A) Ball Flight + Shot Shape Surfaces

### A1. Ball Flight Path Simulator
- **Purpose:** Show full trajectory and shape outcome.
- **Audit Focus:**
  - Draw/fade/hook/slice direction correctness
  - Axis orientation consistency
  - Label-to-path agreement
- **Common Risk:** Reversed curvature logic.
- **Reusable Targets:** `ShotPathCanvas`, `ShotShapeLegend`

### A2. Draw / Fade / Hook / Slice Visualizations
- **Purpose:** Teach differences between shot shapes.
- **Audit Focus:**
  - Semantic correctness of each shape
  - Degree/intensity representation clarity
  - Handedness-aware interpretation consistency
- **Common Risk:** Label and rendered curve mismatch.
- **Reusable Targets:** `ShotPathCanvas`, `DirectionalArrow`

---

## B) Instructional and Clinic Surfaces

### B1. Clinic Visuals
- **Purpose:** Support coaching concepts with visual explanation.
- **Audit Focus:**
  - One-concept-per-diagram clarity
  - Annotation readability
  - Step/sequence comprehension
- **Common Risk:** Overloaded diagrams with ambiguous direction cues.
- **Reusable Targets:** `InstructionDiagramFrame`, `DirectionalArrow`

### B2. Golf Instructional Diagrams
- **Purpose:** Convey stance, swing path, clubface/path relationships, etc.
- **Audit Focus:**
  - Direction and reference line semantics
  - Label placement and hierarchy
  - Consistent iconography
- **Common Risk:** Inconsistent visual grammar across lessons.
- **Reusable Targets:** `InstructionDiagramFrame`, shared annotation tokens

---

## C) Product/Decision Surfaces

### C1. Fitting Tool Option Cards
- **Purpose:** Let users compare fitting-related visual options quickly.
- **Audit Focus:**
  - Visual hierarchy consistency
  - Card-to-card icon semantics
  - Preview graphic comparability
- **Common Risk:** Card-level inconsistency causing misread options.
- **Reusable Targets:** `FittingOptionVisualCard`

### C2. Directional Indicators
- **Purpose:** Show directional outcomes and adjustments.
- **Audit Focus:**
  - Arrow orientation consistency
  - Direction labels and cue clarity
  - Alignment with shot-shape semantics
- **Common Risk:** Mixed arrow grammar and orientation mismatch.
- **Reusable Targets:** `DirectionalArrow`

---

## D) Cross-Surface Audit Matrix

Use this matrix in each audit pass.

| Surface | Logic Correctness | Clarity | Visual Grammar | Accessibility | Reusable Component Opportunity |
|---|---|---|---|---|---|
| Ball Flight Path Simulator | ☐ | ☐ | ☐ | ☐ | ☐ |
| Draw/Fade/Hook/Slice Views | ☐ | ☐ | ☐ | ☐ | ☐ |
| Clinic Visuals | ☐ | ☐ | ☐ | ☐ | ☐ |
| Fitting Tool Option Cards | ☐ | ☐ | ☐ | ☐ | ☐ |
| Directional Indicators | ☐ | ☐ | ☐ | ☐ | ☐ |
| Instructional Diagrams | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## E) Audit Completion Criteria
Audit coverage is complete when:
- All mapped surfaces have at least one current audit status update.
- Any reversed draw/fade logic is either ruled out or logged as a defect.
- Clarity and grammar issues are documented with severity.
- Reusable component recommendations are documented per surface.
