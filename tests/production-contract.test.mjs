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
  "dov_diagnosis_email_sent",
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
  assert.match(chart, /<animateMotion dur="2\.8s"/);
  assert.match(chart, /className="ball-flight-reveal"/);
  assert.match(globals, /@keyframes flight-reveal/);
  assert.match(globals, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ball-flight-marker[\s\S]*?display: none/);
});

test("completed diagnoses keep the distribution loop and safe email handoff", async () => {
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
  assert.match(component, /MY SHOT PROFILE/);
  assert.match(component, /getBallFlightChartPathGeometry/);
  assert.match(component, /insightLabel/);
  assert.match(emailRoute, /new Resend\(/);
  assert.match(emailRoute, /Cache-Control.*no-store/s);
  assert.match(emailRoute, /parseDiagnosisEmailInput/);
  assert.match(emailRoute, /buildDiagnosisEmailContent/);
  assert.doesNotMatch(emailRoute, /console\.log\([^)]*body/);
  assert.doesNotMatch(emailRoute, /body\.diagnosis\.(miss|likelyCause|rangePlan|shareUrl)/);

  for (const resultPage of [decoder, equipment, driverSlice, pullHook, curvesRight]) {
    assert.match(resultPage, /<DiagnosisSharePanel/);
    assert.match(resultPage, /details=/);
    assert.match(resultPage, /flightShape=/);
  }
});

test("runtime configuration names are documented without real credentials", async () => {
  const envExample = await source(".env.example");

  for (const name of requiredEnvironmentVariables) {
    assert.match(envExample, new RegExp(`^${name}=`, "m"), `${name} must be documented`);
  }

  assert.doesNotMatch(envExample, /G-XPWFEER0PV/);
});
