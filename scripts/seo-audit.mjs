import { pathToFileURL } from "node:url";

const PRODUCTION = "https://dovegolf.fit";
const decode = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
  const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
  const point = entity[2].toLowerCase() === "x" ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10);
  return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
});

export function origin(value) {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Supply an HTTP(S) origin without a path, credentials, query, or fragment.");
  }
  return url.origin;
}

export function sitemapPaths(xml, allowedOrigins) {
  if (!/<urlset(?:\s|>)/i.test(xml)) throw new Error("Expected a URL sitemap, not an index or HTML response.");
  const urls = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map((match) => new URL(decode(match[1].trim())));
  if (!urls.length || urls.length > 500) throw new Error("Sitemap must contain between 1 and 500 URLs.");
  for (const url of urls) {
    if (!allowedOrigins.includes(url.origin) || url.username || url.password || url.search || url.hash) {
      throw new Error(`Unexpected sitemap URL: ${url.origin}${url.pathname}`);
    }
  }
  return [...new Set(urls.map((url) => url.pathname))];
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4])]));
}

export function inspectPage(html, expectedCanonical, headerRobots = "") {
  // Inspect server HTML only, excluding script strings that can contain fake tags.
  const clean = html.replace(/<!--[^]*?-->|<script\b[^>]*>[^]*?<\/script>/gi, "");
  const titles = [...clean.matchAll(/<title\b[^>]*>([^]*?)<\/title>/gi)].map((match) => decode(match[1]).trim());
  const tags = [...clean.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const descriptions = tags.filter((tag) => tag.name?.toLowerCase() === "description").map((tag) => tag.content?.trim() || "");
  const canonicals = tags.filter((tag) => tag.rel?.toLowerCase().split(/\s+/).includes("canonical")).map((tag) => tag.href || "");
  const robots = tags.filter((tag) => ["robots", "googlebot"].includes(tag.name?.toLowerCase())).map((tag) => tag.content || "").concat(headerRobots).join(", ");
  const issues = [];
  if (titles.length !== 1 || !titles[0]) issues.push("Expected one nonempty title");
  if (descriptions.length !== 1 || !descriptions[0]) issues.push("Expected one nonempty meta description");
  let canonicalMatches = false;
  try { canonicalMatches = canonicals.length === 1 && new URL(canonicals[0]).href === new URL(expectedCanonical).href; } catch { /* Missing or malformed canonical. */ }
  if (!canonicalMatches) issues.push(`Expected canonical ${expectedCanonical}`);
  if (/\b(noindex|none)\b/i.test(robots)) issues.push("Page has a noindex directive");
  return { title: titles[0] || "", description: descriptions[0] || "", canonical: canonicals[0] || "", robots, issues };
}

export function robotsBlocked(pathname, text) {
  const groups = [];
  let group;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*/, "").match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!match) continue;
    const [, field, value] = match;
    if (field.toLowerCase() === "user-agent") {
      if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && /^(allow|disallow)$/i.test(field) && value) group.rules.push({ allow: field.toLowerCase() === "allow", value });
  }
  const specific = groups.filter((item) => item.agents.includes("googlebot"));
  const selected = specific.length ? specific : groups.filter((item) => item.agents.includes("*"));
  const matches = selected.flatMap((item) => item.rules).filter(({ value }) => {
    const pattern = value.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*").replace(/\\\$$/, "$");
    return new RegExp(`^${pattern}`).test(pathname);
  }).sort((a, b) => b.value.replace(/\*/g, "").length - a.value.replace(/\*/g, "").length || Number(b.allow) - Number(a.allow));
  return matches.length > 0 && !matches[0].allow;
}

export async function safeFetch(url, allowedOrigin, fetcher = fetch) {
  let current = new URL(url);
  for (let redirects = 0; redirects <= 5; redirects++) {
    if (current.origin !== allowedOrigin || current.username || current.password) throw new Error("Refusing a request outside the chosen origin");
    const response = await fetcher(current, { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "DoveGolf-SEO-Audit/1.0" } });
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      current = new URL(response.headers.get("location"), current);
      continue;
    }
    return { response, redirects };
  }
  throw new Error("Too many redirects");
}

export async function audit({ baseUrl = PRODUCTION, canonicalOrigin = PRODUCTION, fetcher = fetch } = {}) {
  const base = origin(baseUrl);
  const canonicalBase = origin(canonicalOrigin);
  const read = (path) => safeFetch(new URL(path, base), base, fetcher);
  const sitemap = await read("/sitemap.xml");
  if (sitemap.response.status !== 200) throw new Error(`Sitemap returned HTTP ${sitemap.response.status}`);
  const paths = sitemapPaths(await sitemap.response.text(), [base, canonicalBase]);
  const robots = await read("/robots.txt");
  const siteIssues = robots.response.status === 200 ? [] : [`robots.txt returned HTTP ${robots.response.status}; crawl rules unverified`];
  const robotsText = robots.response.status === 200 ? await robots.response.text() : "";
  const pages = [];
  for (const path of paths) {
    try {
      const { response, redirects } = await read(path);
      const result = inspectPage(await response.text(), new URL(path, canonicalBase).href, response.headers.get("x-robots-tag") || "");
      if (response.status !== 200) result.issues.push(`HTTP ${response.status}`);
      if (redirects) result.issues.push("Sitemap URL redirects");
      if (robotsBlocked(path, robotsText)) result.issues.push("robots.txt blocks Googlebot");
      pages.push({ path, status: response.status, ...result });
    } catch (error) { pages.push({ path, issues: [error.message] }); }
  }
  for (const key of ["title", "description"]) {
    const seen = new Map();
    for (const page of pages) {
      if (!page[key]) continue;
      if (seen.has(page[key])) page.issues.push(`Duplicate ${key} shared with ${seen.get(page[key])}`);
      else seen.set(page[key], page.path);
    }
  }
  return { baseUrl: base, checkedAt: new Date().toISOString(), scope: "Sitemap routes: HTTP, server-rendered metadata, canonical URLs, robots directives. Does not measure rankings, traffic, indexing, or JavaScript rendering.", pageCount: pages.length, issueCount: siteIssues.length + pages.reduce((count, page) => count + page.issues.length, 0), siteIssues, pages };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    while (args.length) {
      const flag = args.shift();
      if (!["--base-url", "--canonical-origin"].includes(flag) || !args.length) throw new Error("Usage: node scripts/seo-audit.mjs [--base-url http://localhost:3113] [--canonical-origin https://dovegolf.fit]");
      options[flag === "--base-url" ? "baseUrl" : "canonicalOrigin"] = args.shift();
    }
    const report = await audit(options);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exitCode = report.issueCount ? 1 : 0;
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
