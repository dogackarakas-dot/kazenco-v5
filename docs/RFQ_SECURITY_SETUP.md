# RFQ security preparation

Status: local implementation and protected preview; Upstash provisioning and Vercel project connection
completed with user approval on 2026-10-13. Preview deployment was authorized
and created from the local source snapshot without Git commits or pushes.
No production deployment or firewall change was made. Separately approved
real email and private Blob attachment tests have now passed on the preview.
The real REST adapter passed budget concurrency,
multi-key denial, one-time claims and expiry checks. Preview validation evidence
and the remaining release gates are recorded below.

`kazenco-rfq-security` uses the Free plan, primary region `iad1`, no read regions,
and eviction disabled. Vercel created sensitive `KV_REST_API_URL` and
`KV_REST_API_TOKEN` variables for Production and Preview. These values cannot
be pulled locally as ordinary readable environment variables. No credentials
were displayed in tool outputs or copied into the repository. A temporary
0600 connection file outside the repository was used for real-backend tests and
removed immediately afterward; the dashboard secrets were hidden again.

## Shared storage contract

`src/lib/rfq-security-store.ts` defines `RfqSecurityStore`. The admission logic
depends on this interface rather than a selected account or provider.

- `consume` must atomically check **all** supplied budgets and increment them
  only when all allow the request. Counters expire after the first accepted use;
  rejected requests must not extend the window.
- `setOnce` must be atomic across server instances, with an expiry.
- `get` must return the saved value or null after expiry.
- Backend errors must fail closed. Never substitute an in-memory counter in
  production or allow protected operations when the store is unavailable.

An HTTPS Redis REST adapter is included. It accepts a complete
`RFQ_REDIS_REST_URL` / `RFQ_REDIS_REST_TOKEN` pair, or otherwise the Vercel-provided
`KV_REST_API_URL` / `KV_REST_API_TOKEN` pair. A partially configured RFQ override
fails closed instead of mixing credentials. No new package dependency was added.
The connection is available to the protected preview; production deployments
have not been updated.

## Protected preview validation on 2026-10-13

Source snapshot: tracked site source/assets/configuration plus the four new RFQ
runtime modules. Existing untracked product images, local secrets, agent files
and Git history were excluded. No branch or worktree was created.

Initial preview `kazenco-626t32jcn-dk-4bc8.vercel.app` built successfully on
Vercel with Next.js 16.3.0/Turbopack, Node 24, region `iad1`.
Its real API returned:

- GET `/api/rfq`: 200, `available: true`.
- Invalid file count, individual size and combined size: 400.
- Valid planned session and first upload token: 200; no file uploaded.
- Repeated upload token: 429.
- Unplanned path and multipart request: 400.
- Sessionless submission and invalid optional field: 400 before mail delivery.
- Ten accepted session creations from the test client; the next returned 429.

The rate-limit test consumes the preview client session window (up to one hour).
The same Redis database is shared with production but keys use separate
environment namespaces. No production RFQ counters were intentionally tested.
The RFQ form opened in all four locales in the authenticated Chrome browser.
Successful mail delivery, uploaded Blob metadata/signing and displayed 429
messages against live backend responses remain outside these checks.

The initial preview robots response allowed crawling because the existing
`KAZENCO_PREVIEW` flag was absent. A replacement preview was built with
`KAZENCO_PREVIEW=1` supplied at build and runtime for that deployment only.
Production project settings and source SEO rules were not changed.

Active replacement preview:
[kazenco-7z3zoojm0-dk-4bc8.vercel.app](https://kazenco-7z3zoojm0-dk-4bc8.vercel.app/tr/contact),
deployment `dpl_CWXdfv1K7eA4yRs4rjcz7WhBJMFA`, status READY, CLI preview target.
It compiled successfully on Vercel; GET `/api/rfq` remained available, robots
returned `Disallow: /`, and the contact response included
`X-Robots-Tag: noindex, nofollow, noarchive`. The Turkish RFQ form opened.
The backend rejection matrix above was run on the initial same-source preview,
not repeated on the replacement; only the preview SEO flag changed.
Approved successful delivery and attachment verification are recorded below.

## Approved real email attempt

The user approved a file-free test to `info@kazenco.com`, with acknowledgment
to the user's supplied address. The first browser attempt was blocked by the
preview session budget (429), and its Turkish alert was verified.
With separate user approval, the exact test-only client counter
`kazenco:rfq:preview:sessions:client:3fb27ab76a662f0a83ae990810b15c81abf27abd6c4a2e1c041bfecfc723c3cd`
was atomically changed from 10 to 0 only if it still equaled 10. Its expiry was
retained; no other counters or production keys were changed. The temporary
0600 access file was removed after the operation.

The next browser attempt returned GET 200, session POST 200, RFQ POST 502.
Vercel runtime request `5lvnx-1791846886807-7c2fa7e793e3` confirms the 502;
the route uses that status when the internal Resend send returns an error,
before acknowledgment is attempted. The UI fell back to its manual email flow.
That attempt did not establish delivery and uploaded no file. Authenticated
Resend log `24902d7b-7fe0-417f-9498-0733e2777e39` subsequently identified the
cause: POST `/emails` returned 403 because `kazenco.com` was not verified.
No new source change, commit, push or deployment was made for this attempt.

## Approved DNS setup and successful delivery

With explicit user approval, three records were added in the authoritative
Cloudflare zone on 2026-10-13. The existing 13 records, including Google root
MX/SPF and website records, were preserved; the zone now has 16 records.
Before adding them, neither `send` nor `resend._domainkey` existed, and there
was no `_dmarc` record. No DMARC or receiving configuration was added.

- TXT `resend._domainkey`: exact public DKIM key from the existing Resend domain.
- MX `send`: `feedback-smtp.eu-west-1.amazonses.com`, priority 10.
- TXT `send`: `v=spf1 include:amazonses.com ~all`.

All three use Auto TTL and DNS-only handling. Resend verification was started;
the domain became **Verified**. The approved file-free browser retry returned
the displayed reference `KZ-RFQ-20261013-7347D3`. Both the internal message to
`info@kazenco.com` and acknowledgment to `dogackarakas@doka.com.tr` showed
**Delivered** in Resend. This means recipient mail servers accepted them;
inbox placement or human reading was not independently inspected.

## Approved real attachment test

The user explicitly approved uploading `kazenco-rfq-upload-test.csv` (122 bytes)
to the real Blob store and sending the test to the same two recipients.
The file contains only dummy test text. After the user enabled Chrome extension
file access, it was selected in the BOQ section and submitted once through the
active protected preview. The form displayed **Talep alındı** with reference
`KZ-RFQ-20261013-CC99F1`. Both messages showed **Delivered** in Resend:

- Internal email: `01a1347c-fafe-7808-a963-9c8d1aa8f01b`.
- Acknowledgment: `01a1347c-fb4a-7f2a-a478-699a26cccd6b`.

The internal email contained the filename and a private signed link valid for
7 days. The deployed submission route checks Blob `head()` pathname, size and
URL before signing; successful completion therefore exercised that check for
this file. No independent dashboard metadata inspection was performed.

The browser download-event listener timed out after clicking the link. A direct
HTTP verification of the exact email link then returned 200, `text/csv`, 122
bytes, with a SHA-256 digest identical to the source file. Removing both signing
query parameters returned **403**. Signed-link expiry after 7 days was not
elapsed/tested. The temporary 0600 URL file was removed immediately; no signed
URL or token is stored in this document or repository.

The test Blob remains at:
`rfq/1f45333a-71a1-40c3-b46b-afb59047e85c/4af740dd-b2a3-4757-a393-dc04f10942b0-kazenco-rfq-upload-test.csv`.
It was not deleted; retention/cleanup still requires a reviewed policy.
Only this setup document was updated during the service verification phase.
No application source edit, staging, commit, push or additional deployment
was performed. Local build/lint/unit tests were not rerun for this documentation
update; the live service checks above were the relevant validation.

The optional adapter uses atomic Redis Lua evaluation and `SET ... EX ... NX`.
Reference: [Redis REST API](https://upstash.com/docs/redis/features/restapi).
The Lua operation was exercised against this connected Upstash service:
20 concurrent budget requests admitted exactly 3; a denied multi-key request
left the second key untouched; 20 concurrent `SET NX EX` requests admitted
exactly 1; records expired, and a denied budget request did not extend expiry.
Tests used a unique verification namespace with keys expiring within 60 seconds.
These are REST adapter checks, not deployed RFQ or provider-failover tests.

## Provisional limits to review before activation

These are protective starting values, not measurements of company traffic.
Counters use windows starting with the first accepted request, not calendar days.

With user approval, the local global submission limit was reduced from 100 to
40 per 24 hours on 2026-10-13, allowing at most 80 mail attempts and leaving
headroom below the current Resend Free account's 100 emails/day. Other senders
using that account can consume the remaining quota; monthly quota still needs
monitoring. The active preview and production have not been redeployed with
this limit change. The regression test admits 40 requests, rejects the 41st,
and verifies renewal after 24 hours without prolonging the window on rejection.
All 56 local tests, typecheck, scoped ESLint and diff checks passed. A full build
was not repeated for this numeric admission-limit change.

| Operation | Limit |
| --- | --- |
| RFQ sessions per client | 10 per hour |
| RFQ sessions overall | 200 per 24 hours |
| Reserved upload bytes per environment | 128 MiB per 24 hours |
| Reserved upload bytes across Preview + Production | 750 MiB total; persistent until separately reviewed |
| RFQ submissions per client | 5 per 10 minutes |
| RFQ submissions per recipient | 3 per hour |
| RFQ submissions overall | 40 per 24 hours; up to 80 messages |
| Session lifetime | 30 minutes |
| Attachment plan | 8 files, 15 MiB each, 40 MiB combined |
| Request JSON | 64 KiB, enforced while reading the body |

On Vercel, client budgets use its `x-vercel-forwarded-for` header. Outside Vercel,
requests share one client bucket rather than trusting caller-supplied forwarding
headers. A different trusted proxy requires a separately verified identity
adapter before production use. Corporate NATs may also need adjusted client caps.
[Vercel request headers](https://vercel.com/docs/headers/request-headers).

## Upload and submission lifecycle

The browser first requests a session with the complete attachment manifest.
The server validates aggregate size and count before generating unique paths.
Each path belongs to that session and receives one token for its declared size.
Random suffix generation and overwrites are disabled. The client uses direct
uploads, with explicit 429 handling; multipart token requests are rejected.

Final submission requires the session, matching names, sizes and paths, and
trusted Blob metadata before private download links are signed. A submission is
claimed once before delivery. Resend calls have distinct idempotency keys.
If an upload or dispatch fails after its reservation, that reservation is not
released automatically: the manual email fallback remains available. A fresh
attempt requires a fresh session and consumes its applicable budgets.

## Activation gates and remaining limits

Do not deploy this preparation without reviewing the following:

1. Select and connect the shared backend, with distinct production/preview
   namespaces; keep its credentials server-side. The optional adapter already
   namespaces keys by Vercel environment. Upstash is connected; currently both
   environments share one database and credential pair. Separate database
   credentials are preferable for stronger preview isolation before release.
2. Verify atomic budgets, cross-instance duplicate rejection and expiry against
   that backend; tune the provisional caps for legitimate traffic. The concurrent
   REST adapter tests passed; cross-instance deployed RFQ tests remain pending.
3. Run a protected preview with the selected backend and approved service test
   credentials. The current route tests mock mail and storage access; local SDK
   upload-token signing uses intentionally invalid credentials and no network.
4. Establish an orphan/multipart retention policy in Blob. This patch bounds
   new reservations but **does not delete** abandoned files or existing blobs.
   Replayed client tokens and abandoned multipart uploads require provider-side
   lifecycle/quota checks as well; rejection of multipart token requests is not
   a provider-enforced multipart prohibition inside an existing client token.
5. Review the Vercel firewall and provider spending limits. The active-firewall
   read returned 404; this does not establish absence of platform DDoS protection.

### Temporary Hobby quota preparation (local code, not deployed)

The user chose to remain on Hobby temporarily on 2026-10-13. No paid plan,
payment, or spending-setting change was made. The team contains both KAZENCO
and DOKA. The dashboard shows no team budget and Add Budget is disabled on
Hobby. Platform DDoS mitigations are active, with zero custom rules and Bot
Protection off. This preserves the user's decision; it does not resolve Hobby's
published non-commercial-use restriction.

Hobby Blob includes 1 GB-month average storage, 10 GB transfer, 2,000 advanced
operations, and 10,000 simple operations. Storage average shown on the Usage
page is not a live inventory. Quota exhaustion can interrupt service without
creating an overage bill. [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing).

The previous 1 GiB/day RFQ byte reservation was reduced to 128 MiB/day per
environment. A new 750 MiB **persistent** upload reservation is shared between
Preview and Production because they share physical storage and Redis. It uses
`kazenco:rfq:shared:uploads:bytes:store` and `seconds: 0`; the adapter leaves it
without expiry. Daily/session/mail counters keep their ordinary expiry and
environment isolation. All admission budgets are evaluated together atomically.
Both reserved-byte ceilings -- the 128 MiB/day per-environment reservation and
the 750 MiB shared total -- are marked `capacity: true` in the budget contract
and fail the same way: file-free sessions can still proceed, and an attachment
session is rejected with 503 before token generation, without a misleading
timed retry. The existing client already treats any non-429 failure on session
creation as a reason to open its pre-filled manual email fallback, so this
reaches the customer automatically and keeps their typed-in form content.
Request-rate budgets (session and mail counts, none marked `capacity`) are a
separate concern and keep the existing four-language 429 handling with its
fixed 10-minute `Retry-After`. That header is exact only for the shortest,
truly per-caller budgets (`sessions:client`, `mail:client`, both well under an
hour); it is optimistic for `mail:recipient` (1 hour, shared by every sender
to that one address). `sessions:global` and `mail:global` are different from
those three: they are environment-wide daily counters (200/day and 40/day),
shared by every caller, not per-client -- waiting and retrying does not help
once either is exhausted, since the whole environment has to wait for its own
24-hour window, exactly like the two byte ceilings above. They stay on the
plain 429 path regardless, not because of that shared/global scope, but
because this fix's line is reserved resource capacity (bytes) versus
request-rate limits (counts): `sessions:global`/`mail:global` count requests,
not bytes, so they are rate limits despite being global, and keep the ordinary
429 handling. Per-file/per-request limits remain.

**2026-10-13 correction:** a prior review found that only the 750 MiB shared
ceiling got this 503 treatment; the 128 MiB/day per-environment ceiling fell
through the generic 429 path, which carries a flat 10-minute `Retry-After`
despite its real 24-hour reset, and the client's 429 handling does not open
the email fallback or retain the customer's form content. `RfqBudget` gained
an explicit `capacity` flag (`src/lib/rfq-security-store.ts`) so
`consumeBudgets` (`src/lib/rfq-security.ts`) checks every capacity-marked
budget, not only the one with `seconds === 0`, before choosing 503 over 429.
The regression test for this ceiling now asserts 503 with no `Retry-After`
and that a file-free session is still admitted while it is exhausted
(`tests/rfq-validation.test.mjs`). All 58 local RFQ tests, typecheck and
scoped ESLint on the three changed files passed. No real backend, preview or
production deployment was exercised during that local correction phase; it had
not been committed. Subsequent preview verification is recorded below.

**Subsequent preview of the capacity correction — 2026-10-13:** deployment
`dpl_79GNqTbqNybHuiWjeKhy41oBKA9N` is READY at
<https://kazenco-jahy7tslm-dk-4bc8.vercel.app>. Vercel confirmed Authentication
protection, `target: null`, and `productionUrl: null`. The build and type check
passed. Eleven live checks passed: availability, excessive file count,
per-file/aggregate limits, file-free session admission, malformed submission
rejection before email, robots/noindex, and contact-page rendering in four
languages. One normal preview session was consumed, with zero attachment bytes.
No real email or Blob upload was performed, and shared capacity counters were
not filled or reset. Capacity-exhaustion 503 behavior was verified locally in
the 58-test suite, not by exhausting the live store. No commit, push or
production release occurred; the nine unrelated untracked product images were
excluded from the plain temporary source snapshot.

**Staged production build — 2026-10-13:** with the user's approval to prepare
production without connecting company domains, the same source snapshot was
deployed using `--prod --skip-domain`, without the preview-only environment
override. Deployment `dpl_F1rGCbmi4yxN12acxgLSMMqXMWRk` is READY at
<https://kazenco-myo02wozk-dk-4bc8.vercel.app>; build/type validation passed.
The deployment API lists only `kazenco-dk-4bc8.vercel.app` as its alias despite
`--skip-domain`; neither company domain is assigned to this deployment.
Vercel Authentication remains active on its Vercel addresses. No promotion was
performed. Eleven API/page checks passed, including production robots body
(`Allow: /`, correct company host/sitemaps). The Vercel address still sends
`X-Robots-Tag: noindex`; source production configuration excludes the app's
preview-only header, but the final custom-domain header must be checked after
approved promotion. Two zero-file sessions were admitted during the initial
and repeated matrix; no email, upload or byte reservation was made. Production
release still requires separate approval. Hourly archive execution was also
observed to succeed earlier on this date with both existing requests returning
`already_verified`; secondary backup remains unverified and deletion disabled.

**Approved production promotion — 2026-10-13:** after separate explicit user
approval, `vercel promote` successfully promoted the same production build
`dpl_F1rGCbmi4yxN12acxgLSMMqXMWRk`, without rebuilding it. The alias inventory
confirmed `kazenco.com` and `www.kazenco.com` now point to
`kazenco-myo02wozk-dk-4bc8.vercel.app`; existing `.com.tr` redirects and the
project's other aliases were carried forward. Eight read-only live checks
passed: RFQ availability and robots on both company domains, plus contact-page
rendering in TR/EN/RU/KZ. The company domains did not send `noindex`; robots
allows crawling and retains company-host sitemap URLs. No real email, upload,
counter exhaustion/reset, commit or push occurred during promotion checks.
Only this setup document was edited. Free-plan settings, disabled cloud deletion,
unverified secondary backup and the unpublished WAF draft remain unchanged.

This ceiling counts reserved bytes, including abandoned/failed submissions;
it is not measured live storage and must never be automatically refunded or
reset on a date boundary. It covers new grants made by this code only: existing
files, earlier outstanding tokens, direct provider writes, download traffic,
operation counts, other stores, and lost/evicted Redis state are outside this
budget. A reset needs actual inventory, verified archive/backup and approved
cleanup first. Do not reset it simply because 30 days have elapsed. No counter
was created/reset remotely during this code-preparation phase. Actual Redis
`PERSIST` behavior and concurrent persistent-budget admission were subsequently
verified in the isolated integration check below before preview deployment.

### Prepared WAF observation rule (not staged or published)

First observe POST session creation and submission at a generous 50 requests
per 60 seconds per IP. Exclude `/api/rfq/upload` initially because the same route
accepts Blob completion callbacks; their source IPs can be shared. Review that
traffic separately before proposing a token-route threshold. GET availability,
site pages and crawlers remain outside this rule.

After linking through an approved setup, the concrete draft command is:

```sh
vercel firewall rules add "RFQ POST observation" \
  --condition '{"type":"path","op":"inc","value":["/api/rfq","/api/rfq/session"]}' \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit --rate-limit-window 60 --rate-limit-requests 50 \
  --rate-limit-keys ip --rate-limit-action log --yes
```

This is a written draft only; it was not run. Inspect the draft diff and have the
user publish the observation rule. Review matching traffic before a preview-only
429 stage, then consider production enforcement. WAF counters are per region;
the shared Redis layer continues to enforce email and upload budgets globally.
The Hobby allowance is one WAF rate-limiting rule per project. Log mode blocks
nothing and must not be described as active rate-limit enforcement.
[WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

Validation for this local quota preparation: 73 combined RFQ/archive tests,
typecheck, scoped ESLint and `npm run build -- --webpack` passed. The quota tests
use a store double, including exact daily/total boundaries, failed-admission
non-consumption, persistence across elapsed time/environment changes, 503 without
Retry-After at persistent exhaustion, and continued file-free admission. They
do not execute the new Lua PERSIST branch against real Redis. Full repository
lint was not repeated because of the previously identified unrelated gallery
errors. No deployment, firewall staging/publishing, paid-plan change, real mail,
upload, remote counter mutation, commit, or push occurred in this phase.

### Subsequent protected-preview verification — 2026-10-13

The exact current Lua budget script was exercised on real Upstash under a
random, isolated `kazenco:rfq:verification:` namespace. Twenty concurrent requests
against a limit of three produced exactly three admissions. The persistent key
had TTL `-1` before test cleanup; an existing expiry was removed by `PERSIST`.
A rejected multi-key reservation left its secondary key unchanged, and a
zero-byte admission remained possible at the persistent limit. The test wrapper
assigned every test key a 60-second expiry within the same atomic EVAL call.
The company upload budget was not filled or reset for this test.

Deployment `dpl_6tX1hw7WxCxBW2wZJMMR5yXXBpXG` is READY at
<https://kazenco-rhhl3878f-dk-4bc8.vercel.app>, protected by Vercel Authentication.
The deployment API confirmed `target: null`, no aliases and no production URL.
The Vercel build and type validation succeeded. The 128 MiB/day and shared
750 MiB persistent reservation now run in this preview; production promotion
has not occurred.

Eleven live preview checks passed: RFQ availability, excessive file count,
per-file and aggregate size rejection, file-free session admission, invalid
submission rejection before email, robots/noindex, and contact-page rendering
in TR/EN/RU/KZ. Two file-free preview sessions were admitted during verification;
their normal session counters were consumed, with no reserved attachment bytes.

Twelve interactive browser checks passed against the local production build:
429 notice, attachment-session 503 fallback, and file-free success in each of
TR/EN/RU/KZ. All RFQ API responses in these browser checks were mocked. Failed
sessions never reached submission or upload, and no Blob upload endpoint was
called. These checks establish UI behavior, not fresh email delivery or real
attachment transfer. No real email or Blob upload occurred in this phase.

Only this setup document was changed during the verification/deployment phase;
application source was not edited. No commit, push, production promotion,
firewall publication or paid-plan change occurred. Remaining activation work
includes production approval, first scheduled archive-run reliability,
secondary backup verification and inventory-based cleanup. Cloud deletion
remains disabled, and the WAF observation rule remains a written draft.

Without a backend connection, `/api/rfq` reports secure delivery unavailable and
the existing UI prepares a manual email. Direct requests fail before automatic
delivery. This is deliberate fail-closed behavior, not production readiness.

File MIME/extension restrictions are retained. Content scanning and removal of
`application/octet-stream` are not included; CAD and document compatibility
needs separate assessment before changing those rules.

## Local validation

Run `node --test tests/rfq-validation.test.mjs`, `npm run typecheck`, scoped ESLint,
and `npm run build -- --webpack`. Full lint currently includes pre-existing
`ProjectGallery.tsx` hook errors; do not fold unrelated fixes into this change.

## Mac archive checker (live connection verified, hourly check enabled)

`scripts/rfq-archive.mjs` copies submitted RFQ attachments into
`~/Documents/KAZENCO/RFQ Arşivi/<year>/<RFQ reference>/`. The root must already
exist. It accepts only the internal KAZENCO RFQ notification addressed to
`info@kazenco.com`, its exact reference format, and signed HTTPS links on the
verified private Blob store. It does not execute email instructions, follow
redirects, send email, upload files, or delete cloud/local files.

Every attachment is downloaded within the existing size limits, written without
overwriting an existing file, re-read, and checked with SHA-256. Only a complete
verified request receives `archive-record.json`; signed URLs and full email
bodies are not stored in that record. A repeat run validates existing copies
without re-downloading them. Partial failures remain unverified and protected.

Usage from the repository root:

```sh
# Check existing local records; no network or writes.
node scripts/rfq-archive.mjs --report-only

# Import a securely exported JSON array of full Resend email objects.
node scripts/rfq-archive.mjs --emails /absolute/path/to/email-export.json

# Read Resend list/detail endpoints with an existing, approved read-capable key
# supplied through the process environment (never put a key in this command).
node scripts/rfq-archive.mjs --resend

# Mocked archive tests and existing RFQ regression tests.
node --test tests/rfq-archive.test.mjs tests/rfq-validation.test.mjs
```

The Resend adapter uses `limit`/`after` cursor pagination and checks SDK errors.
It has only list/get operations. Its live API connection was verified on
2026-10-13 using a separately approved archive credential in macOS Keychain.
Reference: [List emails](https://resend.com/docs/api-reference/emails/list-emails)
and [Retrieve email](https://resend.com/docs/api-reference/emails/retrieve-email).
Email exports contain bearer download links: keep them private and remove them
after the import. Do not commit exports or save them in the company archive.

The report re-checks every recorded local file. At 30 elapsed days from the
recorded submission timestamp, intact requests receive `review_after_30_days`;
this is a review list, with `deletionEnabled: false`, not automatic deletion.
Missing records, missing files, altered contents, or invalid paths receive
`unverified_keep_in_storage`. A second backup is not presumed: the generated
record explicitly starts with `secondBackupVerified: false`.

The existing manually downloaded test request retains its original
`arsiv-kaydi.json` and CSV unchanged. The live import added a new
`archive-record.json` and a 122-byte CSV under its full unique Blob filename.
The new record has authoritative Resend submission time and verified SHA-256.

This is **not a full Blob inventory or orphan cleanup**: it can only report
request folders already present locally. Requests absent from the archive and
abandoned uploads still need separate provider inventory reconciliation. A Mac
that remains offline beyond the seven-day link lifetime may miss a download.
Hourly live read/download checks are now enabled. Secondary backup and any
eventual cloud deletion still require a separate activation step.

### Credential handoff and regular execution preparation

`scripts/rfq-archive-run.mjs` is the Mac entry point for live runs. It reads only
the generic password item with service `com.kazenco.rfq-archive.resend` and account
`rfq-archive` from macOS Keychain. It passes that value to the archive subprocess
through its environment, never command arguments, exports, logs, or repository
files. Missing/invalid credentials stop before any network call. Raw subprocess
errors are suppressed because they can contain sensitive context.

```sh
node scripts/rfq-archive-run.mjs
```

The separately approved **KAZENCO RFQ Archive** key was created and stored in the
above Keychain item on 2026-10-13. No credential file or repository environment
file was created. Resend's published key permissions are `full_access` and
`sending_access`; email listing/retrieval therefore needs broader access than
send-only. Its broader capabilities were explicitly approved before creation.
The archive code itself only reads emails and downloads attachments.
[Resend key permissions](https://resend.com/docs/api-reference/api-keys/create-api-key).

After the user separately approved the broader credential and hourly schedule,
the Codex heartbeat **KAZENCO RFQ — Mac arşiv kontrolü** was created ACTIVE
(`kazenco-rfq-mac-ar-iv-kontrol`). Existing Gmail and Outlook automations were
not modified. It stays quiet when unchanged and reports new verified archives,
new retention-review candidates, or failures requiring action. It never deletes,
sends emails, modifies source, commits, pushes, or deploys.

Two actual runs passed: the first imported KZ-RFQ-20261013-CC99F1 (one file,
122 bytes) and KZ-RFQ-20261013-7347D3 (no files); the second returned
`already_verified` for both. Both reports kept `deletionEnabled: false` and
`secondBackupVerified: false`. No new email or upload was performed.

The normal sandbox cannot access Keychain (`ARCHIVE_KEYCHAIN_ACCESS_REQUIRED`).
The two verified runs used approved `require_escalated` execution. The heartbeat
therefore explicitly uses the normal approval reviewer for this exact scope,
without bypassing it; an unattended denial must be reported, not hidden.
Its first time-triggered execution remains pending: successful manual runs and
an ACTIVE schedule do not alone establish unattended reliability. Retain the
cloud files until that operational behavior and a secondary backup are verified.
