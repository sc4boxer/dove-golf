# DoveClinic Module Canon

- **Route/file structure:** Each module uses `src/app/clinic/<slug>/page.tsx` (client page), optional `layout.tsx` metadata, a dedicated wizard component in `src/components/clinic/`, and a deterministic evaluator in `src/lib/clinic/problems/`. Landing integration comes from `src/lib/clinic/modules.ts` plus `ClinicHero` and `app/clinic/page.tsx`.
- **Steps/state flow:** Module page owns `inputs` and `result` state. Wizard receives `value`, `onChange`, `onComplete`, advances through a fixed step array, and only generates results when required fields are captured.
- **Interactive step visuals:** Wizard side panel renders a step-specific SVG that reacts to current choice (`selected`) so users can map their answer to an explicit ball/target/body cue.
- **Results computation/rendering:** Evaluators start from base bucket weights, add deterministic increments from answers, normalize split, rank primary/secondary levers, and return explanations + range plan. Page renders likelihood bars, textual why, and diagnosis blocks.
- **Range plan tests + visuals:** Tests are structured as `whatToDo`, `expectedIfCause`, `ifNoChange` with embedded `visualAid` lane/marker metadata. `RangePlan.tsx` maps test IDs to contextual SVG diagrams.
- **Landing appearance:** Active modules appear in hero carousel and common-problems cards from the shared registry (`CLINIC_MODULES`) with route, status, symptom-based card copy, and mini-diagram graphic key.
