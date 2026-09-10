# Dove Golf email branding

## Assets

- `public/dove-logo-original.png` is the original high-resolution logo recovered unchanged from `public/dove-icon.png.png` at commit `7461e31e98fc624028536a9276c163b9398e692d`.
- `public/dove-logo-email.png` is an AI-assisted, high-contrast adaptation for email headers and small avatars. It is a raster adaptation, not an exact vector master or a BIMI-compliant SVG.

The existing site favicon is unchanged. Preserve the original when preparing future variants.

## Email body

Use a publicly accessible HTTPS image URL with explicit width and height and `alt="Dove Golf"`. Preserve the Supabase `{{ .Token }}` placeholder, ten-minute expiry notice, and security copy when adding the logo to signup and magic-link/OTP templates.

The assets alone do not update the live Supabase templates. Record the hosted asset URL and template verification here after those steps complete.

## Inbox sender avatar

An HTML header image does not set the inbox sender avatar. The sender remains `Dove Golf <noreply@dovegolf.fit>`.

Provider-specific profile pictures require control of a mailbox/profile at that exact sender address. Broader verified-logo display can require BIMI, appropriate DMARC policy, a compliant SVG, and a certificate. Do not change DNS or purchase a certificate as part of an asset-only update.

References: [Resend avatar guidance](https://resend.com/docs/knowledge-base/how-do-i-send-with-an-avatar), [Google BIMI setup](https://knowledge.workspace.google.com/admin/security/set-up-bimi).
