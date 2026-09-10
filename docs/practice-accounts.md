# Optional practice accounts

`NEXT_PUBLIC_PRACTICE_ACCOUNTS=true` is required to enable the account client. Keep it false until migration, email setup, and preview checks are complete; public credentials alone never enable sign-in. Set it false and rebuild to disable accounts during rollback.

Every adapter operation also requires the user ID captured by the UI when it began. It verifies that identity before requesting data; save/clear pass it to the RPC for another check against the current token, and fetch filters the captured owner. Stale operations cannot adopt a newly signed-in user's identity.

Account sync uses the existing Supabase project with email codes. Local practice remains usable without an account or a configured backend. The browser client reads only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; it requires a public `sb_publishable_...` key, never `SUPABASE_SERVICE_ROLE_KEY`. These public values are embedded in the build, so enable them only after backend review and migration. Do not change the project's linkage or server credentials.

## Data and boundaries

`practice_sessions` contains the authenticated user's ID, opaque session ID, completion timestamp, original local practice date, club, and two five-shot observation arrays. It contains no video, IP address, analytics payload, or email. Supabase Auth separately manages account email and authentication. Signing in does not itself authorize uploading existing local history; the UI must offer an explicit sync/import choice and keep other users' local sessions separate.

Row-level policies restrict reads and deletion to `auth.uid()`. Authenticated browsers cannot insert or update the table directly. The save RPC derives the owner from the authenticated token and cannot accept a different user ID. It validates every input, accepts at most 30 records, ignores repeated session IDs, and trims each account to its latest 30 records. Advisory transaction locking serializes saves and clears for the same account. An invalid batch rolls back in full. Sessions are immutable; retrying an ID cannot replace its existing contents.

Deletion removes practice records, not the Auth account. Before enabling accounts, the operator must establish how to verify ownership of deletion requests received through the site's privacy contact and remove the verified user's account through Supabase's secure admin process. No existing deletion process is assumed. Never expose a service-role key to implement account deletion. Signing out removes the local authentication session, not account history. A deliberate later re-upload of local sessions can restore previously deleted account records; the UI must not automatically re-import after deletion.

Account HTTP requests have a 15-second timeout covering headers and response body; caller cancellation is preserved. Requests return a recoverable error instead of leaving a pending network request indefinitely. A sync can involve more than one request (identity verification followed by data), and interrupted writes may have reached the server, so retry uses immutable session IDs.

## Deployment prerequisites

Setup status, September 10, 2026 UTC: the practice migration was applied to the existing Diagnostic project. RLS, three ownership policies, denied anonymous access, and denied direct browser inserts were verified. Existing putting, feedback and lead counts were unchanged. Email signups and confirmation are enabled; signup and sign-in templates now contain the code, with eight digits and a ten-minute expiry. The Auth site URL is `https://dovegolf.fit`.

Before exposing public account clients, an existing unrestricted leads table was found and protected with `202609110002_protect_leads_from_public_clients.sql`. Public roles cannot access leads; the existing server-only service-role routes retain their permissions. The in-memory regression test is `tests/lead-data-access-smoke.mjs`. Do not roll this protection back as part of disabling practice accounts. Retain server access and diagnose any affected integration instead.

Operational follow-up: custom SMTP uses the existing Resend sender; real signup and returning sign-in codes passed. All three public account settings are enabled only for the `codex/practice-accounts` Vercel preview branch. Two real test accounts verified normal UI isolation, and a separate preview origin retrieved saved history without sharing local storage. Production accounts remain disabled. Do not reapply migrations already present in the project.

The no-content response regression was fixed at `c9c1694`: browsers can expose a non-null empty stream for HTTP 204, but constructing a Response with any body at that status throws. The transport now uses a null body for 204/205/304. A new regression failed before the fix and passes after it. Hosted save, deletion success feedback, zero history after reload, and first-attempt sign-out passed. GitHub CI run 196 and Vercel deployment `34hJSfz4Q31ns8NzUpidtjHcTmTC` passed.

1. Review and apply `supabase/migrations/202609110001_create_practice_accounts.sql` to the intended project through the normal migration process. It adds only practice objects and does not alter putting or feedback tables.
2. Confirm Email authentication and intended signups are enabled. Configure the Magic Link email template to show the `{{ .Token }}` code instead of relying on a confirmation link. The UI calls `signInWithOtp({email})` and then `verifyOtp({email, token, type: "email"})`; no redirect callback or Google OAuth configuration is needed. Check any separate confirmation template used by the project's signup settings. [Supabase email OTP documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless).
3. Configure approved production SMTP delivery and a verified sender in Supabase Auth, with appropriate rate limits and abuse protection. Supabase's default mail service is restricted and unsuitable for unrestricted production signups. Existing application Resend environment variables do not automatically configure Supabase Auth SMTP. No sender, DNS, or provider settings are changed by this code. [Supabase SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp).
4. Add the two public credential variables and set `NEXT_PUBLIC_PRACTICE_ACCOUNTS=true` in the preview environment first, rebuild, and complete the checks below. Never substitute a secret/server key. Enable production only after approval, migration, and live email verification.

## Verification before release

Use two disposable test accounts with real inboxes on the preview. Verify new signup and returning login codes, invalid/expired code errors, rate limits, signout, and re-login. Confirm no Auth or database requests occur for visitors who use only local practice, except any explicitly documented session restoration.

For account A, save a session, repeat the save, and confirm only one record. Save over 30 distinct sessions across valid batches and confirm the oldest are pruned. Repeat simultaneous saves in two tabs. Submit an incomplete batch and confirm no partial inserts. Direct table inserts and updates must fail. As account B, selecting A's user ID and attempting to delete it must return no A data; an extra `user_id` field in an RPC item must not change ownership. Anonymous users must have no table or RPC access. Clear A's history and confirm B's data survives. Delete a test Auth user and verify its sessions cascade away. These checks must use ordinary authenticated/anonymous tokens, not a service-role token that bypasses RLS. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [function privileges](https://supabase.com/docs/guides/database/functions).

Automated adapter tests cover response mapping, canonical uploads, duplicate/malformed rejection, account-switch guards, disabled rollout behavior, and failure reporting. Run `node src/lib/range-rescue/practice-account.database-smoke.mjs <temporary-prefix>/node_modules/@electric-sql/pglite` against a separately installed PGlite package to check the unchanged migration, constraints, batch rollback, 30-record limit, two-user RLS isolation, and Auth deletion cascade. This local test cannot prove production email delivery, JWT configuration, simultaneous network requests, or deployed policy behavior. Account sync must remain marked unverified until the preview's two-account checks pass.

## Account-deletion support procedure

The site operator handles requests at the privacy contact published on `/privacy`. Practice-history deletion in the app is separate from deletion of the Auth account.

1. Locate the exact account email in the existing Supabase project's Authentication users screen. Do not search or export unrelated user records.
2. Verify control of that mailbox before deletion: send a fresh, single-use confirmation challenge to the email registered on the account and require a reply containing that challenge and an explicit request to delete the account. An incoming message's From field alone is insufficient. Do not ask for a sign-in OTP, password, or other account credentials. Do not send challenges to an alternative address supplied by a requester.
3. Explain that Auth-account deletion removes its saved practice through the foreign-key cascade, ends future access to that account, and cannot be undone. Browser-only history is separate and must be removed on each device. Existing requests or sign-in tokens may remain usable until expiry, but the removed Auth user cannot own new practice rows.
4. In the secure Supabase admin interface, recheck the verified email and corresponding user ID, then use the Auth user's delete action. Do not delete a user based only on a name, partial email, or an ID supplied by someone else. Never expose admin credentials in the frontend. If an agent performs this action, follow its applicable deletion-confirmation requirements.
5. Verify the Auth user is absent and no practice rows reference that exact user ID. If deletion fails or the cascade is not confirmed, stop and investigate; do not report completion.
6. Confirm completion to the verified mailbox. Keep a minimal internal record of the request, verification, deletion time and outcome according to the operator's support-retention process; never put verification challenges, account IDs or private correspondence in a public issue/PR.

This is a documented procedure, not an automated support service. No real test Auth accounts are removed during routine QC. The operator must monitor the published privacy inbox when enabling production accounts.

## Final QC evidence — September 10, 2026 UTC

Application commit: `c9c169476ae0f6cc141898646f0963fb7e6e700a` (PR #102). The final documentation update does not change the application bundle.

- Two existing test accounts signed in through fresh email OTPs using ordinary authenticated clients and the public publishable key; no service-role token was used.
- Hosted checks passed: immutable duplicate retry, whole-batch rollback, denied direct insert/update, cross-account filtered reads/deletes, mismatched-owner RPC rejection, ignored injected owner fields, anonymous table/RPC denial, and denied lead access for anonymous and authenticated clients.
- Two simultaneous 20-session save requests retained exactly the newest 30 records and pruned older records. Clearing account A left B's record intact. Both accounts started empty and all synthetic records were cleaned up. Real Auth accounts were preserved.
- Hosted browser checks passed on the fixed preview: save, deletion success feedback, zero history after reload, sign-out, and keyboard cancellation. Earlier tests verified new signup, invalid-code recovery, returning login, and cloud retrieval from an independent preview origin.
- Fresh responsive checks on the same local application code passed at 390px and 320px: readable account form, visible keyboard focus, invalid-email rejection, and no horizontal overflow. These are emulated viewports, not physical phone tests.
- Independent read-only security review found no new code defects. CI run 196 passed, including migration/RLS, cascade and lead-protection smoke tests. Auth-user deletion cascade was tested in local PostgreSQL, not by removing the real hosted test accounts.
- The final local SEO audit passed for all 30 sitemap routes with zero findings. The public production `/api/health` returned `ok: true`, confirming the existing server-side lead read still works after public lead access was denied.
- A physical second-device test, long-running load testing, and analytics event arrival in GA4 are not claimed. The verified independent-origin retrieval and concurrent API tests cover the relevant account behavior without claiming those broader checks.

Release sequence: merge the reviewed growth foundation (#100), practice progress (#101), then accounts (#102), preserving their dependency history. Production account controls remain disabled until the operator explicitly authorizes rollout and enables the three public account variables for Production followed by a rebuild. The separate logo asset PR (#103) is not a dependency of account functionality.

## Rollback

Remove the two public build variables and redeploy the previous frontend to hide account sync while preserving local history and server records. Revoke RPC execution if emergency write suspension is needed. Keep the table for rollback/data recovery; do not drop it as a routine rollback. If removal is deliberately approved after export/retention review, drop the two practice RPCs before dropping `practice_sessions`. Existing game history and feedback tables are independent.
