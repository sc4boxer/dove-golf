import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDiagnosisEmailContent,
  parseDiagnosisEmailInput,
} from "./diagnosisEmail.ts";

test("accepts every canonical decoder observation and derives server-owned copy", () => {
  for (const start of ["left", "straight", "right"]) {
    for (const curve of ["left", "straight", "right"]) {
      for (const strike of ["heel", "center", "toe", "unknown"]) {
        const input = { kind: "ball_flight_decoder", start, curve, strike };
        assert.deepEqual(parseDiagnosisEmailInput(input), input);
        const content = buildDiagnosisEmailContent(input);
        assert.ok(content.miss);
        assert.ok(content.insight);
        assert.ok(content.rangePlan);
        assert.equal(content.insightLabel, "Impact interpretation");
        assert.equal(content.shareUrl, "https://dovegolf.fit/tools/ball-flight-decoder");
      }
    }
  }
});

test("rejects unknown keys, freeform prose, and invalid canonical values", () => {
  assert.equal(
    parseDiagnosisEmailInput({
      kind: "ball_flight_decoder",
      start: "left",
      curve: "right",
      strike: "center",
      customMessage: "arbitrary email content",
    }),
    null,
  );
  assert.equal(
    parseDiagnosisEmailInput({
      kind: "ball_flight_decoder",
      start: "backward",
      curve: "right",
      strike: "center",
    }),
    null,
  );
  assert.equal(
    parseDiagnosisEmailInput({
      kind: "equipment_fit",
      focus: "driver_woods",
      diagnosis: "<h1>Injected</h1>",
    }),
    null,
  );
  assert.equal(parseDiagnosisEmailInput(["ball_flight_decoder"]), null);
  assert.equal(parseDiagnosisEmailInput(null), null);
});

test("derives equipment email copy from a closed observation schema", () => {
  const input = {
    kind: "equipment_fit",
    focus: "full_bag",
    driverStart: "right",
    driverCurve: "fade",
    driverStrike: "heel",
    ironStart: "center",
    ironCurve: "draw",
    ironStrike: "center",
    ironLowPoint: "ball_first",
    wedgeMiss: "thin",
    wedgeTurf: "sweeper",
  };

  assert.deepEqual(parseDiagnosisEmailInput(input), input);
  const content = buildDiagnosisEmailContent(input);
  assert.match(content.miss, /Driver\/Woods/);
  assert.match(content.miss, /Irons/);
  assert.match(content.miss, /Wedges/);
  assert.equal(content.insightLabel, "Fit rationale");
  assert.match(content.insight, /do not prove the club caused it/);
  assert.equal(content.shareUrl, "https://dovegolf.fit/diagnostic");
});

test("clinic email copy stays observation-based when the named miss is absent", () => {
  const sliceContent = buildDiagnosisEmailContent({
    kind: "driver_slice",
    startLine: "center",
    curveSeverity: "none",
    strikeLocation: "center",
    primaryLever: "faceControl",
  });
  assert.doesNotMatch(sliceContent.miss, /slice/i);
  assert.match(sliceContent.miss, /no meaningful right curve/i);

  const hookContent = buildDiagnosisEmailContent({
    kind: "pull_hook",
    startLine: "right",
    curveSeverity: "none",
    strikeLocation: "center",
    primaryLever: "pathDirection",
  });
  assert.doesNotMatch(hookContent.miss, /hook/i);
  assert.match(hookContent.miss, /no meaningful left curve/i);
  assert.match(hookContent.rangePlan, /supports the hypothesis but does not prove it/i);
});

test("right-curve variants use qualified impact geometry", () => {
  const content = buildDiagnosisEmailContent({
    kind: "ball_curves_right",
    variantId: "curves-right-center",
  });

  assert.match(content.insight, /path left of the face/);
  assert.match(content.insight, /relative to the target is unmeasured/);
  assert.equal(content.shareUrl, "https://dovegolf.fit/clinic/ball-curves-right");
});
