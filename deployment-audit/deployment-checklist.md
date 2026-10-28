# Deployment checklist

Status values: Not started, unless a row is already true in the repository. This audit did not complete the hosting steps. Do not tick a row until the verification column has been done by the named party.

Priority uses P0–P3 from [findings-register.md](findings-register.md).

## A. Pre-deployment audit

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | Read the repository and identify the real production process | Developer | P0 | Git checkout | `server.mjs` and `render.yaml` agree. This audit | Done in this audit |
| [x] | Confirm there is no database to dump | Developer | P0 | Source review | No ORM or database URL | Done in this audit |
| [ ] | Decide whether enquiry rows must survive deploys | Owner | P0 | F-01 | Written decision: WhatsApp-only, manual export, or later code change | Not started |
| [ ] | Re-run GitHub Actions on the commit you will deploy | Developer | P1 | GitHub | CI green. **Not Verified** here | Not started |
| [ ] | Run `npm audit` in `frontend` on a machine that may install packages | Developer | P1 | Your approval to install in a local or CI environment | Report reviewed. Not run in this audit | Not started |

## B. Hosting and account preparation

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Create the Hostinger account in the business owner’s control | Owner | P0 | None | Owner can log in | Not started |
| [ ] | Buy Web Hosting Unlimited, not Single or Premium, unless Node.js is confirmed in writing | Owner | P0 | F-04 | hPanel can create a Node.js Web App | Not started |
| [ ] | Record the renewal price and the tax on the invoice | Owner | P1 | Purchase | Invoice saved outside Git | Not started |
| [ ] | Choose the fallback explicitly if the Node app cannot be created | Owner | P0 | Failed check above | Either fix the plan or keep Render. [hostinger-compatibility.md](hostinger-compatibility.md) | Not started |

## C. Domain

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Search `chiranshfoods.com` on the Hostinger domain page and read the due-today total | Owner | P0 | Account | Cart matches the list price or you accept a premium. F-21 | Not started |
| [ ] | Prefer the hosting plan’s free-domain year if it includes this name | Owner | P1 | Hosting in cart | You are not paying twice | Not started |
| [ ] | Register the name. Leave privacy on. Confirm the contact email within 15 days | Owner | P0 | Acceptable price | Name appears in hPanel. WHOIS shows a registration | Not started |
| [ ] | Optional: register `chiranshfoods.in` and redirect it later | Owner | P2 | Budget | Separate DNS alias, not a second Node app | Not started |
| [ ] | Leave `chiransh.food` | Owner | P3 | Registry says not available | No purchase attempted | Not started |

## D. Environment and secrets

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | Confirm production needs no secret env var today | Developer | P0 | Code review | Only `PORT`, which the host injects | Done in this audit |
| [ ] | Leave `VITE_BACKEND_URL` unset | Developer | P0 | hPanel env screen | Built pages call `/api` on the same host | Not started |
| [ ] | Store any future mailbox or database password only in hPanel | Owner | P0 | If those are created | Not present in Git | Not started |

## E. Data migration and backup

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | Identify data that is not in Git | Developer | P0 | `.gitignore` | Only `enquiries.json` | Done in this audit |
| [ ] | Export any Render enquiries you care about, without pasting them into chat or Git | Owner | P0 | Render disk access. Durability there is **Not Verified** | A private copy exists | Not started |
| [ ] | Prove a test enquiry survives the storage method you chose | Developer | P0 | F-01 decision | Redeploy and read the row back | Not started |
| [ ] | Confirm menu JSON deploys from Git and matches the 22 products | Developer | P0 | Staging | `/api/products` count is 22 | Not started |

## F. Application deployment

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Connect GitHub. Framework Other. Node 22. Entry `server.mjs`. Build `yarn` or `npm install` | Developer | P0 | Section B | Build log shows `frontend` `npm ci` and a listen line | Not started |
| [ ] | Open `/api/health`, `/`, `/menu`, `/contact`, `/gu` on the preview host | Developer | P0 | Deploy | 200, specific titles, CSP header | Not started |
| [ ] | Count sitemap URLs | Developer | P1 | Deploy | 62 `<loc>` values until the menu changes. F-09 | Not started |
| [ ] | Reject a static-site detection | Developer | P0 | Build settings | Entry file is actually running. F-02 | Not started |

## G. DNS and SSL

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Keep the preview host until you approve cutover | Owner | P0 | Section F | Public domain still serves Render | Not started |
| [ ] | Attach the apex. Redirect `www`. One Node app | Developer | P0 | Your spoken or written approval | F-05. [dns-ssl-checklist.md](dns-ssl-checklist.md) | Not started |
| [ ] | Certificate issued. HTTP redirects to HTTPS | Hosting provider, checked by developer | P0 | DNS | `curl -I` as in the runbook | Not started |
| [ ] | Update canonical base in Git and redeploy | Developer | P0 | HTTPS works. Your approval to edit code | View source canonical matches the new origin. F-03 | Not started |

## H. Security verification

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | CSP, nosniff, frame denial, and HSTS present on HTTPS | Developer | P0 | Certificate | Response headers | Not started |
| [ ] | Cross-origin enquiry POST returns 403 | Developer | P1 | Staging | `curl` in the runbook | Not started |
| [ ] | Six rapid posts return 429 | Developer | P2 | Staging | Use test data, then delete or accept the test rows | Not started |
| [ ] | No `.env` or enquiry file in the Git commit | Developer | P0 | `git status` | Clean of secrets | Not started |
| [ ] | Port 8001 is not public | Developer | P1 | Deploy | Connection fails from outside | Not started |

## I. Functional testing

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Homepage, menu, one dish, about, gallery, FAQ, privacy, terms, refund | Owner | P0 | Staging | Pages load in English | Not started |
| [ ] | The same paths under `/gu` | Owner | P0 | Staging | Gujarati copy and `lang="gu"` | Not started |
| [ ] | Phone and WhatsApp buttons open the right apps | Owner | P0 | A phone | Number matches settings | Not started |
| [ ] | Contact form success and a visible validation error | Owner | P0 | F-01 decision | 201 in the UI, and a bad phone shows an error | Not started |
| [ ] | Mobile width and a laptop width | Owner | P1 | Browser | No overlap on home, menu, contact. Viewport test was **Not Verified** in this audit | Not started |
| [ ] | Unknown URL returns the not-found page and HTTP 404 | Developer | P1 | Staging | Status code 404 | Not started |
| [ ] | There is no login to test | Developer | Info | — | Confirmed by code review | Done in this audit |

## J. Performance and SEO

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Sitemap and robots use the final origin | Developer | P0 | F-03 | Fetch both URLs | Not started |
| [ ] | Search Console domain property | Owner | P1 | DNS | Verified property | Not started |
| [ ] | PageSpeed Insights on the final URL | Developer | P2 | Public HTTPS | Scores saved. No target invented here | Not started |
| [ ] | Rich results test on the homepage and one product | Developer | P2 | Public HTTPS | FoodEstablishment parses. Price is absent until F-08 | Not started |

## K. Go-live approval

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Owner approves the DNS change in writing | Owner | P0 | Sections F through H | Message you can find later | Not started |
| [ ] | Render is still deployed | Owner | P0 | — | Old URL returns 200 | Not started |
| [ ] | Rollback steps are printed and the Render DNS values are saved | Developer | P0 | Render dashboard | [migration-and-rollback.md](migration-and-rollback.md) | Not started |

## L. Post-launch monitoring

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Check `/api/health` the same day and the next day | Owner | P0 | Go-live | 200 | Not started |
| [ ] | Read hPanel logs for 500 responses | Developer | P1 | Go-live | No repeated enquiry errors | Not started |
| [ ] | Place one real order by phone or WhatsApp and confirm the business sees it | Owner | P0 | Go-live | Order received on the phone | Not started |
| [ ] | Watch Search Console for the new property and the old host | Owner | P1 | Sitemap submitted | No accidental `noindex` | Not started |

## M. Routine maintenance and recovery

| Done | Task | Who | Priority | Prerequisites | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | Export enquiries before each deploy until storage is durable | Owner | P0 | F-01 | File stored outside Git and outside `hbuilds` | Not started |
| [ ] | Restore one Hostinger backup of a non-customer file as a drill | Owner | P1 | Backup feature enabled | Restored copy matches | Not started |
| [ ] | Calendar reminder for domain and hosting renewal | Owner | P0 | Invoices | Dates written down | Not started |
| [ ] | Dependency update through Git, not on the server by hand | Developer | P2 | CI | Pull request and a preview deploy | Not started |
| [ ] | Do not delete Render or its data until a separate approval | Owner | P0 | Weeks of stable traffic | Old URL still available or its redirect is intentional | Not started |
