// tests.mjs — plain Node test runner for doctor-google.js (no external dependencies).
// Run with: node tests.mjs

import { diagnose, expectedValues } from './doctor-google.js';

let pass = 0;
let fail = 0;
const failures = [];

function ok(name, cond, detail) {
  if (cond) {
    pass++;
  } else {
    fail++;
    failures.push(`${name}${detail ? ' — ' + detail : ''}`);
  }
}

function eq(name, actual, expected) {
  const condition = actual === expected;
  ok(name, condition, condition ? '' : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function has(name, arr, code) {
  const condition = Array.isArray(arr) && arr.some((p) => p.code === code);
  ok(name, condition, condition ? '' : `expected a problem with code "${code}", got codes [${(arr || []).map((p) => p.code).join(', ')}]`);
}

function lacks(name, arr, code) {
  const condition = Array.isArray(arr) && !arr.some((p) => p.code === code);
  ok(name, condition, condition ? '' : `did not expect a problem with code "${code}"`);
}

function severityOf(arr, code) {
  const p = (arr || []).find((x) => x.code === code);
  return p ? p.severity : undefined;
}

function messageOf(arr, code) {
  const p = (arr || []).find((x) => x.code === code);
  return p ? p.message : '';
}

// ─────────────────────────────────────────────────────────────────────────
// 1. expectedValues() — per-stack redirect_uri computation
//    (sources cited in doctor-google.js header)
// ─────────────────────────────────────────────────────────────────────────

eq('nextauth: origin -> /api/auth/callback/google',
  expectedValues({ app: { stack: 'nextauth', origin: 'https://myapp.com' } }).redirectUri,
  'https://myapp.com/api/auth/callback/google');

eq('nextauth: trailing slash on origin is stripped before appending path',
  expectedValues({ app: { stack: 'nextauth', origin: 'https://myapp.com/' } }).redirectUri,
  'https://myapp.com/api/auth/callback/google');

eq('authjs: same convention as nextauth',
  expectedValues({ app: { stack: 'authjs', origin: 'https://myapp.com' } }).redirectUri,
  'https://myapp.com/api/auth/callback/google');

eq('nextauth: no origin -> redirectUri null',
  expectedValues({ app: { stack: 'nextauth' } }).redirectUri, null);
eq('nextauth: no origin -> missingField is app.origin',
  expectedValues({ app: { stack: 'nextauth' } }).missingField, 'app.origin');

eq('nextauth: expected clientType is web',
  expectedValues({ app: { stack: 'nextauth', origin: 'https://myapp.com' } }).clientTypeExpected, 'web');

eq('supabase: ref -> <ref>.supabase.co/auth/v1/callback',
  expectedValues({ app: { stack: 'supabase', supabaseRef: 'abcd1234' } }).redirectUri,
  'https://abcd1234.supabase.co/auth/v1/callback');

eq('supabase: missing ref -> missingField is app.supabaseRef',
  expectedValues({ app: { stack: 'supabase' } }).missingField, 'app.supabaseRef');

eq('firebase: authDomain -> /__/auth/handler',
  expectedValues({ app: { stack: 'firebase', firebaseAuthDomain: 'myapp.firebaseapp.com' } }).redirectUri,
  'https://myapp.firebaseapp.com/__/auth/handler');

eq('firebase: missing authDomain -> missingField is app.firebaseAuthDomain',
  expectedValues({ app: { stack: 'firebase' } }).missingField, 'app.firebaseAuthDomain');

eq('passport: absolute callbackURL used verbatim (trailing slash stripped)',
  expectedValues({ app: { stack: 'passport', callbackPath: 'https://myapp.com/auth/google/callback/' } }).redirectUri,
  'https://myapp.com/auth/google/callback');

eq('passport: relative callbackPath resolved against origin',
  expectedValues({ app: { stack: 'passport', origin: 'https://myapp.com', callbackPath: '/auth/google/callback' } }).redirectUri,
  'https://myapp.com/auth/google/callback');

eq('passport: relative callbackPath without leading slash still resolves',
  expectedValues({ app: { stack: 'passport', origin: 'https://myapp.com', callbackPath: 'auth/google/callback' } }).redirectUri,
  'https://myapp.com/auth/google/callback');

eq('passport: neither origin nor callbackPath -> missingField is app.origin',
  expectedValues({ app: { stack: 'passport' } }).missingField, 'app.origin');

eq('passport: origin present but callbackPath empty -> missingField is app.callbackPath',
  expectedValues({ app: { stack: 'passport', origin: 'https://myapp.com' } }).missingField, 'app.callbackPath');

eq('django-allauth: fixed path with trailing slash',
  expectedValues({ app: { stack: 'django-allauth', origin: 'https://myapp.com' } }).redirectUri,
  'https://myapp.com/accounts/google/login/callback/');

eq('laravel-socialite: relative redirect resolved against origin',
  expectedValues({ app: { stack: 'laravel-socialite', origin: 'https://myapp.com', callbackPath: '/auth/google/callback' } }).redirectUri,
  'https://myapp.com/auth/google/callback');

eq('python-oauthlib: explicit port',
  expectedValues({ app: { stack: 'python-oauthlib', port: 54321 } }).redirectUri,
  'http://localhost:54321/');

eq('python-oauthlib: no port -> literal PORT placeholder',
  expectedValues({ app: { stack: 'python-oauthlib' } }).redirectUri,
  'http://localhost:PORT/');

eq('python-oauthlib: expected client type is desktop',
  expectedValues({ app: { stack: 'python-oauthlib', port: 1 } }).clientTypeExpected, 'desktop');

eq('expo-authsession + proxy: @username/slug',
  expectedValues({ app: { stack: 'expo-authsession', useProxy: true, expoUsername: '@janedoe', expoSlug: 'my-app' } }).redirectUri,
  'https://auth.expo.io/@janedoe/my-app');

eq('expo-authsession + proxy, missing username -> missingField is app.expoUsername',
  expectedValues({ app: { stack: 'expo-authsession', useProxy: true, expoSlug: 'my-app' } }).missingField,
  'app.expoUsername');

eq('expo-authsession + proxy, missing slug -> missingField is app.expoSlug',
  expectedValues({ app: { stack: 'expo-authsession', useProxy: true, expoUsername: 'janedoe' } }).missingField,
  'app.expoSlug');

eq('expo-authsession without proxy -> redirectUri is null (custom scheme, computed client-side)',
  expectedValues({ app: { stack: 'expo-authsession', useProxy: false } }).redirectUri, null);

eq('expo-authsession without proxy -> expects android/ios client',
  expectedValues({ app: { stack: 'expo-authsession', useProxy: false } }).clientTypeExpected, 'android/ios');

eq('flutter: no redirect_uri in this flow at all',
  expectedValues({ app: { stack: 'flutter' } }).redirectUri, null);

eq('flutter: expects android/ios client (never Web)',
  expectedValues({ app: { stack: 'flutter' } }).clientTypeExpected, 'android/ios');

eq('postman: current default is oauth.pstmn.io/v1/browser-callback',
  expectedValues({ app: { stack: 'postman', callbackPath: 'https://oauth.pstmn.io/v1/browser-callback' } }).redirectUri,
  'https://oauth.pstmn.io/v1/browser-callback');

eq('gcloud: default well-known port 8085',
  expectedValues({ app: { stack: 'gcloud' } }).redirectUri, 'http://localhost:8085/');

eq('gcloud: custom port overrides default',
  expectedValues({ app: { stack: 'gcloud', port: 9999 } }).redirectUri, 'http://localhost:9999/');

eq('unrecognized stack falls back to custom/blank behaviour',
  expectedValues({ app: { stack: 'some-made-up-framework', origin: 'https://myapp.com', callbackPath: '/cb' } }).redirectUri,
  'https://myapp.com/cb');

eq('expectedValues(undefined) does not throw and returns a stack of ""',
  expectedValues(undefined).stack, '');

// ─────────────────────────────────────────────────────────────────────────
// 2. diagnose() — structural problems with the reported redirect_uri
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({});
  has('empty config: flags missing redirectUriFromError', r.problems, 'redirect_uri_from_error_missing');
  eq('empty config: severity is medium', severityOf(r.problems, 'redirect_uri_from_error_missing'), 'medium');
  eq('empty config: status is warn (no high-severity problems)', r.status, 'warn');
}

{
  const r = diagnose(undefined);
  ok('diagnose(undefined) does not throw and returns a status', typeof r.status === 'string');
}

{
  const r = diagnose({ error: null, console: null, app: null });
  ok('diagnose with all-null sections does not throw', typeof r.status === 'string');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'https://myapp.com/api/auth /callback/google' } });
  has('mid-string space: flags invisible_or_whitespace_character', r.problems, 'invisible_or_whitespace_character');
  eq('mid-string space: severity is high', severityOf(r.problems, 'invisible_or_whitespace_character'), 'high');
  ok('mid-string space: message calls it a space character', /a space character/.test(messageOf(r.problems, 'invisible_or_whitespace_character')));
}

{
  const withZwsp = 'https://myapp.com/api​/auth/callback/google';
  const r = diagnose({ error: { redirectUriFromError: withZwsp } });
  has('zero-width space: flags invisible_or_whitespace_character', r.problems, 'invisible_or_whitespace_character');
  ok('zero-width space: message names the codepoint U+200B', /U\+200B/.test(messageOf(r.problems, 'invisible_or_whitespace_character')));
}

{
  const r = diagnose({ error: { redirectUriFromError: 'https://myapp.com/callback?code=abc' } });
  has('query string in error URI is flagged', r.problems, 'query_string_present');
  eq('query string severity is high', severityOf(r.problems, 'query_string_present'), 'high');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'https://myapp.com/callback#token=xyz' } });
  has('fragment in error URI is flagged', r.problems, 'fragment_present');
  eq('fragment severity is high', severityOf(r.problems, 'fragment_present'), 'high');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'http://8.8.8.8/callback' } });
  has('raw non-loopback IP host is flagged', r.problems, 'raw_ip_not_allowed');
  has('raw IP + http also flags http_not_https', r.problems, 'http_not_https');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'http://myapp.com/callback' } });
  has('plain http on a real host is flagged', r.problems, 'http_not_https');
  eq('http_not_https severity is high', severityOf(r.problems, 'http_not_https'), 'high');
  const fix = r.fixes.find((f) => f.title.toLowerCase().includes('https instead of http'));
  ok('http_not_https: a fix offers the https-swapped value', !!fix && fix.value === 'https://myapp.com/callback');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'http://localhost:3000/callback' } });
  lacks('http on localhost is exempt from the https requirement', r.problems, 'http_not_https');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'myapp://callback', clientType: 'web' } });
  has('custom scheme + Web client type is flagged', r.problems, 'custom_scheme_wrong_client_type');
  eq('custom_scheme_wrong_client_type severity is high', severityOf(r.problems, 'custom_scheme_wrong_client_type'), 'high');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'myapp://callback', clientType: 'android' } });
  lacks('custom scheme + Android client type is fine', r.problems, 'custom_scheme_wrong_client_type');
}

// ─────────────────────────────────────────────────────────────────────────
// 3. diagnose() — computed expected value vs. what Google actually saw
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({
    error: { redirectUriFromError: 'http://myapp.com/api/auth/callback/google' },
    app: { stack: 'nextauth', origin: 'https://myapp.com' },
  });
  has('nextauth scheme mismatch is flagged as a code-side mismatch', r.problems, 'redirect_uri_code_mismatch');
  eq('redirect_uri_code_mismatch severity is high', severityOf(r.problems, 'redirect_uri_code_mismatch'), 'high');
  const fix = r.fixes.find((f) => f.title.includes('Fix the redirect_uri your code sends'));
  ok('a fix suggests the exact expected value', !!fix && fix.value === 'https://myapp.com/api/auth/callback/google');
}

{
  // Signature check: Supabase/Firebase redirect_uri must be the *provider's*
  // callback, never the app's own origin.
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/auth/v1/callback' },
    app: { stack: 'supabase', origin: 'https://myapp.com', supabaseRef: 'abcd1234' },
  });
  has('supabase redirect pointing at the app itself is flagged specially', r.problems, 'redirect_points_to_app_not_provider');
  ok('message names Supabase as the actual target', /Supabase/.test(messageOf(r.problems, 'redirect_points_to_app_not_provider')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/callback' },
    app: { stack: 'firebase', origin: 'https://myapp.com', firebaseAuthDomain: 'myapp.firebaseapp.com' },
  });
  has('firebase redirect pointing at the app itself is flagged specially', r.problems, 'redirect_points_to_app_not_provider');
  ok('message names Firebase as the actual target', /Firebase/.test(messageOf(r.problems, 'redirect_points_to_app_not_provider')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/api/auth/callback/google' },
    app: { stack: 'nextauth' }, // no origin -> can't compute expected value at all
  });
  has('incomplete app config (no origin) is flagged as low-severity info', r.problems, 'expected_value_incomplete');
  eq('expected_value_incomplete severity is low', severityOf(r.problems, 'expected_value_incomplete'), 'low');
  eq('expected_value_incomplete points at the missing field', r.problems.find((p) => p.code === 'expected_value_incomplete').path, 'app.origin');
}

// ─────────────────────────────────────────────────────────────────────────
// 4. diagnose() — client type vs. what the stack actually needs
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({
    error: { redirectUriFromError: 'http://localhost:8085/', clientType: 'web' },
    app: { stack: 'python-oauthlib', port: 8085 },
  });
  has('Desktop-only flow used with a Web client is flagged', r.problems, 'client_type_mismatch');
  eq('desktop-required mismatch is high severity', severityOf(r.problems, 'client_type_mismatch'), 'high');
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://example.com/', clientType: 'web' },
    app: { stack: 'flutter' },
  });
  has('Flutter (android/ios-only) used with a Web client is flagged', r.problems, 'client_type_mismatch');
  eq('android/ios-required mismatch is high severity', severityOf(r.problems, 'client_type_mismatch'), 'high');
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/api/auth/callback/google', clientType: 'desktop' },
    app: { stack: 'nextauth', origin: 'https://myapp.com' },
  });
  has('Web-only flow used with a Desktop client is flagged', r.problems, 'client_type_mismatch');
  eq('web-required mismatch (not desktop/android/ios) is medium severity', severityOf(r.problems, 'client_type_mismatch'), 'medium');
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/api/auth/callback/google', clientType: 'web' },
    app: { stack: 'nextauth', origin: 'https://myapp.com' },
  });
  lacks('matching client type is not flagged', r.problems, 'client_type_mismatch');
}

// ─────────────────────────────────────────────────────────────────────────
// 5. diagnose() — Authorized redirect URIs allow-list membership + diffs
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/callback' },
    console: { authorizedRedirectUris: ['https://myapp.com/callback/'] },
  });
  has('trailing-slash-only console entry is not an exact match', r.problems, 'redirect_uri_not_in_console');
  ok('closest-match message calls out the trailing slash', /trailing slash/i.test(messageOf(r.problems, 'redirect_uri_not_in_console')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://www.myapp.com/callback' },
    console: { authorizedRedirectUris: ['https://myapp.com/callback'] },
  });
  ok('closest-match message calls out a www vs apex mismatch', /www/i.test(messageOf(r.problems, 'redirect_uri_not_in_console')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'http://localhost:3000/callback' },
    console: { authorizedRedirectUris: ['http://127.0.0.1:3000/callback'] },
  });
  ok('closest-match message calls out localhost vs 127.0.0.1', /localhost and 127\.0\.0\.1/.test(messageOf(r.problems, 'redirect_uri_not_in_console')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/Callback' },
    console: { authorizedRedirectUris: ['https://myapp.com/callback'] },
  });
  ok('closest-match message calls out a path case difference', /different letter case/i.test(messageOf(r.problems, 'redirect_uri_not_in_console')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/callback' },
    console: { authorizedRedirectUris: [] },
  });
  ok('empty console list: message says none of the entries are close', /none of your existing entries are close/i.test(messageOf(r.problems, 'redirect_uri_not_in_console')));
}

{
  const r = diagnose({
    error: { redirectUriFromError: '  https://myapp.com/callback  ' },
    console: { authorizedRedirectUris: ['https://myapp.com/callback'] },
  });
  lacks('surrounding whitespace on the pasted error URI does not break an exact match', r.problems, 'redirect_uri_not_in_console');
}

// ─────────────────────────────────────────────────────────────────────────
// 6. diagnose() — preview deployments, JS origins, testing status, timing
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp-git-feat.vercel.app/callback' },
    app: { env: 'preview' },
  });
  has('preview env flags the no-wildcard warning', r.problems, 'preview_url_no_wildcard');
  eq('preview_url_no_wildcard severity is medium', severityOf(r.problems, 'preview_url_no_wildcard'), 'medium');
  ok('vercel.app host gets the per-preview-URL callout', /vercel/i.test(messageOf(r.problems, 'preview_url_no_wildcard')));
}

{
  const r = diagnose({ app: { env: 'production' } });
  lacks('production env does not trigger the preview warning', r.problems, 'preview_url_no_wildcard');
}

{
  const r = diagnose({
    app: { origin: 'https://myapp.com' },
    console: { authorizedJsOrigins: ['https://other.com'] },
  });
  has('app origin missing from Authorized JS origins is flagged', r.problems, 'js_origin_missing');
  eq('js_origin_missing severity is medium', severityOf(r.problems, 'js_origin_missing'), 'medium');
}

{
  const r = diagnose({
    app: { origin: 'https://myapp.com' },
    console: { authorizedJsOrigins: ['https://myapp.com'] },
  });
  lacks('app origin present in Authorized JS origins is not flagged', r.problems, 'js_origin_missing');
}

{
  const r = diagnose({ app: { origin: 'https://myapp.com' }, console: { authorizedJsOrigins: [] } });
  lacks('an empty JS-origins list is not treated as "missing" (nothing to compare against yet)', r.problems, 'js_origin_missing');
}

{
  const r = diagnose({ console: { publishingStatus: 'testing' } });
  has('Testing publishing status surfaces the access_denied hint', r.problems, 'testing_status_hint');
  eq('testing_status_hint severity is low', severityOf(r.problems, 'testing_status_hint'), 'low');
}

{
  const r = diagnose({ console: { publishingStatus: 'production' } });
  lacks('In-production status does not surface the hint', r.problems, 'testing_status_hint');
}

{
  const r = diagnose({ console: { savedMinutesAgo: 0 } });
  has('saved 0 minutes ago triggers the propagation-delay hint', r.problems, 'recent_change_propagation_delay');
}
{
  const r = diagnose({ console: { savedMinutesAgo: 4 } });
  has('saved 4 minutes ago triggers the propagation-delay hint', r.problems, 'recent_change_propagation_delay');
  eq('recent_change_propagation_delay severity is low', severityOf(r.problems, 'recent_change_propagation_delay'), 'low');
}
{
  const r = diagnose({ console: { savedMinutesAgo: 5 } });
  lacks('saved 5+ minutes ago does not trigger the hint', r.problems, 'recent_change_propagation_delay');
}
{
  const r = diagnose({ console: { savedMinutesAgo: null } });
  lacks('no savedMinutesAgo value does not trigger the hint', r.problems, 'recent_change_propagation_delay');
}
{
  const r = diagnose({ console: { savedMinutesAgo: -1 } });
  lacks('a negative savedMinutesAgo does not trigger the hint', r.problems, 'recent_change_propagation_delay');
}

// ─────────────────────────────────────────────────────────────────────────
// 7. diagnose() — overall status + summary
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/api/auth/callback/google', clientType: 'web' },
    console: {
      authorizedRedirectUris: ['https://myapp.com/api/auth/callback/google'],
      authorizedJsOrigins: ['https://myapp.com'],
      publishingStatus: 'production',
    },
    app: { stack: 'nextauth', origin: 'https://myapp.com' },
  });
  eq('everything matching exactly yields status "pass"', r.status, 'pass');
  ok('pass summary says no mismatches found', /No mismatches found/.test(r.summary));
  eq('a passing diagnosis reports zero problems', r.problems.length, 0);
}

{
  const r = diagnose({ console: { publishingStatus: 'testing', savedMinutesAgo: 2 } });
  eq('only low/medium findings yield status "warn"', r.status, 'warn');
}

{
  const r = diagnose({ error: { redirectUriFromError: 'https://myapp.com/callback?x=1' } });
  eq('any high-severity finding yields status "fail"', r.status, 'fail');
  ok('fail summary names the most urgent problem', /blocking mismatch/.test(r.summary));
}

{
  // Multiple independent high-severity problems still collapse to one "fail".
  const r = diagnose({
    error: { redirectUriFromError: 'http://8.8.8.8/callback?x=1#y', clientType: 'web' },
  });
  eq('several high problems at once still yield a single "fail" status', r.status, 'fail');
  ok('several high-severity codes are all present', ['raw_ip_not_allowed', 'http_not_https', 'query_string_present', 'fragment_present'].every((c) => r.problems.some((p) => p.code === c)));
}

// ─────────────────────────────────────────────────────────────────────────
// 8. diagnose() — checklist is always populated, always mentions the target
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({});
  ok('checklist has generic guidance even with no input at all', r.checklist.length >= 3);
}

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/api/auth/callback/google' },
    app: { stack: 'nextauth', origin: 'https://myapp.com' },
  });
  ok('checklist names the exact value to register once it is known', r.checklist.some((c) => c.includes('https://myapp.com/api/auth/callback/google')));
}

// ─────────────────────────────────────────────────────────────────────────
// 9. sortProblems() — high severity always sorts first regardless of push order
// ─────────────────────────────────────────────────────────────────────────

{
  const r = diagnose({
    error: { redirectUriFromError: 'https://myapp.com/callback?x=1' }, // high, pushed early
    console: { publishingStatus: 'testing' }, // low, pushed late
  });
  eq('sorted problems: first entry is high severity', r.problems[0].severity, 'high');
  eq('sorted problems: last entry is low severity', r.problems[r.problems.length - 1].severity, 'low');
}

// ─────────────────────────────────────────────────────────────────────────

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
} else {
  console.log('All tests passed.');
}
