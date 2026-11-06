# Security audit

Defensive review of the source, `.gitignore`, a targeted search of the current Git tree, and the live HTTP headers on 28 October 2026. This is not a penetration test. No exploit was run against the live site. No secret values are copied here.

Severity uses Critical, High, Medium, Low, and Informational. Nothing reached Critical.

## F-01 / F-10 — enquiry storage — High — code and operations

**Evidence:** `server.mjs` lines 167–176 write plaintext enquiry records to `backend/data/enquiries.json`. `.gitignore` lines 23–24 keep that file out of Git. Hostinger documentation says files under `hbuilds/` and `public_html` are replaced on deploy.

**Impact:** Loss of customer names and phone numbers, or those details sitting in a file with the same permissions as the app. There is no encryption at rest in this design.

**Fix:** Keep orders in WhatsApp or phone records until a durable store exists. A later approved code change can write outside the deploy directory or into MySQL on the same hosting plan. Do not commit the JSON file.

**Where:** Code and hosting. A hosting backup product alone is not proven to keep this file.

**Validation:** Redeploy after a test enquiry and show the record still exists in the place you chose.

**Before launch:** Yes, before the new host is the only copy. The current Render site has the same design gap. Render disk durability is **Not Verified**.

## F-02 — wrong publish mode — High — hosting configuration

**Evidence:** The API and the content security policy exist only when `server.mjs` is the server. A static Vite publish would serve `index.html` without that policy and without the form API.

**Impact:** Broken orders and a weaker browser policy.

**Fix:** Framework preset Other, entry `server.mjs`, Node 22. Confirm on a staging hostname.

**Where:** Hosting configuration.

**Validation:** Response headers include `content-security-policy` and `x-render-origin-server` will no longer apply. On Hostinger, expect Hostinger’s proxy headers instead, plus the application policy.

**Before launch:** Yes.

## F-12 — local CORS — Low — code, development only

**Evidence:** `backend/server.py` line 34, `allow_origins=["*"]`. No same-origin check on the mock’s POST.

**Impact:** Any website can call a developer’s port 8001. No impact on Render if port 8001 is not public. A scan of the public host’s port 8001 was **Not Verified**.

**Fix:** Do not expose the mock. No production code change is required for the current architecture.

**Where:** How developers run the project.

**Validation:** The public site’s only API is the Node process on 443.

**Before launch:** No.

## F-11 — client IP — Low — code, later

**Evidence:** `server.mjs` lines 84–87.

**Impact:** Rate-limit bypass if the first forwarded address is attacker-controlled.

**Fix:** After the proxy behaviour is known, use the trusted hop. Not required to launch a brochure site.

**Where:** Code, after the host is chosen.

**Validation:** Forged header does not create a fresh limit bucket.

**Before launch:** No.

## F-13 and live HTTPS — Informational — already in place on Render

**Evidence:** `server.mjs` line 111. Live `http://chiransh-foods.onrender.com/` returned 301 to HTTPS. HTTPS responses included HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, referrer policy, and the content security policy.

**Impact:** Positive on the current host. On a new host, HTTPS must exist before HSTS is useful. The application sends HSTS whenever it answers, including behind a TLS-terminating proxy.

**Fix:** Issue the certificate, redirect HTTP, then browse the site. Do not preload.

**Where:** Hosting and DNS. The header is already in code.

**Validation:** Browser padlock, HTTP redirect, no mixed-content warnings. Mixed content was **Not Verified** in a browser. The policy’s `img-src`, `font-src`, and `connect-src` are `'self'`, which blocks accidental third-party asset hosts.

**Before launch:** HTTPS is mandatory. The header does not need a code change.

## F-14 — form abuse — Informational

**Evidence:** Rate limit, honeypot, body cap, content type, and same-origin in `server.mjs` lines 188–270. No login to brute-force.

**Impact:** Spam can still be submitted slowly. It cannot become an admin session.

**Fix:** Keep the controls. Durable storage is F-01, not a captcha requirement.

**Where:** Already in code. Re-test on the new host.

**Before launch:** Re-test, do not rebuild.

## F-20 — style CSP — Low

**Evidence:** `style-src 'self' 'unsafe-inline'` at `server.mjs` line 96. Scripts use a nonce (lines 90–91 and 311–317).

**Impact:** Inline style injection is not blocked. Script injection from an untrusted file is constrained by the nonce and `'self'`.

**Fix:** Optional later hardening.

**Where:** Code.

**Before launch:** No.

## Secrets

**Evidence:** Searched the current tree for common key, password, MongoDB URI, and private-key patterns, excluding lockfiles and images. No matches. No `.env` file is in the checkout. `.gitignore` ignores `.env` and `.env.*` except `.env.example`, and that example file does not exist. Git history has 59 commits. A history summary did not show an added `.env` or private key. Every historical blob was **not** scanned with a dedicated secret scanner. **Not Verified** as a complete history audit.

**Impact:** No exposed credential was found to rotate.

**Fix:** Continue not to commit enquiry data or future mailbox passwords. Set any future secret only in the host’s environment UI.

**Where:** Process.

**Before launch:** No rotation required from this review.

## Injection and XSS

Product and settings JSON are project content, not visitor content. Enquiry fields are stored as JSON and returned as JSON to the submitter. They are not rendered as HTML by `server.mjs`. SEO text is passed through `escapeHtml` in `frontend/src/lib/seo.js` lines 410–416. JSON-LD is serialized and `<` is escaped (line 426).

A stored-XSS test in a browser was **Not Verified**. The design does not concatenate enquiry text into HTML.

SQL injection does not apply. There is no SQL.

## File paths and commands

Static path check: `server.mjs` lines 285–291. No `child_process` usage was found in `server.mjs`. Python scripts under `scripts/` are offline tools and are not served.

## Headers that were not missing on the live site

The live responses included CSP, frame denial, nosniff, referrer policy, permissions policy, COOP, and CORP. `Server` identified Cloudflare and Render, which is informational.

## Dependency vulnerabilities

`npm audit` and `pip-audit` were **Not Verified**. They were not run, because this audit did not install dependencies. CI installs and tests on GitHub; the latest run result was not opened. Before launch, run the existing CI workflow and read the result. Do not treat “pinned versions” as “no known vulnerabilities.”

Pins observed: FastAPI `0.142.2`, Uvicorn `0.54.0`, and the root Python lock list in `requirements.txt`. Frontend versions are ranges in `frontend/package.json` locked by `frontend/package-lock.json`.

## Access control and data exposure

`/api/settings` and `/api/products` are public by design. They do not contain customer enquiries. There is no object id a stranger can increment to read someone else’s enquiry. `GET /api/enquiries` is not implemented; unknown API paths 404.

The enquiry file on disk is the sensitive object. Anyone with host file access can read it. Hostinger file manager access should be limited to the people who already handle customer phone numbers.

## Debug and admin

No admin route, no interactive debugger, and no stack traces on HTTP 500. FastAPI docs for the local mock were not disabled in code. That matters only if the mock is placed on a public network. Do not do that.

## Network exposure

The application listens on `0.0.0.0` and `PORT`. On Render and on Hostinger Node hosting, the platform proxy is the public door. This repository does not open extra ports, a database port, or SSH.

On a VPS, you would have to configure a firewall yourself. That is a reason not to choose a VPS for this site. **Not Verified:** Hostinger account firewall screens, because no account was accessed.

## Personal data

The form can store name, phone, optional email, product interest, and message. The log line avoids the phone number. There is no privacy-policy gap in the sense that `/privacy` exists and was served with HTTP 200. Whether the policy text matches Indian law for this business is a legal question, not a code defect. **Not Verified** by a lawyer.

## Immediate action before launch

| ID | Immediate? |
| --- | --- |
| F-01, F-10 | Yes if enquiries must be kept |
| F-02, F-04, F-05 | Yes before DNS |
| F-03 | Yes at cutover, not before |
| F-11, F-12, F-13, F-20 | No code emergency |
| Secrets rotation | No evidence that it is required |
