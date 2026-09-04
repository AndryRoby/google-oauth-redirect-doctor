# Google OAuth Redirect Doctor — redirect_uri_mismatch

Live: https://arling.sk/google-oauth-redirect-doctor/

A free, static, client-side tool that diagnoses Google's **"Error
400: redirect_uri_mismatch"** (or `invalid_request`) during OAuth
sign-in. Paste the `redirect_uri` from the error itself, your
Authorized redirect URIs / JavaScript origins from Google Cloud
Console, and which stack you're using, and it works out the exact
`redirect_uri` your stack should be sending, diffs it byte-for-byte
against what Google actually saw and against your console entries,
and reports the precise character(s) that differ — instead of you
re-reading Google's OAuth docs for the third time.

## What it's for

If Google is blocking sign-in with `redirect_uri_mismatch` and the
console page *looks* right at a glance, this tool takes the config
that's normally scattered across your app's code, environment
variables, and the Google Cloud Console Credentials page, and
cross-checks it for the mismatches that cause almost all of these
failures:

- **Invisible or whitespace characters** in the pasted `redirect_uri`
  — a trailing space or zero-width character that looks identical to
  the correct value but fails Google's exact-match check.
- **`http` instead of `https`** on anything other than localhost —
  Google requires HTTPS everywhere except loopback addresses.
- **Raw IP address as the host** — Google rejects these outright
  (loopback addresses are the only exemption).
- **A query string or fragment** on the `redirect_uri` — Google's
  validation allows neither.
- **A custom scheme sent to a "Web application" OAuth client** —
  custom schemes only work with Android, iOS, or Desktop client types.
- **Scheme, host (`www` vs. apex, `localhost` vs. `127.0.0.1`), port,
  path (including trailing slash and letter case)** not matching
  byte-for-byte between what your stack computes and what Google saw.
- **Your redirect_uri not present in Authorized redirect URIs** at
  all, with the closest existing entry shown and the exact diff —
  Google's allow-list has no wildcards, unlike Supabase's.
- **Authorized JavaScript origins** missing your app's origin, for
  Google Identity Services (One Tap / popup sign-in).
- **Stack-specific defaults** for NextAuth/Auth.js
  (`/api/auth/callback/google`), Supabase (`https://<ref>.supabase.co/auth/v1/callback`
  — not your app's URL), Firebase (`https://<authDomain>/__/auth/handler`),
  Passport, django-allauth (`/accounts/google/login/callback/`),
  Laravel Socialite, `google-auth-oauthlib`'s
  `InstalledAppFlow.run_local_server()`, Expo `AuthSession`, Flutter
  `google_sign_in`, Postman, and `gcloud auth application-default
  login`'s fixed local port.
- **Preview-deployment traps** — Google's redirect URIs accept no
  wildcards, so a `*.vercel.app` preview URL needs its own exact entry
  or a stable callback domain.
- **A red herring**: an OAuth consent screen stuck in "Testing" mode
  throwing `access_denied` instead — a different error from
  `redirect_uri_mismatch`, fixed by adding a test user, not by
  touching redirect URIs.

## How it works (client-side only)

Everything runs in your browser. There is no backend, no account, and
no payment wall. You fill in the `redirect_uri` from Google's error
page, your Authorized redirect URIs / JavaScript origins, and your
stack's config into the page, and `doctor-google.js` — one
dependency-free JavaScript file — runs a single pure function,
`diagnose(config)`, entirely in your browser, and you get a
plain-language report of what's wrong with copy-paste fixes for your
code and for Google Cloud Console.

Nothing about your configuration is sent anywhere. The only network
activity this site generates is:

- loading its own static assets (HTML/CSS/JS) from GitHub Pages,
- and anonymous product-analytics events (page view, "run check"
  clicked, etc.) sent to a self-hosted Umami instance — **event names
  and counts only, never the content of what you entered.**

You can verify this yourself: open your browser's network tab while
using the tool, or just read `index.html` and `doctor-google.js` —
it's static files with no build step.

## Privacy

- No account, no login, no cookies for the tool itself.
- No server-side processing of your config — the "backend" is your
  own browser's JavaScript engine.
- Analytics (Umami) records that *a* check ran, not *what* you
  checked.
- If you're paranoid (fair, given the subject matter — OAuth client
  configuration), download the repo and open `index.html` locally
  with your network disconnected — it still works.

## Running it locally

There's no build step. It's static files.

```bash
git clone https://github.com/AndryRoby/google-oauth-redirect-doctor.git
cd google-oauth-redirect-doctor
# any static file server works, e.g.:
npx serve .
# or just open index.html directly in a browser
```

## Reporting a missing case / false positive

Found a `redirect_uri_mismatch` cause this tool doesn't catch, or a
check that flags something that's actually fine? Please open an issue
on the GitHub repo with:

1. The relevant (redacted) config — the stack, the `redirect_uri`
   from the error, your Authorized redirect URIs.
2. What actually went wrong at runtime (error text or screenshot).
3. What you expected the tool to say.

Redact anything sensitive (OAuth client IDs, project refs, real
domains) before posting — issues are public.

## Disclaimer

This tool is provided **as is**, with no warranty of any kind. It
checks for known, common misconfiguration patterns — it cannot
guarantee your OAuth flow will work, and a clean report is not a
guarantee of a working integration. It performs a read-only,
client-side analysis of the values you type in; nothing is verified
against your live Google Cloud project. Google, NextAuth/Auth.js,
Supabase, Firebase, Passport, Django, Laravel, Expo, and Postman are
not affiliated with this tool, and their consoles, SDKs, and docs may
change in ways that make individual checks stale over time. Always
verify against the current official documentation for anything
security-relevant.

## About

Built by ARLing s. r. o. (Bratislava, Slovakia).
Contact: andrej@arling.sk

Sibling tools in the same "Doctor" family (Supabase Auth redirects,
platform by platform):
- Web (Next.js / Vite / SvelteKit): https://arling.sk/supabase-redirect-doctor/
- Flutter (`supabase_flutter`): https://arling.sk/flutter-supabase-doctor/
- Expo / React Native: https://arling.sk/expo-supabase-auth-doctor/
- Hub (more ARLing tools): https://arling.sk/
