import test from "node:test";
import assert from "node:assert/strict";
import { audit, inspectPage, origin, robotsBlocked, safeFetch, sitemapPaths } from "./seo-audit.mjs";

const html = (path = "/") => `<html><head><title>Golf &amp; practice</title><meta content='A useful guide' name='description'><link href="https://dovegolf.fit${path}" rel="canonical"></head><body>Guide</body></html>`;

test("metadata inspection handles attribute order and ignores script/comment lookalikes", () => {
  const result = inspectPage(`${html()}<!-- <title>Fake</title> --><script>"<meta name='robots' content='noindex'>"</script>`, "https://dovegolf.fit/");
  assert.deepEqual(result.issues, []);
  assert.equal(result.title, "Golf & practice");
  assert.deepEqual(inspectPage(html().replace('https://dovegolf.fit/"', 'https://dovegolf.fit"'), "https://dovegolf.fit/").issues, []);
});

test("missing metadata, duplicate titles, wrong canonical and noindex are actionable failures", () => {
  assert.equal(inspectPage("", "https://dovegolf.fit/").issues.length, 3);
  const result = inspectPage(`${html()}<title>Duplicate</title>`, "https://dovegolf.fit/wrong", "googlebot: noindex");
  assert.equal(result.issues.length, 3);
});

test("sitemap accepts only intended origins and rejects indexes and query URLs", () => {
  assert.deepEqual(sitemapPaths("<urlset><url><loc>https://dovegolf.fit/learn</loc></url></urlset>", ["https://dovegolf.fit"]), ["/learn"]);
  for (const url of ["https://evil.test/", "https://dovegolf.fit/?action=delete", "https://user:pass@dovegolf.fit/"]) {
    assert.throws(() => sitemapPaths(`<urlset><url><loc>${url}</loc></url></urlset>`, ["https://dovegolf.fit"]));
  }
  assert.throws(() => sitemapPaths("<sitemapindex></sitemapindex>", ["https://dovegolf.fit"]));
  assert.throws(() => origin("https://dovegolf.fit/private"));
});

test("fetch refuses cross-origin redirects before making a second request", async () => {
  let calls = 0;
  const fetcher = async () => { calls++; return new Response(null, { status: 302, headers: { location: "https://evil.test/" } }); };
  await assert.rejects(safeFetch("https://dovegolf.fit/", "https://dovegolf.fit", fetcher), /outside/);
  assert.equal(calls, 1);
});

test("Googlebot rules override wildcard groups, longest allow wins, wildcards and anchors work", () => {
  const text = "User-agent: *\nDisallow: /\nUser-agent: Googlebot\nDisallow: /private\nAllow: /private/public\nDisallow: /*.pdf$";
  assert.equal(robotsBlocked("/learn", text), false);
  assert.equal(robotsBlocked("/private/secret", text), true);
  assert.equal(robotsBlocked("/private/public/guide", text), false);
  assert.equal(robotsBlocked("/guide.pdf", text), true);
  assert.equal(robotsBlocked("/guide.pdf/page", text), false);
});

test("local audit maps production sitemap to local requests and catches duplicate descriptions", async () => {
  const requested = [];
  const fetcher = async (url) => {
    requested.push(url.href);
    if (url.pathname === "/sitemap.xml") return new Response("<urlset><url><loc>https://dovegolf.fit/</loc></url><url><loc>https://dovegolf.fit/learn</loc></url></urlset>");
    if (url.pathname === "/robots.txt") return new Response("User-agent: *\nAllow: /");
    return new Response(html(url.pathname));
  };
  const report = await audit({ baseUrl: "http://localhost:3113", fetcher });
  assert.equal(report.pageCount, 2);
  assert.equal(report.issueCount, 2);
  assert.ok(report.pages[1].issues.some((issue) => issue.startsWith("Duplicate description")));
  assert.ok(requested.every((url) => url.startsWith("http://localhost:3113/")));
});
