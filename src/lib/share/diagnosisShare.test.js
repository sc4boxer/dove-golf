import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDiagnosisShareText,
  normalizeDiagnosisShareData,
  normalizeDoveGolfUrl,
} from "./diagnosisShare.ts";

test("normalizes every field used by the card, share text, and email", () => {
  assert.deepEqual(
    normalizeDiagnosisShareData({
      miss: "  Pull   fade\n",
      likelyCause: " Face open\tto path. ",
      rangePlan: " Hit 5 balls. ",
      shareUrl: "https://www.dovegolf.fit/tools/ball-flight-decoder#result",
    }),
    {
      miss: "Pull fade",
      likelyCause: "Face open to path.",
      rangePlan: "Hit 5 balls.",
      shareUrl: "https://dovegolf.fit/tools/ball-flight-decoder",
    },
  );
});

test("rejects non-DoveGolf share destinations", () => {
  assert.equal(normalizeDoveGolfUrl("https://example.com/phishing"), "https://dovegolf.fit");
  assert.equal(normalizeDoveGolfUrl("javascript:alert(1)"), "https://dovegolf.fit");
  assert.equal(normalizeDoveGolfUrl("not a URL"), "https://dovegolf.fit");
});

test("builds a concise share message with the diagnosis and canonical link", () => {
  const message = buildDiagnosisShareText({
    miss: "Straight fade",
    likelyCause: "The face was open relative to the club path.",
    rangePlan: "Hit ten shots.",
    shareUrl: "https://dovegolf.fit/tools/ball-flight-decoder",
  });

  assert.match(message, /^My DoveGolf diagnosis/);
  assert.match(message, /Miss: Straight fade/);
  assert.match(message, /Likely cause: The face was open relative to the club path\./);
  assert.match(message, /https:\/\/dovegolf\.fit\/tools\/ball-flight-decoder$/);
});

test("clamps untrusted text before it reaches an email or image", () => {
  const value = normalizeDiagnosisShareData({
    miss: "x".repeat(1_000),
    likelyCause: "",
    rangePlan: "",
    shareUrl: "https://dovegolf.fit",
  });

  assert.equal(value.miss.length, 320);
  assert.ok(value.likelyCause.length > 0);
  assert.ok(value.rangePlan.length > 0);
});
