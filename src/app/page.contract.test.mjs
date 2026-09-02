import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("homepage keeps the beginner-first Direction C hierarchy", () => {
  assert.match(source, /Your first bucket should feel like/);
  assert.match(source, /href="\/range-rescue"[\s\S]*Get my five-ball plan/);
  assert.match(source, /<TrajectoryComparison \/>/);

  const rangeRescue = source.indexOf(">Range Rescue<");
  const ballFlight = source.indexOf(">Ball Flight Decoder<");
  const equipment = source.indexOf(">Equipment Fit<");

  assert.ok(rangeRescue > -1);
  assert.ok(rangeRescue < ballFlight);
  assert.ok(ballFlight < equipment);
});

test("each homepage module has a consistent green action button", () => {
  for (const label of ["Help my next five", "Understand the pattern", "Check the setup"]) {
    const buttonPattern = new RegExp(`className="[^"]*bg-\\[#245f4d\\][^"]*"[\\s\\S]*?${label}`);
    assert.match(source, buttonPattern);
  }
});

test("homepage preserves core public routes and metadata", () => {
  for (const route of [
    "/range-rescue",
    "/tools/ball-flight-decoder",
    "/diagnostic",
    "/learn",
    "/method",
    "/about",
    "/faq",
  ]) {
    assert.ok(source.includes(route), `expected homepage to include ${route}`);
  }

  assert.match(source, /DoveGolf \| Read the shot\. Test the cause\./);
  assert.match(source, /alternates: \{ canonical: "\/" \}/);
});
