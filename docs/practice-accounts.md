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

Remaining: custom SMTP, preview environment variables, real email delivery, and two-account cross-device verification. Accounts remain disabled. Do not reapply migrations already present in the project. The live `/api/health` browser check was blocked by the browsing client; server permissions and unchanged database counts were verified directly.

1. Review and apply `supabase/migrations/202609110001_create_practice_accounts.sql` to the intended project through the normal migration process. It adds only practice objects and does not alter putting or feedback tables.
2. Confirm Email authentication and intended signups are enabled. Configure the Magic Link email template to show the `{{ .Token }}` code instead of relying on a confirmation link. The UI calls `signInWithOtp({email})` and then `verifyOtp({email, token, type: "email"})`; no redirect callback or Google OAuth configuration is needed. Check any separate confirmation template used by the project's signup settings. [Supabase email OTP documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless).
3. Configure approved production SMTP delivery and a verified sender in Supabase Auth, with appropriate rate limits and abuse protection. Supabase's default mail service is restricted and unsuitable for unrestricted production signups. Existing application Resend environment variables do not automatically configure Supabase Auth SMTP. No sender, DNS, or provider settings are changed by this code. [Supabase SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp).
4. Add the two public credential variables and set `NEXT_PUBLIC_PRACTICE_ACCOUNTS=true` in the preview environment first, rebuild, and complete the checks below. Never substitute a secret/server key. Enable production only after approval, migration, and live email verification.

## Verification before release

Use two disposable test accounts with real inboxes on the preview. Verify new signup and returning login codes, invalid/expired code errors, rate limits, signout, and re-login. Confirm no Auth or database requests occur for visitors who use only local practice, except any explicitly documented session restoration.

For account A, save a session, repeat the save, and confirm only one record. Save over 30 distinct sessions across valid batches and confirm the oldest are pruned. Repeat simultaneous saves in two tabs. Submit an incomplete batch and confirm no partial inserts. Direct table inserts and updates must fail. As account B, selecting A's user ID and attempting to delete it must return no A data; an extra `user_id` field in an RPC item must not change ownership. Anonymous users must have no table or RPC access. Clear A's history and confirm B's data survives. Delete a test Auth user and verify its sessions cascade away. These checks must use ordinary authenticated/anonymous tokens, not a service-role token that bypasses RLS. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [function privileges](https://supabase.com/docs/guides/database/functions).

Automated adapter tests cover response mapping, canonical uploads, duplicate/malformed rejection, account-switch guards, disabled rollout behavior, and failure reporting. Run `node src/lib/range-rescue/practice-account.database-smoke.mjs <temporary-prefix>/node_modules/@electric-sql/pglite` against a separately installed PGlite package to check the unchanged migration, constraints, batch rollback, 30-record limit, two-user RLS isolation, and Auth deletion cascade. This local test cannot prove production email delivery, JWT configuration, simultaneous network requests, or deployed policy behavior. Account sync must remain marked unverified until the preview's two-account checks pass.

## Rollback

Remove the two public build variables and redeploy the previous frontend to hide account sync while preserving local history and server records. Revoke RPC execution if emergency write suspension is needed. Keep the table for rollback/data recovery; do not drop it as a routine rollback. If removal is deliberately approved after export/retention review, drop the two practice RPCs before dropping `practice_sessions`. Existing game history and feedback tables are independent.
