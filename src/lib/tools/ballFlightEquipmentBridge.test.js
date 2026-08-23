import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEquipmentFitHref,
  equipmentFitPrefill,
  formatEquipmentFitContext,
  formatEquipmentFitPattern,
  parseEquipmentFitContext,
} from "./ballFlightEquipmentBridge.ts";

const decoderStarts = ["left", "straight", "right"];
const decoderCurves = ["left", "straight", "right"];
const decoderStrikes = ["heel", "center", "toe", "unknown"];

test("round-trips all 36 decoder observations through the versioned contract", () => {
  for (const start of decoderStarts) {
    for (const curve of decoderCurves) {
      for (const strike of decoderStrikes) {
        const href = buildEquipmentFitHref({ start, curve, strike });
        const context = parseEquipmentFitContext(new URL(href, "https://dovegolf.fit").searchParams);
        assert.ok(context);
        assert.equal(context.version, "1");
      }
    }
  }
});

test("maps the audited straight-draw example", () => {
  const href = buildEquipmentFitHref({ start: "straight", curve: "left", strike: "center" });
  const context = parseEquipmentFitContext(new URL(href, "https://dovegolf.fit").searchParams);

  assert.ok(context);
  assert.equal(context.pattern, "straight-draw");
  assert.equal(formatEquipmentFitPattern(context), "Straight Draw");
  assert.equal(formatEquipmentFitContext(context), "Start: On target · Curve: Left (draw) · Strike: Center");
});

test("prefills the explicitly selected club category and both full-bag profiles", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&v=1&start=left&curve=fade&strike=heel")
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
  assert.deepEqual(equipmentFitPrefill(context, "full_bag"), {
    driverStartLine: "left",
    driverCurve: "fade",
    driverStrike: "heel",
    ironStartLine: "left",
    ironCurve: "fade",
    ironFaceStrike: "heel",
  });
});

test("does not convert an unsure strike into all-over contact", () => {
  const context = parseEquipmentFitContext(
    new URLSearchParams("source=ball-flight-decoder&v=1&start=center&curve=straight&strike=unsure")
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
  assert.deepEqual(equipmentFitPrefill(context, "full_bag"), {
    driverStartLine: "center",
    driverCurve: "straight",
    ironStartLine: "center",
    ironCurve: "straight",
  });
});

test("rejects missing, invalid, unversioned, and duplicated parameters", () => {
  const invalid = [
    "source=other&v=1&start=left&curve=fade&strike=heel",
    "source=ball-flight-decoder&start=left&curve=fade&strike=heel",
    "source=ball-flight-decoder&v=2&start=left&curve=fade&strike=heel",
    "source=ball-flight-decoder&v=1&start=up&curve=fade&strike=heel",
    "source=ball-flight-decoder&v=1&start=left&curve=hook&strike=heel",
    "source=ball-flight-decoder&v=1&start=left&curve=fade&strike=all_over",
    "source=ball-flight-decoder&v=1&start=left&start=right&curve=fade&strike=heel",
  ];

  for (const query of invalid) {
    assert.equal(parseEquipmentFitContext(new URLSearchParams(query)), null);
  }
});
