# Verified putting leaderboard

The game works without a database. Posting and the leaderboard require the existing server-only `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; no public database keys or new environment variables are required. Missing configuration, tables, or network connectivity returns a friendly 503. Never expose the service role key to the browser.

## Deployment and rollback

1. Review `supabase/migrations/202609070001_create_putting_leaderboard.sql` and apply it to a nonproduction Supabase environment first. This change does not execute migrations automatically.
2. Verify a full five-hole submission, simultaneous duplicate submissions, rank ties, weekly rollover, invalid/expired tokens, unavailable database, and direct anonymous table/RPC access denial there.
3. After explicit production approval, apply the additive migration to the existing intended project before enabling the release. No existing tables are changed.
4. Roll back the application deployment to disable this feature. Retain these tables for scores and rollback safety. Dropping the four functions and then `putting_scores`, `putting_rounds`, and `putting_rate_limits` permanently removes the feature's data and needs separate approval and a backup.

## API and rules

- `POST /api/putting/round`, JSON `{}` returns `{ok,token,courseVersion,expiresAt}`. The 256-bit random bearer token expires in two hours; only its SHA-256 hash is stored.
- `POST /api/putting/scores`, JSON `{token,initials,shots}` returns `{ok,entry,period:"weekly"}`. Shots are five arrays of `{angle,power}`. The shared deterministic simulation computes points and verifies every hole. Client-supplied score and rank are never trusted. A round inserts at most one score; retrying the identical result returns the original entry. Tokens are not tied to an IP, so changing mobile networks during play works.
- `GET /api/putting/scores?period=weekly|alltime` returns `{ok,entries,period}`. Weekly starts Monday 00:00 UTC. Entries contain `id,initials,score,rank,achievedAt,courseVersion`. Equal points share competition rank (1,1,3); the ten displayed entries are ordered by points, then oldest first. Multiple rounds from the same initials are allowed: initials are not verified identities.
- Submission rank is saved once as the weekly rank at that moment. Certificates use that historical rank and timestamp, not a permanent claim to current first place. List results calculate current rank. `getVerifiedScore(id)` returns only unhidden verified records for share cards.
- Course/physics changes must increment `COURSE_VERSION`; boards are separated by version. Older certificates retain their version and dated result.

## Abuse, privacy, and moderation

Tables have RLS, no anonymous/authenticated permissions or policies, and only the server role can invoke functions. Atomic database counters allow 120 starts and 240 submission attempts per hour per daily HMAC of the Vercel-provided client address. These generous pilot limits allow shared range Wi-Fi traffic; monitor aggregate usage before tightening them. Plain IPs are never stored; rotating the service key also rotates that pseudonymous bucket. Non-Vercel deployments deliberately share one fallback bucket until a trusted proxy integration is configured. Expired unused rounds are removed on new starts; rate buckets older than two days are pruned on allowed requests. No account or email is collected.

Initials must be three ASCII letters/numbers, normalized uppercase. A basic explicit-word denylist prevents obvious abuse but is not exhaustive. An operator can hide an abusive or automated result with `update public.putting_scores set hidden = true where id = '<reviewed-score-uuid>';` through the trusted Supabase console. Hidden entries disappear from lists and future certificate fetches; previously downloaded images cannot be revoked. Do not expose an unauthenticated moderation endpoint.

Replay proves that a score is possible under the rules; it does not prove a human played it. Scripts can find valid shots, and initials can be impersonated. Do not use this version for cash prizes or verified identities. Stronger anti-abuse controls can follow actual pilot usage.

## Verification boundary

Local replay tests, compilation, and unavailable-service behavior can run without database access. SQL execution, transactional concurrency, and real persisted success paths require the migration on a test database and must be reported as unverified until exercised there.
