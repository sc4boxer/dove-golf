# App Visual Surface Map

This map catalogs the actual user-facing golf visualization surfaces found in the codebase and the current audit state.

## A) Ball Flight + Shot Shape Surfaces

| Surface | Component | File | Purpose | Likely Risk Areas | Expected Visual Rules | Reusable Opportunity |
|---|---|---|---|---|---|---|
| Learn flight pattern canvas | `BallFlightLibraryViz` | `src/components/learn/BallFlightLibraryViz.tsx` | Core start-line + curvature visualization in the learn explorer | Left/right sign inversion, label/path mismatch | Draw starts right and curves left; Fade starts left and curves right; flight runs bottom→top | Shared shot-path primitive with clinic mini charts |
| Learn explorer wrapper | `BallFlightLibraryExplorer` | `src/components/learn/BallFlightLibraryExplorer.tsx` | Hosts pattern selector + visual output | Selection labels diverging from rendered geometry | Selected card copy and rendered path must agree | Shared legend component |

## B) Clinic Surfaces

| Surface | Component | File | Purpose | Likely Risk Areas | Expected Visual Rules | Reusable Opportunity |
|---|---|---|---|---|---|---|
| Clinic module hero mini chart (slice) | `DriverSliceMiniChart` | `src/components/clinic/ClinicHeroMiniCharts.tsx` | Quick directional concept preview | Wrong start side for slice, curvature semantics | Slice starts left and curves right | Shared shot-path primitive |
| Clinic module hero mini chart (hook) | `PullHookMiniChart` | `src/components/clinic/ClinicHeroMiniCharts.tsx` | Quick directional concept preview | Wrong start side for hook | Hook starts right and curves strongly left | Shared shot-path primitive |
| Driver slice wizard previews | `ClinicWizard` (`StepPreview`) | `src/components/clinic/ClinicWizard.tsx` | Step-by-step diagnosis visuals | Arrowlessness, mixed semantics between steps | Start-line, curve, strike diagrams remain directionally aligned and readable | Shared step frame / directional arrow |
| Pull-hook wizard previews | `PullHookWizard` (`StepPreview`) | `src/components/clinic/PullHookWizard.tsx` | Pull-hook specific diagnosis visuals | Semantics drift from slice wizard grammar | Hook conventions and labels must stay consistent | Shared step frame / directional arrow |
| Pull-hook setup map | `PullHookSetupVisual` | `src/components/clinic/PullHookSetupVisual.tsx` | Top-down setup bias visual | Label density, ambiguous line hierarchy | Aim/start/stance lines remain visually distinct and directional | Shared annotation tokens |
| Gate drill visual | `RangeTest3GateVisual` | `src/components/clinic/RangeTest3GateVisual.tsx` | Start-line gate success vs miss reference | Arrow style inconsistency with other surfaces | Solid=primary, dashed=reference, direction explicit | Shared directional arrow marker |
| A/B lever comparison visual | `RangeTest2ABVisual` | `src/components/clinic/RangeTest2ABVisual.tsx` | Compare current vs neutralized delivery | Side-by-side semantics not mirrored clearly | A/B paths should be comparable and direction-consistent | Shared panel scaffold |
| Range plan visuals | `RangePlan` + `RangeMapPrimitives` | `src/components/clinic/RangePlan.tsx`, `src/components/clinic/visuals/RangeMapPrimitives.tsx` | Reusable drill diagrams for strike/flight tasks | Marker/arrow inconsistencies, repeated stroke semantics | Bottom→top flight, consistent dashed reference behavior | Already partially reusable via `RangeMapPrimitives` |

## C) Landing + Diagnostic Surfaces

| Surface | Component | File | Purpose | Likely Risk Areas | Expected Visual Rules | Reusable Opportunity |
|---|---|---|---|---|---|---|
| Home hero animation | `Home` SVG sequence | `src/app/page.tsx` | Marketing-level motion trajectory scene | Animation direction mismatch vs labels | Motion must reinforce directional semantics | Shared animation timing tokens |
| Diagnostic report charts | Multiple embedded SVG components | `src/app/diagnostic/page.tsx` | Result visualization for recommendation output | Chart-specific axis sign errors | Legends/axes/trajectories must agree | Shared chart primitives |
| Learn article visuals | Inline SVGs in learn pages | `src/app/learn/*/page.tsx` | Educational illustrations (launch, tempo, start-line) | Inconsistent visual grammar | Solid vs dashed semantics match spec | Shared instructional frame |

## Audit Status (this pass)

- **Surfaces found:** 13 major visualization surfaces/components.
- **Audited in depth this pass:** `BallFlightLibraryViz`, `ClinicHeroMiniCharts`, `ClinicWizard`, `PullHookWizard`, `RangeTest2ABVisual`, `RangeTest3GateVisual`, `PullHookSetupVisual`, `RangeMapPrimitives`.
- **Highest-risk mismatches fixed:** learn flight direction mapping + clinic hero hook/slice semantics.
- **Remaining high-risk next targets:** large inline SVGs in `src/app/diagnostic/page.tsx` and animated hero sequence in `src/app/page.tsx`.
