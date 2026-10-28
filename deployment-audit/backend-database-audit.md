# Backend, database, and API audit

## There is no database server

Menu items and site settings are JSON files read on each cache miss. Enquiries are appended to another JSON file. There are no migrations, connection pools, transactions, or schema constraints beyond the enquiry validator.

| Store | Path | Written at runtime? | Survives a new deploy on Hostinger? |
| --- | --- | --- | --- |
| Products | `backend/data/products.json` | No | Yes, because it is in Git and rebuilt |
| Settings | `backend/data/settings.json` | No | Yes, same reason |
| Enquiries | `backend/data/enquiries.json` | Yes | No. The deploy directory is replaced. F-01 |
| Rate-limit buckets | Memory in `server.mjs` | Yes | No. Reset on restart. Acceptable |
| JSON parse cache | Memory | Yes | Rebuilt from disk. Acceptable |

PostgreSQL is not required. Hostinger’s statement that PostgreSQL needs a VPS does not affect this site. MySQL is available on web hosting and is unused. Adding MySQL later would be a code change, not a hosting prerequisite.

## Production process

`server.mjs` is a single Node process. It needs:

- a long-running or on-demand Node 22 process
- read access to the built site, `frontend/src/lib/seo.js`, `frontend/src/lib/enquiry.js`, the locale JSON used for FAQ schema, and `backend/data`
- write access to `backend/data/enquiries.json` for the form
- the `PORT` environment variable

It does not need a cron daemon, a worker dyno, a writable media disk, or a private network to a database.

The local FastAPI app (`backend/server.py`) duplicates the routes for pytest and `run.sh`. Render does not start it. Finding F-19.

## Routes and validation

See the route table in [architecture-audit.md](architecture-audit.md). Production validation for enquiries is `validateEnquiry` in `frontend/src/lib/enquiry.js`, called from `server.mjs` lines 262–266.

Rejected cases return 422 with a `detail` array. Oversized bodies return 413. Non-JSON content type returns 415. A foreign `Origin` returns 403. Too many in-flight writes return 429 (`ENQUIRY_QUEUE_MAX` is 32, lines 18 and 167–170). The per-IP limit is 5 requests in 10 minutes (lines 16–17 and 140–155).

The 201 body is the stored record, including name, phone, and email. That is the submitter’s own data. It should not be written into public logs. The current log line (line 177) records id, time, and product interest only.

Unhandled exceptions return 500 with `Internal server error` and no stack (lines 352–355). Other thrown errors with a `status` return `err.message`. That can expose validator text, which is acceptable, and should not include file paths. No debug page is mounted.

## Authentication and sessions

There is no session, cookie, JWT, or admin route. CSRF tokens are not used. The production form relies on same-origin (`server.mjs` lines 157–165). A non-browser client that omits `Origin` is allowed through that check and is then rate-limited. That is normal for a public form and is not an account takeover, because there are no accounts. Finding F-14.

Cookies are not set by the application. Cookie flags are therefore not configurable here. If a later version adds a session, use `Secure`, `HttpOnly`, and `SameSite` only after HTTPS works.

## Security headers and CORS

Production headers are set in `securityHeaders` (`server.mjs` lines 90–112): content security policy with a per-response script nonce, `nosniff`, referrer policy, permissions policy, `X-Frame-Options: DENY`, COOP, CORP, and HSTS. The live site returned this set on 28 October 2026.

OPTIONS responses do not add `Access-Control-Allow-Origin`. Cross-site browser calls are not invited. The local FastAPI mock does the opposite (`allow_origins=["*"]`, `backend/server.py` line 34). Finding F-12.

## File handling

Static files are resolved under `frontend/dist`. Paths that escape that directory return 403 (lines 285–291). There is no upload endpoint and no user-controlled filesystem write except the enquiry JSON, which uses a fixed path.

## Errors, health, and logs

`/api/health` returns 200 and `{ "status": "ok" }`. It does not check that the enquiry file is writable. A future health check could, but a public health URL should not print the file path or the enquiry contents.

Application logs are stdout. Render and Hostinger collect those. No error-tracking SaaS is configured.

## Email and jobs

No SMTP, no webhook, no cron. Hostinger’s 120-second request timeout and the ban on always-on workers do not affect these routes. The enquiry handler does a small synchronous file write inside an async queue. That is well under 120 seconds.

## Backup and restore

Not implemented. F-01 and F-10. A database dump is not applicable. The backup object, if you keep the file, is `enquiries.json` plus the Git repository for everything else.

Restore test that matters:

1. Copy a test enquiry file to a location outside the app directory.
2. Deploy again.
3. Confirm the Git-backed menu is still complete.
4. Confirm the test enquiry still exists in the outside copy.
5. Confirm whether the copy inside the app directory survived. On Hostinger’s documented layout, expect it not to survive.

## Render versus the repository

`render.yaml` matches the root scripts. The live headers match `server.mjs`. That is strong evidence the live process is this code. It is not proof that every dashboard setting equals the file. In particular, a persistent disk attached in the dashboard would not appear in Git. **Not Verified.**

## Resource use

One Node process serving a small JSON menu and static assets. Hostinger Unlimited (2 CPU, 3 GB RAM, 5 Node.js websites, NPROC 120) is enough on paper. The site does not need Cloud’s 4 CPU or a VPS. Memory and CPU on the live Render service were **Not Verified**.
