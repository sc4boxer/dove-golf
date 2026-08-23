import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEquipmentFitHref,
  equipmentFitPrefill,
  formatEquipmentFitContext,
  formatEquipmentFitPattern,
  parseEquipmentFitContext,
} from "./ballFlightEquipmentBridge.ts";

test("builds a shareable decoder-to-fit handoff", () => {
  assert.equal(
    buildEquipmentFitHref({
      start: "left",
      curve: "right",
      strike: "heel",
      patternSlug: "pull-fade",
    }),
    "/diagnostic?source=ball-flight-decoder&start=left&curve=right&strike=heel&pattern=pull-fade"
  );
});

test("parses carried observations without choosing a club category", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&start=left&curve=right&strike=heel&pattern=pull-fade")
  );

  assert.ok(context);
  assert.equal(formatEquipmentFitPattern(context), "Pull Fade");
  assert.equal(formatEquipmentFitContext(context), "Start: Left · Curve: Right · Strike: Heel");
});

test("prefills only the explicitly selected club category", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&start=left&curve=right&strike=heel&pattern=pull-fade")
  );

  assert.ok(context);
  assert.deepEqual(equipmentFitPrefill(context, "driver_woods"), {
    driverStartLine: "left",
    driverCurve: "fade",
    driverStrike: "heel",
  });
  assert.deepEqual(equipmentFitPrefill(context, "irons"), {
    ironStartLine: "left",
    ironCurve: "fade",
    ironFaceStrike: "heel",
  });
  assert.deepEqual(equipmentFitPrefill(context, "wedges"), {});
  assert.deepEqual(equipmentFitPrefill(context, "full_bag"), {});
});

test("does not convert an unknown strike into an observed miss", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&start=straight&curve=straight&strike=unknown")
  );

  assert.ok(context);
  assert.deepEqual(equipmentFitPrefill(context, "driver_woods"), {
    driverStartLine: "center",
    driverCurve: "straight",
  });
  assert.deepEqual(equipmentFitPrefill(context, "irons"), {
    ironStartLine: "center",
    ironCurve: "straight",
  });
  assert.equal(context.pattern, "straight-straight");
});

test("rejects incomplete or unrelated handoffs", () => {
  assert.equal(parseEquipmentFitContext(new URLSearchParams("source=other&start=left&curve=right&strike=heel")), null);
  assert.equal(parseEquipmentFitContext(new URLSearchParams("source=ball-flight-decoder&start=left&curve=up&strike=heel")), null);
});
