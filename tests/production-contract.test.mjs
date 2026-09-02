import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const publicPages = new Map([
  ["/", "src/app/page.tsx"],
  ["/about", "src/app/about/page.tsx"],
  ["/ball-flight-library", "src/app/ball-flight-library/page.tsx"],
  ["/clinic", "src/app/clinic/page.tsx"],
  ["/clinic/ball-curves-right", "src/app/clinic/ball-curves-right/page.tsx"],
  ["/clinic/driver-slice", "src/app/clinic/driver-slice/page.tsx"],
  ["/clinic/pull-hook", "src/app/clinic/pull-hook/page.tsx"],
  ["/diagnostic", "src/app/diagnostic/page.tsx"],
  ["/faq", "src/app/faq/page.tsx"],
  ["/learn", "src/app/learn/page.tsx"],
  ["/learn/ball-flight", "src/app/learn/ball-flight/page.tsx"],
  ["/learn/ball-flight/[pattern]", "src/app/learn/ball-flight/[pattern]/page.tsx"],
  ["/learn/launch-spin-window", "src/app/learn/launch-spin-window/page.tsx"],
  ["/learn/shaft-weight-physics", "src/app/learn/shaft-weight-physics/page.tsx"],
  ["/learn/start-line-vs-curve", "src/app/learn/start-line-vs-curve/page.tsx"],
  ["/learn/tempo-vs-flex", "src/app/learn/tempo-vs-flex/page.tsx"],
  ["/method", "src/app/method/page.tsx"],
  ["/privacy", "src/app/privacy/page.tsx"],
  ["/tools/ball-flight-decoder", "src/app/tools/ball-flight-decoder/page.tsx"],
]);

const routeHandlers = new Map([
  ["POST /api/email-results", "src/app/api/email-results/route.ts"],
  ["GET /api/health", "src/app/api/health/route.ts"],
  ["POST /api/lead", "src/app/api/lead/route.ts"],
  ["GET /api/lead/context", "src/app/api/lead/context/route.ts"],
  ["GET /api/lead/verify", "src/app/api/lead/verify/route.ts"],
  ["POST /lead", "src/app/lead/route.ts"],
]);

const behaviorSensitiveFiles = [
  "src/app/diagnostic/EmailCaptureCard.tsx",
  "src/components/diagnosis/DiagnosisSharePanel.tsx",
  "src/lib/share/diagnosisShare.ts",
  "src/lib/share/diagnosisEmail.ts",
  "src/lib/analytics/ga.ts",
  "src/lib/engine/driver.ts",
  "src/lib/engine/driverShaftShortlist.ts",
  "src/lib/engine/irons.ts",
  "src/lib/engine/scoring.ts",
  "src/lib/clinic/ballFlightEngine.ts",
  "src/lib/clinic/causeMapping.ts",
  "src/lib/clinic/confidenceScoring.ts",
  "src/lib/clinic/problems/driverSlice.ts",
  "src/lib/clinic/problems/pullHook.ts",
  "src/lib/learn/ballFlightPatterns.ts",
  "src/lib/visual/ballFlightChartPaths.ts",
  "src/lib/visual/ballFlightSemantics.ts",
  "src/lib/visual/shotShapeModel.ts",
  "src/lib/visual/shotShapePaths.ts",
  "src/lib/visual/shotShapeSemantics.ts",
  "src/lib/visual/strikeFaceSemantics.ts",
  "src/lib/visual/strikeSemantics.ts",
];

const sitemapRoutes = [
  "/",
  "/diagnostic",
  "/clinic",
  "/clinic/driver-slice",
  "/clinic/ball-curves-right",
  "/clinic/pull-hook",
  "/tools/ball-flight-decoder",
  "/method",
  "/about",
  "/learn",
  "/faq",
  "/learn/ball-flight",
  "/learn/start-line-vs-curve",
  "/learn/tempo-vs-flex",
  "/learn/shaft-weight-physics",
  "/learn/launch-spin-window",
];

const requiredEnvironmentVariables = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
];

const analyticsEvents = [
  "dov_cta_clicked",
  "dov_fit_started",
  "dov_fit_step_viewed",
  "dov_fit_results_viewed",
  "dov_fit_completed",
  "dov_clinic_completed",
  "dov_clinic_recommendation_viewed",
  "dov_diagnosis_shared",
  "dov_diagnosis_card_downloaded",
];

function absolutePath(relativePath) {
  return resolve(projectRoot, relativePath);
}

async function source(relativePath) {
  return readFile(absolutePath(relativePath), "utf8");
}

test("all established public pages remain routable", async () => {
  await Promise.all(
    [...publicPages].map(async ([route, relativePath]) => {
      await assert.doesNotReject(
        access(absolutePath(relativePath)),
        `${route} must remain backed by ${relativePath}`,
      );
    }),
  );
});

test("range rescue provides a clear route back to the landing page", async () => {
  const rangeRescue = await source("src/app/range-rescue/page.tsx");

  assert.match(rangeRescue, /<Link\s+href="\/"/);
  assert.match(rangeRescue, /aria-label="Back to Dove Golf home"/);
  assert.match(rangeRescue, /Dove Golf home/);
});

test("the legacy ball-flight library permanently redirects to the canonical guide", async () => {
  const legacyLibrary = await source("src/app/ball-flight-library/page.tsx");

  assert.match(
    legacyLibrary,
    /permanentRedirect\(["']\/learn\/ball-flight["']\)/,
  );
});

test("behavior-sensitive route handlers and integrations remain present", async () => {
  for (const [contract, relativePath] of routeHandlers) {
    const [method] = contract.split(" ");
    const contents = await source(relativePath);
    assert.match(
      contents,
      new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`),
      `${contract} must continue exporting its ${method} handler`,
    );
  }

  await Promise.all(
    behaviorSensitiveFiles.map((relativePath) =>
      assert.doesNotReject(
        access(absolutePath(relativePath)),
        `${relativePath} is covered by the production behavior contract`,
      ),
    ),
  );
});

test("the apex domain stays canonical and www stays a permanent redirect", async () => {
  const [layout, nextConfig, robots, sitemap] = await Promise.all([
    source("src/app/layout.tsx"),
    source("next.config.ts"),
    source("src/app/robots.ts"),
    source("src/app/sitemap.ts"),
  ]);

  assert.match(layout, /metadataBase:\s*new URL\(["']https:\/\/dovegolf\.fit["']\)/);
  assert.match(layout, /alternates:\s*{[\s\S]*?canonical:\s*["']\/["']/);
  assert.match(nextConfig, /value:\s*["']www\.dovegolf\.fit["']/);
  assert.match(nextConfig, /destination:\s*["']https:\/\/dovegolf\.fit\/:path\*["']/);
  assert.match(nextConfig, /permanent:\s*true/);
  assert.match(robots, /sitemap:\s*["']https:\/\/dovegolf\.fit\/sitemap\.xml["']/);
  assert.match(robots, /host:\s*["']https:\/\/dovegolf\.fit["']/);
  assert.match(sitemap, /const\s+baseUrl\s*=\s*["']https:\/\/dovegolf\.fit["']/);
});

test("the sitemap covers established and revival routes", async () => {
  const sitemap = await source("src/app/sitemap.ts");

  for (const route of sitemapRoutes) {
    assert.ok(
      sitemap.includes(`"${route}"`) || sitemap.includes(`'${route}'`),
      `sitemap must include ${route}`,
    );
  }

  assert.match(
    sitemap,
    /PATTERN_ORDER\.map\(\(pattern\)\s*=>\s*`\/learn\/ball-flight\/\$\{pattern\}`\)/,
  );
});

test("established analytics event names remain available", async () => {
  const analyticsSource = (
    await Promise.all([
      source("src/components/analytics/TrackLink.tsx"),
      source("src/app/diagnostic/page.tsx"),
      source("src/app/clinic/driver-slice/page.tsx"),
      source("src/app/clinic/pull-hook/page.tsx"),
      source("src/components/diagnosis/DiagnosisSharePanel.tsx"),
    ])
  ).join("\n");

  for (const eventName of analyticsEvents) {
    assert.ok(analyticsSource.includes(eventName), `${eventName} must remain instrumented`);
  }
});

test("canonical flight visuals keep the slow dotted progression and reduced-motion fallback", async () => {
  const [chart, globals] = await Promise.all([
    source("src/components/visuals/BallFlightChart.tsx"),
    source("src/app/globals.css"),
  ]);

  assert.match(chart, /strokeDasharray="1 9"/);
  assert.match(chart, /<animateMotion[\s\S]*?dur="2\.8s"/);
  assert.match(chart, /motionRef\.current\?\.beginElement\(\)/);
  assert.match(chart, /<animateMotion[\s\S]*?begin="indefinite"/);
  assert.match(chart, /className="ball-flight-reveal"/);
  assert.match(globals, /@keyframes flight-reveal/);
  assert.match(globals, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ball-flight-marker[\s\S]*?display: none/);
});

test("completed diagnoses keep the distribution loop and keep direct email closed safely", async () => {
  const [component, emailRoute, decoder, equipment, driverSlice, pullHook, curvesRight] = await Promise.all([
    source("src/components/diagnosis/DiagnosisSharePanel.tsx"),
    source("src/app/api/email-results/route.ts"),
    source("src/components/tools/ball-flight-decoder/BallFlightDecoder.tsx"),
    source("src/app/diagnostic/page.tsx"),
    source("src/app/clinic/driver-slice/page.tsx"),
    source("src/app/clinic/pull-hook/page.tsx"),
    source("src/app/clinic/ball-curves-right/page.tsx"),
  ]);

  assert.ok(component.includes("Share my diagnosis"));
  assert.ok(component.includes("Send me my diagnosis and range plan"));
  assert.match(component, /Download result card/);
  assert.match(component, /files: \[shareFile\]/);
  assert.match(component, /navigator\.canShare\?\.\(fileShareData\) === true/);
  assert.match(component, /Share link instead/);
  assert.match(component, /1200 × 630 social card/);
  assert.match(component, /MY SHOT PROFILE/);
  assert.match(component, /getBallFlightChartPathGeometry/);
  assert.match(component, /analyticsContext/);
  assert.match(component, /analyticsContext\?:\s*{[\s\S]*?pattern\?: string;[\s\S]*?strike\?: string;[\s\S]*?category\?: string;/);
  assert.match(component, /insightLabel/);
  assert.match(emailRoute, /status:\s*503/);
  assert.match(emailRoute, /Cache-Control.*no-store/s);
  assert.match(emailRoute, /distributed IP \+ recipient abuse limiter/);
  assert.doesNotMatch(emailRoute, /new Resend\(/);
  assert.doesNotMatch(emailRoute, /RESEND_API_KEY/);

  for (const resultPage of [decoder, equipment, driverSlice, pullHook, curvesRight]) {
    assert.match(resultPage, /<DiagnosisSharePanel/);
    assert.match(resultPage, /details=/);
    assert.match(resultPage, /flightShape=/);
    assert.match(resultPage, /analyticsContext=/);
  }
});

test("runtime configuration names are documented without real credentials", async () => {
  const envExample = await source(".env.example");

  for (const name of requiredEnvironmentVariables) {
    assert.match(envExample, new RegExp(`^${name}=`, "m"), `${name} must be documented`);
  }

  assert.doesNotMatch(envExample, /G-XPWFEER0PV/);
});

test("the homepage share preview reflects the current Dove Golf product", async () => {
  const [layout, preview] = await Promise.all([
    source("src/app/layout.tsx"),
    source("src/components/social/SocialPreviewImage.tsx"),
  ]);

  assert.match(layout, /The ball left you a message\./);
  assert.doesNotMatch(layout, /Stop guessing\. Fit your gear to your swing\./);
  assert.match(layout, /Simple, visual golf tools for better range sessions/);
  assert.match(preview, /The ball left you/);
  assert.match(preview, /a message\./);
  await access(resolve(projectRoot, "src/app/opengraph-image.tsx"));
  await access(resolve(projectRoot, "src/app/twitter-image.tsx"));
});

test("optional analytics stay behind an explicit privacy choice", async () => {
  const [layout, consent, analytics] = await Promise.all([
    source("src/app/layout.tsx"),
    source("src/components/privacy/ConsentManager.tsx"),
    source("src/components/analytics/GoogleAnalytics.tsx"),
  ]);

  assert.match(layout, /<ConsentManager measurementId={GA_ID} \/>/);
  assert.doesNotMatch(layout, /<GoogleAnalytics/);
  assert.match(consent, /Essential only/);
  assert.match(consent, /Allow analytics/);
  assert.match(consent, /choice === "analytics" && <GoogleAnalytics/);
  assert.match(analytics, /ad_storage: 'denied'/);
  assert.match(analytics, /allow_google_signals: false/);
});

test("anonymous product feedback keeps identity out of its storage contract", async () => {
  const [feedbackRoute, migration, privacyPage] = await Promise.all([
    source("src/app/api/feedback/route.ts"),
    source("supabase/migrations/202609020001_create_product_feedback.sql"),
    source("src/app/privacy/page.tsx"),
  ]);

  for (const storedField of ["module", "plan_id", "helpful", "experience", "next_help", "comment"]) {
    assert.ok(migration.includes(storedField), `${storedField} must remain in the feedback contract`);
  }
  assert.doesNotMatch(migration, /\b(email|name|ip_address|user_agent|visitor_id)\s+text\b/i);
  assert.match(feedbackRoute, /validateProductFeedback/);
  assert.match(feedbackRoute, /Cache-Control.*no-store/s);
  assert.match(privacyPage, /Participation in analytics and product feedback is optional/);
});
