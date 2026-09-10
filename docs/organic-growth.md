# Dove Golf organic growth

## Objective and baseline

Bring relevant golfers to useful practice tools and measure whether they use them. Search rankings or traffic increases are not guaranteed.

Initial audit: September 9, 2026, based on main commit f5b84c2. The Learn hub primarily covered technical fitting topics; beginner iron and driver practice lacked dedicated supporting guides. The sitemap assigned the current timestamp to every route on each build, even without a content change. The homepage Range Rescue action lacked the shared CTA event, and its beginner session lacked start/completion events.

No authenticated Search Console or GA4 reporting connection was available during this audit. Search impressions, indexed-page counts, organic clicks, sessions, and completion rates are unknown. A search-engine `site:` query is not a reliable indexing report. Do not infer zero traffic or no indexing from it.

## Measurement

The initial public HTTP audit checked 28 sitemap routes: all returned 200. It found that `/clinic/ball-curves-right` inherited the clinic hub's canonical, title and description. A dedicated route layout corrects those three findings. This is a metadata defect, not evidence about Google's actual indexing decision.

Run `npm run audit:seo` for production, or `npm run audit:seo -- --base-url http://localhost:3113` for a local build with production canonical URLs. The read-only script emits JSON and exits nonzero on findings. Its scope is HTTP and server-rendered search metadata, not rankings, visual rendering or actual Google indexing. Regression tests: `npm run test:seo`.

Use Search Console for pages and queries, impressions, clicks, click-through rate, indexing and Core Web Vitals. Use GA4 for organic landing sessions and consented tool engagement. Compare the latest complete 28 days with the preceding 28, and annotate releases. Do not promise attribution from a before/after change alone; small samples and seasonality matter.

For Range Rescue, use the homepage `dov_cta_clicked` event and `dov_range_rescue_beginner_started` / `dov_range_rescue_beginner_completed`. See analytics.md. Verify delivery in GA4 before interpreting missing events as user behavior. Do not collect shot records or video for marketing analytics.

## Ongoing workflow

A daily 9 a.m. local-time thread automation checks public search health and open work. Once each week it may prepare one focused, researched improvement. The desktop app and computer must remain running for local scheduled work. Tool and network permissions still apply.

1. Read current repository instructions, inspect unfinished work and existing PRs, and avoid duplicate changes.
2. Run the SEO audit against production. Investigate failed routes, canonical mismatches, missing metadata and accidental noindex before expanding content.
3. With reporting access, prioritize queries already earning impressions with weak click-through, useful pages near the first results page, and landing pages with poor tool engagement.
4. Without reporting access, use observed site gaps and authoritative research. Record uncertainty; never invent search volume or traffic gains.
5. Improve an existing page before adding overlapping content. New guides must solve a specific question, give a concrete practice plan, accurately describe the tool, and offer a useful next step.
6. Validate code, mobile/desktop presentation, keyboard use, metadata and navigation. Open a feature PR with CI and Vercel preview. Follow explicit production authorization before merging.

## Immediate backlog

- Verify Search Console ownership, indexing and sitemap submission once an authenticated session is available. Do not change verification, DNS or analytics properties without authorization.
- Verify GA4 delivery and record the first real 28-day baseline.
- Use query evidence to improve existing ball-flight and equipment pages before adding more articles.
- Measure mobile field performance before adopting speculative performance rewrites.
- Draft distribution material only when there is a specific audience and channel. Sending outreach, paid campaigns and account creation require the appropriate authorization.

## Editorial and technical references

- Google: [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- Google: [Accurate sitemap modification dates](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping).
- OpenAI: [Scheduled tasks and local execution requirements](https://learn.chatgpt.com/docs/automations?surface=app).

Keep public routes, canonical URLs, consent behavior, analytics property, scoring and diagnostic logic intact. No purchased traffic, invented reviews, automated spam or bulk keyword pages. Roll back code through the PR revert path; this initiative requires no data migration.
