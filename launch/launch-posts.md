# Launch posts — Google OAuth Redirect Doctor

Research date: 2026-09-04. Tool: https://arling.sk/google-oauth-redirect-doctor/

Method: GitHub REST search API (`api.github.com/search/issues`) for the broad
query and for each named repo, GitHub's own Discussions search for
`nextauthjs/next-auth`, and an attempt at Stack Overflow (blocked — see note
under section 1.4). Every thread below was actually fetched; nothing here is
invented. Dates are UTC, from each thread's own API/page data.

**Rule applied:** closed issue with its last activity more than 12 months ago
→ skip. Open issues/unanswered discussions are judged on relevance and
whether a reply would look welcome (a live troubleshooting thread) vs.
unwelcome (an internal task tracker, or a case the OP already solved alone).

---

## 1. Findings

### 1.1 Broad search: `redirect_uri_mismatch is:issue`, sorted by updated

This query is dominated right now by small, single-maintainer repos that use
GitHub Issues as an internal task/roadmap tracker rather than a public
Q&A thread (short imperative titles like "Register X as authorized
redirect URI", 0–4 comments, all from the repo's own team). Posting an
unsolicited tool link into someone's private backlog item reads as spam, not
help, even when the underlying bug is real — so all of these are **skip**,
with one exception checked in depth:

| Repo / issue | State | Last activity (UTC) | Recommendation |
|---|---|---|---|
| [HexamindOrganisation/hexgate#167](https://github.com/HexamindOrganisation/hexgate/issues/167) — "Google sign-in fails on prod and staging" | open | 2026-09-04 (created same day, 0 comments) | **Skip** — verified in full: the repo's own maintainer already root-caused it precisely (nginx dropping `X-Forwarded-Proto` in a location block) and is filing it as a doc-fix task for their own team, not asking for outside help. |
| [nathanjohnpayne/fiveacross#547](https://github.com/nathanjohnpayne/fiveacross/issues/547) | open | 2026-09-04 (3 comments) | Skip — reads as a self-assigned deployment checklist item, not a public question. |
| [uchi-stock/youtube-radar#12](https://github.com/uchi-stock/youtube-radar/issues/12) — README's OAuth setup causes redirect_uri_mismatch in OAuth Playground | open | 2026-09-04 (0 comments) | Skip — verified in full: narrow doc bug, fix already merged in PR #13, just awaiting confirmation. Not a case our tool (or an outside comment) helps with. |
| [bzreinhardt/Claude_Docs#1](https://github.com/bzreinhardt/Claude_Docs/issues/1) | open | 2026-09-03 (0 comments) | Skip — single-line issue, no visible content to respond to usefully. |
| [iftheshoefritz/webula#531](https://github.com/iftheshoefritz/webula/issues/531) | open | 2026-09-03 (4 comments) | Skip — internal roadmap-style issue for the repo's own Drive-verification checklist. |
| [LucasAlign/the-intentional-father#7](https://github.com/LucasAlign/the-intentional-father/issues/7) | open | 2026-09-03 (4 comments) | Skip — same author also has issue #5 "Steward Roadmap: stabilize, generalize, monetize" in the same repo; this is a personal project's internal task list. |
| [anthropics/claude-code#86233](https://github.com/anthropics/claude-code/issues/86233) — MCP OAuth loopback 127.0.0.1 vs localhost | closed | 2026-09-03 | Skip — closed, and about an MCP client's own loopback listener choice, not a Google Cloud Console redirect_uri config case our tool addresses. |
| [BinaryBourbon/fountain#1320](https://github.com/BinaryBourbon/fountain/issues/1320) | open | 2026-09-03 (4 comments) | Skip — internal task list ("Register Microsoft and Slack OAuth apps; complete Google scope verification"). |
| [Dev10x-Guru/Dev10x-Claude#1156](https://github.com/Dev10x-Guru/Dev10x-Claude/issues/1156) | closed | 2026-09-03 | Skip — closed, internal. |
| [hushh-labs/hushh-research#5507](https://github.com/hushh-labs/hushh-research/issues/5507) | open | 2026-09-03 (15 comments) | Skip — "Personal GCP Pod simulation," not specifically about redirect_uri_mismatch; internal research-log issue. |
| [isaacsmithnz-cmyk/heytiff#617](https://github.com/isaacsmithnz-cmyk/heytiff/issues/617) | open | 2026-09-03 (1 comment) | Skip — internal task ("uses Auth0 development keys"). |
| [ai-engineers-guild/ai-stp#62](https://github.com/ai-engineers-guild/ai-stp/issues/62) | closed | 2026-09-02 | Skip — closed same week it was opened; resolved internally. |
| [LucasAlign/the-intentional-father#5](https://github.com/LucasAlign/the-intentional-father/issues/5) | open | 2026-09-02 (0 comments) | Skip — roadmap issue, not a question. |

### 1.2 Repo-scoped: `nextauthjs/next-auth`

| Issue | State | Last human comment | Recommendation |
|---|---|---|---|
| [#10928 — "Authjs v5 redirecting to the wrong URL"](https://github.com/nextauthjs/next-auth/issues/10928) | **open**, 74 comments | 2026-03-02 (jonas-is-coding) | **Post** (see §2.3). Old (~6 months quiet) but open, huge, and still exactly on-topic: NextAuth/Auth.js redirecting to `localhost` instead of the real origin behind a tunnel/reverse proxy, which is a live-and-recurring cause of Google's `redirect_uri_mismatch`. |
| [#7809](https://github.com/nextauthjs/next-auth/issues/7809) | closed | 2024-10-18 | Skip — closed >12 months. |
| [#11739 — "Redirect uri mismatch in aws amplify"](https://github.com/nextauthjs/next-auth/issues/11739) | closed | 2024-08-31 | Skip — closed >12 months. |
| [#11584](https://github.com/nextauthjs/next-auth/issues/11584) | open, 0 comments | 2024-08-12 (OP only) | Skip — over 2 years with zero engagement; effectively dead. |
| [#7927 — "Error 400: redirect_uri_mismatch ... Sveltekit"](https://github.com/nextauthjs/next-auth/issues/7927) | closed | 2024-05-10 | Skip — closed >12 months. |
| [#3711](https://github.com/nextauthjs/next-auth/issues/3711) | closed | 2024-04-30 | Skip — closed >12 months. |
| [#10248](https://github.com/nextauthjs/next-auth/issues/10248) / [#10247](https://github.com/nextauthjs/next-auth/issues/10247) (duplicates) | closed | 2024-03-08 | Skip — closed >12 months. |
| [#8827](https://github.com/nextauthjs/next-auth/issues/8827) | closed | 2023-10-10 | Skip — closed >12 months. |
| [#8615](https://github.com/nextauthjs/next-auth/issues/8615) | closed | 2023-09-19 | Skip — closed >12 months. |

### 1.3 Repo-scoped: `expo/expo`, `supabase/supabase`, `googleapis/*`

| Issue | State | Last human comment | Recommendation |
|---|---|---|---|
| [expo/expo#12044 — "AuthSession returns dismiss result on Android standalone"](https://github.com/expo/expo/issues/12044) | open, 138 comments | 2025-08-15 (Jul1enF) | Skip — verified the tail of the thread: still open but quiet for ~13 months, and the recurring root cause (uppercase letters in the Android package name / URI scheme) is an Expo/Android intent-filter casing issue, not a Google Cloud Console redirect_uri config case — better fit for the Expo-specific sibling tool than this one. |
| [expo/expo#12808](https://github.com/expo/expo/issues/12808) | closed | 2025-07-21 | Skip — closed >12 months. |
| [expo/expo#32468](https://github.com/expo/expo/issues/32468) | closed | 2025-05-05 | Skip — closed >12 months. |
| [expo/expo#21944](https://github.com/expo/expo/issues/21944), [#22594](https://github.com/expo/expo/issues/22594), [#16220](https://github.com/expo/expo/issues/16220), [#18270](https://github.com/expo/expo/issues/18270), [#10860](https://github.com/expo/expo/issues/10860), [#4287](https://github.com/expo/expo/issues/4287), [#16650](https://github.com/expo/expo/issues/16650) | all closed | 2022–2025, all >12 months | Skip — closed and stale. |
| [supabase/supabase#36682](https://github.com/supabase/supabase/issues/36682) | closed | 2025-07-24 | Skip — closed >12 months. |
| [supabase/supabase#29763](https://github.com/supabase/supabase/issues/29763) | closed | 2025-07-06 | Skip — closed >12 months. |
| [supabase/supabase#4295](https://github.com/supabase/supabase/issues/4295) | closed | 2022-07-04 | Skip — closed >12 months. |
| [googleapis/google-auth-library-nodejs#662](https://github.com/googleapis/google-auth-library-nodejs/issues/662) | closed | 2020-12-08 | Skip — closed, ancient. |
| [googleapis/google-api-python-client#1852](https://github.com/googleapis/google-api-python-client/issues/1852), [#755](https://github.com/googleapis/google-api-python-client/issues/755), [#919](https://github.com/googleapis/google-api-python-client/issues/919), [#915](https://github.com/googleapis/google-api-python-client/issues/915) | all closed | 2021–2023 | Skip — closed >12 months. |

### 1.4 GitHub Discussions — `nextauthjs/next-auth`

GitHub Discussions don't show up in the Issues search API, so these were
found via the repo's own Discussions search (`?discussions_q=redirect_uri_mismatch`).

| Discussion | Status | Posted | Recommendation |
|---|---|---|---|
| [#13268 — "NextAuth redirect URI mismatch when using custom API path /api/v1/auth"](https://github.com/nextauthjs/next-auth/discussions/13268) | **unanswered**, 0 replies | 2025-10-04 | **Post** (see §2.1). Directly matches the tool's NextAuth custom-basePath check; genuinely unanswered after 11 months. |
| [#8449 — "AuthJS redirects to Docker container internal IP"](https://github.com/nextauthjs/next-auth/discussions/8449) | answered, 47 replies | 2023-08-28 | Skip — already thoroughly answered; a new comment would add nothing and the thread is old. |
| [#12160 — "Working universal solution for Auth v5 in dockerized Next.js with basePath"](https://github.com/nextauthjs/next-auth/discussions/12160) | unanswered, 5 replies | 2024-10-31 | Skip — has community replies already (title suggests a solution was posted); ~23 months old. |
| [#11742 — "Redirect uri mismatch in aws amplify"](https://github.com/nextauthjs/next-auth/discussions/11742) | unanswered, 2 replies | 2024-08-31 | Skip — already has replies; ~25 months old. |
| [#12358 — "How to redirect to a HTTPS callback URL?"](https://github.com/nextauthjs/next-auth/discussions/12358) | **unanswered**, 0 replies | 2024-12-08 | **Post** (see §2.2). Zero replies after ~21 months, and it's the exact http-vs-https-behind-a-reverse-proxy case the tool flags — worth answering regardless of age since it'll keep surfacing in search. |
| [#8657](https://github.com/nextauthjs/next-auth/discussions/8657) | unanswered, 0 replies | 2023-09-16 | Skip — same underlying case as GitHub issue #8615 above (already closed); over 3 years old and thin on detail. |
| [#8731 — "Make Provider OAuthCallbackError easier to debug"](https://github.com/nextauthjs/next-auth/discussions/8731) | idea, 0 replies | 2023-09-26 | Skip — a feature request to the Auth.js maintainers, not a spot for a third-party tool link. |
| [#6387](https://github.com/nextauthjs/next-auth/discussions/6387) | answered, 3 replies | 2023-01-13 | Skip — already answered, 3+ years old. |

**Stack Overflow:** could not be queried — both `stackoverflow.com` and the
Stack Exchange API (`api.stackexchange.com`) are blocked to this session's
fetcher (network/robots restriction on the fetching tool, not a missing
result). Andrej: check manually at
`https://stackoverflow.com/search?q=redirect_uri_mismatch&tab=Newest` for
anything to add — nothing from there is included below because it couldn't
be verified live.

---

## 2. Drafted replies (first person, as Andrej)

Post these only where the thread is still open for replies. Each ends with
exactly one sentence pointing at the tool.

### 2.1 → https://github.com/nextauthjs/next-auth/discussions/13268

> Hey — the config you've got (full path in `NEXTAUTH_URL` + `basePath` on `SessionProvider`) is exactly what the docs say to do, so on paper it's right. A few things I'd check before assuming NextAuth itself is broken, in order of how often this turns out to be it:
>
> 1. Is `NEXTAUTH_URL` actually set on the **Production** environment in Vercel, not just Preview/Development? Vercel scopes env vars per environment, and it's easy to add one, see it work on a preview deploy, and never notice it's missing from Production. `vercel env ls` shows you which environments each var is attached to.
> 2. If it is set on Production — did you trigger a fresh deploy *after* adding/changing it? I've seen serverless builds on a couple of hosts keep serving a stale bundle until a real redeploy runs.
> 3. Check there isn't a leftover route file still sitting at `app/api/auth/[...nextauth]/route.ts` from before you moved to the custom path. If both that file and your new `app/api/v1/auth/[...nextauth]/route.ts` exist, whichever one actually receives the request wins, and that looks identical to "NEXTAUTH_URL isn't working" until you go looking for it.
>
> If all three check out and it's still sending `/api/auth/callback/google` instead of `/api/v1/auth/callback/google`, that's a real bug worth its own issue with the (redacted) Vercel env var scope shown.
>
> I built a free client-side tool that diffs whatever redirect_uri your app actually sends against your Google Cloud Console entries byte-by-byte, which is handy for confirming exactly which layer is still wrong once you've ruled out the above: https://arling.sk/google-oauth-redirect-doctor/

### 2.2 → https://github.com/nextauthjs/next-auth/discussions/12358

> This is almost always a dropped `X-Forwarded-Proto` header between nginx and your app, not an Auth.js setting — when nginx terminates TLS and proxies to your app over plain HTTP without forwarding that Google callback ends up built as `http://` because that's genuinely what the request looked like by the time it reached your app.
>
> Two things worth checking: (1) confirm `proxy_set_header X-Forwarded-Proto https;` (or `$scheme` if nginx is the one terminating TLS) is actually present in the specific `location` block handling this route — a nested `location`/`proxy_pass` with its own `proxy_set_header` directives can silently drop headers set at the server level, so curl your own app directly and check what headers actually arrive; (2) make sure `NEXTAUTH_URL` itself is the `https://` version of your domain.
>
> Once it's forcing https, I built a free tool that diffs your callback URL byte-for-byte against what's registered in Google Cloud Console, handy for catching the next one of these fast: https://arling.sk/google-oauth-redirect-doctor/

### 2.3 → https://github.com/nextauthjs/next-auth/issues/10928

> For anyone landing here specifically from a Google `redirect_uri_mismatch` (rather than the general "redirected to the wrong URL" symptom): Auth.js building the callback as `localhost:3000` instead of your tunnel/Tailscale-funnel URL comes down to which host it decides to trust — by default it prefers `NEXTAUTH_URL`/`AUTH_URL` when set, and derives it from the incoming request otherwise, but a reverse proxy or tunnel in front of it can make that detection unreliable depending on which headers actually survive the hop. If you're on Auth.js v5, `AUTH_TRUST_HOST=true` is worth trying so it trusts the forwarded host instead of a fixed one.
>
> Separate from *why* it picks the wrong host: whatever URL it ends up sending, Google's own check is a dumb byte-for-byte string compare against your Authorized redirect URIs — no wildcards, and `localhost`, `127.0.0.1`, and your tunnel domain are three unrelated strings to it, not "close enough."
>
> I built a small free tool that takes the exact redirect_uri from Google's error page and diffs it against your Console entries so you can see precisely which character is different once you've narrowed down what Auth.js is actually sending: https://arling.sk/google-oauth-redirect-doctor/

---

## 3. Show HN

**Title:** Show HN: A free tool that diffs Google's redirect_uri_mismatch byte-by-byte

**Body:**

> Hi HN — every time I've wired up Google OAuth (NextAuth, Supabase, Firebase, whatever), I've hit "Error 400: redirect_uri_mismatch" at least once, and every single time the actual bug was one character: `www` vs. apex, a trailing slash, `localhost` vs. `127.0.0.1`, `http` where it should've been `https`. Google's error page doesn't tell you which — it just tells you it doesn't match.
>
> I built a small static tool for it: paste the `redirect_uri` from Google's error page, your Authorized redirect URIs from Cloud Console, and which stack you're on, and it computes what your stack *should* be sending and diffs it byte-by-byte against both, so you see the exact character that's wrong instead of squinting at two long URLs side by side.
>
> It's entirely client-side — one HTML file, one dependency-free JS file, no backend, no account, nothing you type leaves your browser (check the network tab, or just read the source, it's static files). Covers NextAuth/Auth.js, Supabase, Firebase, Passport, Django allauth, Laravel Socialite, `google-auth-oauthlib`, Expo, Flutter, Postman, and `gcloud`'s own quirks (its local OAuth callback listener runs on a fixed port, 8085 — cost me a genuinely embarrassing amount of time once).
>
> Free, no ads, source is on GitHub. Would love feedback, especially on stacks or edge cases it doesn't cover yet.
>
> https://arling.sk/google-oauth-redirect-doctor/

---

## 4. Reddit / Discord / forums

Generic English text — this is a global developer tool, not a Slovak or
accounting-domain product, so there's no Slovak-forum variant this time
(that clause only applies to SK-audience tools). Post to r/webdev, r/nextjs,
r/reactnative, r/Supabase, r/googlecloud, and the Auth.js / Supabase / Expo
Discord servers' help channels — **check each community's self-promotion
rules before posting** (several of these subreddits require a "Sunday
self-promo thread" or flair, and Discord servers often want tool shares in a
specific channel).

> **Built a free tool for Google's redirect_uri_mismatch error**
>
> If you've fought with Google OAuth's "Error 400: redirect_uri_mismatch" — the URL usually *looks* right until you stare at it for ten minutes and realize it's `www` vs. apex, or `http` vs. `https`, or a trailing slash — I made a small free checker: paste the `redirect_uri` from Google's error page + your Console's Authorized redirect URIs + your stack (NextAuth, Supabase, Firebase, Expo, Flutter, etc.), and it diffs them byte-by-byte and tells you exactly what's different and where to fix it (your code, or the Console).
>
> 100% client-side, no account, nothing leaves your browser — it's two static files, feel free to read the source.
>
> https://arling.sk/google-oauth-redirect-doctor/
>
> (Not selling anything — just a tool I wished existed the last few times I hit this.)

---

## 5. Article outline (dev.to)

**Working title:** *Google's redirect_uri_mismatch, byte by byte: the six differences that actually cause it*

1. **The hook** — the error message tells you nothing useful; here's what's actually different, ranked by how often each one is the real cause.
2. **What Google actually validates** — cite the official rule set: exact string match on scheme, host, port, path (case + trailing slash), no query string, no fragment, HTTPS everywhere except loopback, no raw IP hosts, no wildcards (link: `developers.google.com/identity/protocols/oauth2/web-server#uri-validation`).
3. **The six real-world causes, one code snippet each:**
   - `www` vs. apex domain
   - `localhost` vs. `127.0.0.1` (Google treats them as unrelated hosts)
   - Trailing slash / path letter-case
   - `http` vs. `https` behind a reverse proxy (missing `X-Forwarded-Proto`)
   - Provider's own callback vs. your app's URL (the Supabase/Firebase gotcha — Google talks to the provider first)
   - Custom scheme sent to a Web-application OAuth client instead of Android/iOS/Desktop
4. **Stack-by-stack cheat sheet** — one line each for NextAuth/Auth.js, Supabase, Firebase, Passport, django-allauth, Laravel Socialite, `google-auth-oauthlib`, Expo AuthSession, Flutter, Postman, `gcloud` — the exact expected `redirect_uri` pattern for each.
5. **The red herring** — "Testing" consent-screen status throwing `access_denied`, which looks related but isn't.
6. **A checklist you can run by hand** — or the free tool that automates the byte-diff (link at the end, not before).
7. **Sources** — link every official doc cited in step 2 and the cheat sheet, so the article holds up to scrutiny.
