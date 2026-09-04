# Google OAuth Redirect Doctor

A free tool that finds why Google throws "Error 400: redirect_uri_mismatch" (or `invalid_request`) during OAuth sign-in, and gives the exact fix, for your code and for Google Cloud Console.

Live: https://arling.sk/google-oauth-redirect-doctor/

You paste the `redirect_uri` from Google's error page, your Authorized redirect URIs and JavaScript origins from Google Cloud Console, and which stack you use. The tool works out the exact `redirect_uri` your stack should be sending, diffs it byte-for-byte against what Google saw and against your console entries, and reports the precise component that differs.

## What it checks

Each check below is a `code` the engine (`doctor-google.js`) can return from `diagnose()`:

- `invisible_or_whitespace_character`: a trailing space or zero-width character in the pasted `redirect_uri` that renders as identical to the correct value but fails Google's exact-match check.
- `http_not_https`: `http://` used anywhere except localhost; Google requires HTTPS everywhere else.
- `raw_ip_not_allowed`: the host is a raw IP address; only loopback addresses (`localhost` / `127.0.0.1` / `[::1]`) are exempt.
- `query_string_present` / `fragment_present`: a `?query` or `#fragment` on the `redirect_uri`; Google's validation allows neither.
- `custom_scheme_wrong_client_type`: a custom scheme (`myapp://…`) sent to a "Web application" OAuth client, which only ever accepts `http`/`https`.
- `redirect_uri_code_mismatch`: byte-for-byte diff of scheme, host (`www` vs. apex, `localhost` vs. `127.0.0.1`), port, and path (trailing slash, letter case) between what your stack computes and what Google saw.
- `redirect_points_to_app_not_provider`: for Supabase/Firebase, your redirect_uri points at your own app instead of the provider's own callback (Google talks to the provider first).
- `redirect_uri_not_in_console`: the value your code should send isn't in Authorized redirect URIs at all; the closest existing entry is shown with the exact diff. Google's allow-list has no wildcards, unlike Supabase's.
- `js_origin_missing`: your app's origin isn't in Authorized JavaScript origins, for Google Identity Services (One Tap / popup sign-in).
- `client_type_mismatch`: the OAuth client type you're using doesn't match what the flow needs (e.g. a Web client where Desktop or Android/iOS is required).
- `preview_url_no_wildcard`: a preview-deployment trap: each `*.vercel.app` (or similar) preview URL needs its own exact Console entry, since Google accepts no wildcards.
- `testing_status_hint`: a red herring flag: an OAuth consent screen stuck in "Testing" throws `access_denied` for non-test accounts, a different error from `redirect_uri_mismatch`.
- `recent_change_propagation_delay`: a change saved in Console less than 5 minutes ago may not have propagated yet.
- `expected_value_incomplete` / `redirect_uri_from_error_missing`: nudges when a required field is still empty, so the diff can't run yet.

Stack-specific expected callbacks are computed and diffed automatically for: NextAuth v4 / Auth.js v5, Supabase, Firebase, Passport, django-allauth, Laravel Socialite, `google-auth-oauthlib` (`InstalledAppFlow.run_local_server()`), Expo `AuthSession`, Flutter `google_sign_in`, Postman, and `gcloud auth application-default login`.

## What it does not do

- It does not call Google, your app, or any live API. It only compares the strings you type in against each other and against known stack defaults.
- It does not verify your OAuth client ID/secret, sign you in, or test the actual redirect against your live Google Cloud project.
- It does not send, store, or log your configuration anywhere. There is no account, no login, and no payment wall.
- It does not know about OAuth providers other than Google, or about redirect rules that Google has changed since this was last updated (see Sources below).

## How it works

Everything runs in your browser. `doctor-google.js`, one dependency-free JavaScript file, exports a single pure function, `diagnose(config)`, which the page calls with the values you fill in and renders the result as a plain-language report. Nothing about your configuration is sent anywhere; the only network activity is loading the page's own static assets and anonymous Umami analytics events (see Privacy).

```js
import { diagnose } from './doctor-google.js';

diagnose({
  error: { redirectUriFromError: 'https://myapp.com/api/auth/callback/google', clientType: 'web' },
  console: {
    authorizedRedirectUris: ['https://myapp.com/api/auth/callback/google/'],
    authorizedJsOrigins: [],
    publishingStatus: 'production',
    savedMinutesAgo: null,
  },
  app: { stack: 'nextauth', origin: 'https://myapp.com', env: 'production' },
});
```

Output (run against the code above):

```json
{
  "status": "fail",
  "summary": "1 blocking mismatch found. Most urgent: \"https://myapp.com/api/auth/callback/google\" is not in Authorized redirect URIs. The closest existing entry is \"https://myapp.com/api/auth/callback/google/\": \"/api/auth/callback/google\" vs \"/api/auth/callback/google/\": a trailing-slash mismatch; Google's own docs say the trailing slash must match exactly.",
  "problems": [
    {
      "severity": "high",
      "code": "redirect_uri_not_in_console",
      "message": "\"https://myapp.com/api/auth/callback/google\" is not in Authorized redirect URIs. The closest existing entry is \"https://myapp.com/api/auth/callback/google/\": a trailing-slash mismatch...",
      "path": "console.authorizedRedirectUris",
      "fix": "Add \"https://myapp.com/api/auth/callback/google\" to Authorized redirect URIs."
    }
  ],
  "fixes": [
    { "title": "Add to Google Cloud Console → Authorized redirect URIs", "value": "https://myapp.com/api/auth/callback/google" }
  ],
  "disclaimer": "Read-only, client-side analysis of the values you entered. Nothing is verified against your live Google Cloud project: always confirm in the Console before shipping. Not affiliated with Google."
}
```

The console entry has a trailing slash the code's computed value doesn't; `diagnose()` catches that one-character difference instead of you comparing two long URLs by eye.

## Run locally

No build step, no dependencies.

```bash
git clone https://github.com/AndryRoby/google-oauth-redirect-doctor.git
cd google-oauth-redirect-doctor
python -m http.server
# or just open index.html directly in a browser
```

## Tests

```bash
node tests.mjs
```

108 assertions, 108 passed, 0 failed as of this writing.

## Privacy

Everything runs client-side; nothing you type into the form is sent anywhere, ever. Product analytics (page views, "run check" clicked) go to a self-hosted Umami instance with no cookies and no personal data, event name and count only. Joining the "tell me about new tools" email list on the page is entirely optional and separate from using the tool. Full policy: https://arling.sk/privacy/.

## Sources

The rules this tool checks are drawn from:

- Google: [OAuth 2.0 for Web Server Applications: redirect_uri validation](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation)
- Google: [OAuth 2.0 for Native Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
- Auth.js: [Google provider docs](https://authjs.dev/getting-started/providers/google)
- Supabase: [Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- Firebase: [Redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- django-allauth: [Google provider docs](https://docs.allauth.org/en/latest/socialaccount/providers/google.html)
- Laravel: [Socialite docs](https://laravel.com/docs/11.x/socialite)
- Google: [google-api-python-client installed-app OAuth](https://googleapis.github.io/google-api-python-client/docs/oauth-installed.html)
- Expo: [AuthSession SDK docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- Postman: [OAuth 2.0 authorization](https://learning.postman.com/docs/sending-requests/authorization/oauth-20/)
- Google Cloud: [gcloud auth application-default login reference](https://docs.cloud.google.com/sdk/gcloud/reference/auth/application-default/login), plus [google.aip.dev/auth/4113](https://google.aip.dev/auth/4113)
- Google: [OAuth consent screen "Testing" publishing status](https://support.google.com/cloud/answer/15549945)

## Report a problem

Found a `redirect_uri_mismatch` cause this tool doesn't catch, or a check that flags something that's actually fine? Open an issue: https://github.com/AndryRoby/google-oauth-redirect-doctor/issues, or write to andrej@arling.sk. Please redact anything sensitive (OAuth client IDs, project refs, real domains) before posting; issues are public.

## License

All rights reserved, see [LICENSE-NOTICE.md](LICENSE-NOTICE.md). Reading the source and learning from it is fine; deploying your own copy of it as a competing product is not.

---

ARLing s. r. o., Bratislava, Slovakia. andrej@arling.sk

Hub (more free tools): https://arling.sk/

Sibling tools:
- Supabase Auth on Expo / React Native: https://arling.sk/expo-supabase-auth-doctor/
- Supabase Auth on the web (Next.js / Vite / SvelteKit): https://arling.sk/supabase-redirect-doctor/
- Supabase Auth on Flutter: https://arling.sk/flutter-supabase-doctor/
- Expo Universal Links / App Links: https://arling.sk/expo-universal-links-doctor/
- SEPA pain.001 for Slovak banks: https://arling.sk/sepa-pain001-doctor/
- BookApp: https://arling.sk/bookapp/
