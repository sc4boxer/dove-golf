# Dove Golf email branding

## Assets

- `public/dove-logo-original.png` is the original high-resolution logo recovered unchanged from `public/dove-icon.png.png` at commit `7461e31e98fc624028536a9276c163b9398e692d`.
- `public/dove-logo-email.png` is an AI-assisted, high-contrast adaptation for email headers and small avatars. It is a raster adaptation, not an exact vector master or a BIMI-compliant SVG.

The existing site favicon is unchanged. Preserve the original when preparing future variants.

## Email body

Use a publicly accessible HTTPS image URL with explicit width and height and `alt="Dove Golf"`. Preserve the Supabase `{{ .Token }}` placeholder, ten-minute expiry notice, and security copy when adding the logo to signup and magic-link/OTP templates.

On 2026-09-09, the Supabase signup and magic-link/OTP templates were updated and both saves returned success. They use this immutable public image URL:

`https://raw.githubusercontent.com/sc4boxer/dove-golf/218f4b3ccd398a64568754bf9224c946519fd97e/public/dove-logo-email.png`

The image loads independently in Chrome. Both templates use a 72-by-72-pixel image with `alt="Dove Golf"`, retain their existing subject lines, OTP placeholder, expiry and security copy. Actual received-message rendering still needs verification. Supabase's preview toggle could not be activated through the available browser selectors.

Rollback: remove only the `<img>` element from those two templates and save. Preserve the OTP and all other copy. The image URL is pinned to a commit; moving or deleting the branch does not update it.

Validation: lint passed; all 12 visual tests passed with `--experimental-strip-types` (required by local Node 22.17); production build passed with nonsecret placeholder Supabase/Resend settings. Live service behavior is not validated by that build.

## Inbox sender avatar

An HTML header image does not set the inbox sender avatar. The sender remains `Dove Golf <noreply@dovegolf.fit>`.

Provider-specific profile pictures require control of a mailbox/profile at that exact sender address. Broader verified-logo display can require BIMI, appropriate DMARC policy, a compliant SVG, and a certificate. Do not change DNS or purchase a certificate as part of an asset-only update.

The domain lookup returned SOA rather than an MX answer; an existing mailbox profile has not been confirmed. No inbox avatar, certificate, or DNS change has been completed.

References: [Resend avatar guidance](https://resend.com/docs/knowledge-base/how-do-i-send-with-an-avatar), [Google BIMI setup](https://knowledge.workspace.google.com/admin/security/set-up-bimi).
