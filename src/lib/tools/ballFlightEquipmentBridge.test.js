import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEquipmentFitHref,
  equipmentFitPrefill,
  formatEquipmentFitContext,
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

test("parses and maps carried observations without choosing a club category", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&start=left&curve=right&strike=heel&pattern=pull-fade")
  );

  assert.ok(context);
  assert.deepEqual(equipmentFitPrefill(context), {
    driverStartLine: "left",
    driverCurve: "fade",
    driverStrike: "heel",
    ironStartLine: "left",
    ironCurve: "fade",
    ironFaceStrike: "heel",
  });
  assert.equal(formatEquipmentFitContext(context), "Starts left · curves right · heel strike");
});

test("maps uncertain strike conservatively", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&start=straight&curve=straight&strike=unknown")
  );

  assert.ok(context);
  assert.deepEqual(equipmentFitPrefill(context), {
    driverStartLine: "center",
    driverCurve: "straight",
    driverStrike: "all_over",
    ironStartLine: "center",
    ironCurve: "straight",
    ironFaceStrike: "unsure",
  });
  assert.equal(context.pattern, "straight-straight");
});

test("rejects incomplete or unrelated handoffs", () => {
  assert.equal(parseEquipmentFitContext(new URLSearchParams("source=other&start=left&curve=right&strike=heel")), null);
  assert.equal(parseEquipmentFitContext(new URLSearchParams("source=ball-flight-decoder&start=left&curve=up&strike=heel")), null);
});
