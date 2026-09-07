import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

const showcase = readFileSync(new URL("../components/home/ToolShowcase.tsx", import.meta.url), "utf8");

test("homepage preserves core public routes and metadata", () => {
  for (const route of [
    "/range-rescue",
    "/tools/ball-flight-decoder",
    "/diagnostic",
    "/learn",
    "/method",
    "/about",
    "/faq",
    "/play/putting",
    "/learn/ball-flight",
  ]) {
    assert.ok((source + showcase).includes(route), `expected homepage to include ${route}`);
  }

  assert.match(source, /Dove Golf \| Free Golf Tools for Better Range Sessions/);
  assert.match(source, /alternates: \{ canonical: "\/" \}/);
});

test("homepage sends consistent Dove Golf entity signals", () => {
  assert.match(source, /type="application\/ld\+json"/);
  assert.match(source, /"@type": "WebSite"/);
  assert.match(source, /"@type": "Organization"/);
  assert.match(source, /name: "Dove Golf"/);
  assert.match(source, /legalName: "Dove Golf, Inc\."/);
  assert.match(source, /alternateName: \["DoveGolf", "dovegolf\.fit"\]/);
  assert.doesNotMatch(source, /SearchAction/);
});
