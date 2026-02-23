# GA4 Measurement Plan (Dove Golf)

## Tracking helper
Use `track(eventName, params)` from `src/lib/analytics/ga.ts`.

- Safe no-op when `window.gtag` is unavailable.
- Client-side only usage.
- Dev mode logs events to console for validation.

## Event naming conventions
- Prefix by module: `dov_fit_*`, `dov_clinic_*`, `dov_*` shared CTA events.
- Use past-tense action names (`*_viewed`, `*_started`, `*_completed`).
- Keep names stable and lowercase with underscores.

## Standard event params
Use these params when relevant:

- `module`: `dovefit`, `doveclinic`, `learn`, `dovelab`
- `placement`: where the interaction happened (e.g. `home_module_card`)
- `step`: funnel step identifier
- `index`: zero-based step index
- `version`: analytics schema version (current `v1`)

> Never send PII (no names, emails, or free-text fields).

## Implemented events

### DoveFit
- `dov_fit_started`
- `dov_fit_step_viewed` (once per unique step)
- `dov_fit_results_viewed` (once per wizard view)
- `dov_fit_completed` (once when results are reached)

### DoveClinic
- `dov_clinic_started`
- `dov_clinic_step_viewed` (once per unique step)
- `dov_clinic_completed` (once when results are generated)
- `dov_clinic_recommendation_viewed` (once per generated result view)

### Learn / Lab / cross-module CTAs
- `dov_cta_clicked`
  - Used when users click into tools or learn content from landing and learn surfaces.

## Examples

```ts
track("dov_fit_step_viewed", {
  module: "dovefit",
  placement: "diagnostic_wizard",
  step: "driver_curve",
  index: 7,
  version: "v1",
});

track("dov_cta_clicked", {
  module: "learn",
  placement: "home_feature_card",
  version: "v1",
});
```

## Verification in GA4
1. Open GA4 **Realtime** and **DebugView** for property `G-XPWFEER0PV`.
2. Run the app locally and keep browser devtools open.
3. Execute each funnel:
   - DoveFit: start, navigate steps, reach results.
   - DoveClinic: answer first step, progress through wizard, generate results.
   - Landing/Learn CTAs: click into diagnostic/clinic/learn cards.
4. Confirm events appear with expected params (`module`, `placement`, `step`, `index`, `version`).
5. Confirm no duplicate step events during re-render (events should only fire on first unique step view).
6. Confirm no PII fields are present in event payloads.
