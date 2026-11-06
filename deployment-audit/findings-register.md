# Findings register

Priorities:

- **P0** — resolve before DNS cutover to a new host, or before treating the enquiry file as the only order record.
- **P1** — do this as part of a professional launch.
- **P2** — after launch.
- **P3** — later product ideas, not defects.

Complexity is Low, Medium, or High for a developer who already knows this repository. “Mandatory for deployment” means mandatory before the new hostname replaces Render. The current Render site can keep serving while these are open.

| ID | Priority | Severity | Finding | Mandatory before cutover? |
| --- | --- | --- | --- | --- |
| F-01 | P0 | High | Enquiry JSON is stored inside the deploy directory and is replaced when that directory is replaced | Yes, if the form must retain orders |
| F-02 | P0 | High | Hostinger can mis-detect the repo as a static Vite site and never run `server.mjs` | Yes |
| F-03 | P0 | Medium | Canonical host, robots, and sitemap origin are the Render URL | Yes, at the moment of cutover |
| F-04 | P1 | Medium | Single and Premium web plans do not list Node.js in Hostinger’s limits table | Yes, at purchase |
| F-05 | P1 | Medium | `www` and the apex can count as two Node processes | Yes, in the DNS design |
| F-06 | P1 | Low | No public business email address | No |
| F-07 | P1 | Low | Analytics, Search Console, and Google Business IDs are empty | No |
| F-08 | P2 | Low | Product structured data has no price or availability | No |
| F-09 | P1 | Medium | Committed `sitemap.xml` is missing six dishes. The live Node sitemap is complete | Yes, only if static hosting is used |
| F-10 | P1 | Medium | No backup or restore procedure exists for enquiries | Yes, together with F-01 |
| F-11 | P2 | Low | Rate limiting trusts the first `X-Forwarded-For` value | No |
| F-12 | P3 | Low | Local FastAPI allows every CORS origin | No |
| F-13 | P2 | Info | The app sends HSTS for 180 days | No, after HTTPS is confirmed |
| F-14 | Info | Info | The form is public. Production limits it by rate, honeypot, size, and same-origin | No |
| F-15 | P2 | Info | Hostinger Node apps sleep after a period with no traffic | No |
| F-16 | P2 | Low | A few accessibility issues are visible in source and were not confirmed in a browser | No |
| F-17 | P2 | Info | No public street address or map. Pickup is by phone | No |
| F-18 | P3 | Info | No cart or payment. Ordering is contact, phone, and WhatsApp | No |
| F-19 | Info | Info | Python is not part of production | No |
| F-20 | P2 | Low | `style-src 'unsafe-inline'` is in the content security policy | No |
| F-21 | P1 | Info | `chiranshfoods.com` was unregistered at check time and is not reserved | Yes, before public launch on that name |

## F-01 Enquiry file is not durable

- **Business impact:** A customer enquiry can disappear on the next deploy or, on some hosts, on restart. Phone and WhatsApp orders are not in this file.
- **Technical explanation:** `appendEnquiry` in `server.mjs` lines 167–176 writes `backend/data/enquiries.json`. Hostinger’s Node file-structure documentation says `hbuilds/` and `public_html` are overwritten on every deployment, and only the live build is kept. Render’s disk for this service was **Not Verified**.
- **Action:** Before cutover, pick one: export the file on a schedule to a place outside the app directory, send a copy by email, or change the code later to store rows in MySQL or another durable store. Do not implement that change until you approve it.
- **Complexity:** Medium if the code changes. Low if the interim rule is “WhatsApp is the order record and the form is a convenience.”
- **Dependencies:** Your decision on how orders are kept.
- **Verification:** Submit a test enquiry, redeploy, and read the record back. Also restart the process and read it back.
- **Mandatory:** Yes if the form is a system of record. The current site should be treated with the same caution.

## F-02 The Node server must be the published app

- **Business impact:** A static publish still shows a homepage, then breaks search snippets, the menu API, and the contact form.
- **Technical explanation:** `server.mjs` serves `frontend/dist` and the API. Hostinger auto-detects Vite as a static frontend and, in that mode, does not run an entry file. This repository has both a Vite app and a custom server. The safe preset is **Other**, entry `server.mjs`, Node 22.
- **Action:** Staging deploy with those settings. Read the build log.
- **Complexity:** Low.
- **Dependencies:** Hostinger Unlimited or another plan that actually runs Node. F-04.
- **Verification:** `GET /api/health` returns JSON. View source on `/menu` shows a menu title and a canonical link. `POST /api/enquiries` from the contact page returns 201. A cross-origin POST returns 403.
- **Mandatory:** Yes.

## F-03 Canonical host is the Render URL

- **Business impact:** After a move, Google can keep the old host as the official address, or index both.
- **Technical explanation:** `frontend/src/lib/seo.js` line 3 sets `CANONICAL_ORIGIN`. `backend/data/settings.json` lines 68–70 set `domain.canonical_base` to `https://chiransh-foods.onrender.com`. `resolveCanonicalOrigin` uses the settings value when it is a valid `https` origin. `frontend/public/robots.txt`, `frontend/public/sitemap.xml`, and `frontend/public/.well-known/security.txt` also name that host. The live homepage canonical on 28 October 2026 was the Render URL, which is correct while that is the public site.
- **Action:** At cutover, and only after HTTPS works on the new name, set `canonical_base` to `https://chiranshfoods.com` (or the name you buy) and redeploy. Keep a 301 from the Render URL if Render still allows it.
- **Complexity:** Low.
- **Dependencies:** Domain, certificate, and your approval to edit application data.
- **Verification:** View source shows the new canonical. `robots.txt` sitemap URL matches. Search Console property is the new host.
- **Mandatory:** Yes at cutover. Do not change it while Render is still the public site.

## F-04 Buy a plan that includes Node.js

- **Business impact:** Single or Premium may be unable to start this site. You would pay for hosting that cannot run the API.
- **Technical explanation:** Hostinger’s limits article (page updated 9 October 2026) lists Node.js websites as “Not available” on Web Single and Web Premium, and as 5 websites on Business/Unlimited. The India pricing page still shows a Node.js badge on Single and Premium. The creating-an-app document lists Business web hosting and the Cloud plans as the panel Node.js plans.
- **Action:** Purchase **Web Hosting Unlimited**, or get written confirmation that the chosen plan can create a Node.js Web App. Cloud Startup also qualifies and costs more.
- **Complexity:** Low.
- **Dependencies:** Checkout.
- **Verification:** hPanel offers “Node.js” / Web App creation after purchase.
- **Mandatory:** Yes.

## F-05 One Node app, one hostname

- **Business impact:** Serving both `www` and the apex as separate Node apps can approach the process limit on a small plan and can split cookies and cache.
- **Technical explanation:** Hostinger documents that `domain.tld` and `www.domain.tld` each run a separate Node process, and that process limits are shared by the whole plan.
- **Action:** Attach the Node app to the apex. Redirect `www` to the apex at the Hostinger redirect / DNS layer, or the reverse. Do not deploy the repository twice.
- **Complexity:** Low.
- **Dependencies:** F-02.
- **Verification:** One hostname returns the app. The other returns a single redirect. Only one Node app is listed.
- **Mandatory:** Yes.

## F-06 No public email

- **Business impact:** Customers and Google have a phone number and WhatsApp number, and no mailbox.
- **Technical explanation:** `contact.email` is null in `backend/data/settings.json` line 7. The README says the same.
- **Action:** Create a mailbox after the domain exists, then decide whether to publish it. Publishing it is a later content edit.
- **Complexity:** Low.
- **Dependencies:** Domain and email DNS. Do not delete other MX records if you already have mail elsewhere. This domain is not registered yet, so there is no existing mail to preserve.
- **Verification:** A test message arrives. The site shows the address only after you choose to publish it.
- **Mandatory:** No.

## F-07 Measurement and local listing IDs are empty

- **Business impact:** You cannot see search queries or site visits inside the product, and the Google Business link is empty.
- **Technical explanation:** `settings.json` `analytics` and `social.google_business` are null (lines 53–67). No analytics script was found under `frontend/src`.
- **Action:** After the final domain is live, add Search Console by DNS TXT, then optionally a privacy-reviewed analytics tag. A tag change is a later code change because the content security policy only allows same-origin scripts (`server.mjs` lines 90–104).
- **Complexity:** Medium if a third-party script must be allowed in the policy. Low for DNS verification.
- **Dependencies:** Final domain. Your approval before any policy edit.
- **Verification:** Search Console verifies the property. A page fetch still sends the content security policy.
- **Mandatory:** No.

## F-08 Product structured data omits price

- **Business impact:** Search results are less likely to show a price. This does not block indexing.
- **Technical explanation:** Product JSON-LD in `frontend/src/lib/seo.js` lines 347–355 has name, image, description, category, language, and brand. It has no `offers`.
- **Action:** Add an offer only when price and availability in `products.json` are accurate.
- **Complexity:** Low.
- **Dependencies:** Owner confirmation that published prices may appear in Google.
- **Verification:** Rich results test shows `Product` with `Offer`, or a deliberate decision not to add it.
- **Mandatory:** No.

## F-09 Static sitemap is behind the menu

- **Business impact:** None on the current Render site. High if a static host serves `frontend/public/sitemap.xml`.
- **Technical explanation:** Live `https://chiransh-foods.onrender.com/sitemap.xml` on 28 October 2026 contained 62 URLs and 22 dish slugs. The committed file has 50 URLs and 16 dish slugs. The six missing slugs are `bhaji-pav`, `khada-pav-bhaji`, `kutchi-dabeli`, `masala-pav`, `pulav`, and `ragda-pattice`. `renderSitemap` builds the full list from `products.json`.
- **Action:** Keep using the Node server. Do not point the domain at `frontend/dist` or `public/` alone.
- **Complexity:** Low.
- **Dependencies:** F-02.
- **Verification:** Production sitemap URL count is 62 until the menu changes, and every current slug appears.
- **Mandatory:** Yes only for a static deploy. The recommended Node deploy avoids it.

## F-10 No enquiry backup

- **Business impact:** There is no tested way to restore customer messages.
- **Technical explanation:** The file is gitignored (`.gitignore` lines 23–24). No backup script or off-site copy exists in the repository. Hostinger daily backups are advertised for the Unlimited plan; whether they retain a file inside a replaced `hbuilds` version was **Not Verified**.
- **Action:** Define a copy that lives outside the deploy directory, and restore it once in a test.
- **Complexity:** Low for a manual export. Medium for an automated one.
- **Dependencies:** F-01.
- **Verification:** Restore a test file and read the test enquiry.
- **Mandatory:** Yes if enquiries are retained at all.

## F-11 Forwarded client IP

- **Business impact:** A caller who can spoof `X-Forwarded-For` can evade the form rate limit, or crowd out a real visitor, until the edge overwrites that header.
- **Technical explanation:** `clientIp` in `server.mjs` lines 84–87 uses the first address in `X-Forwarded-For`.
- **Action:** On the chosen host, confirm the proxy overwrites that header. If it appends instead, rate-limit using the last trusted hop. This is a later code change.
- **Complexity:** Low.
- **Dependencies:** Host proxy behaviour. **Not Verified** on Hostinger.
- **Verification:** Two requests with different forged first hops still share a limit when sent through the real proxy.
- **Mandatory:** No.

## F-12 Local API CORS

- **Business impact:** None on Render. A developer machine running the FastAPI mock accepts browser calls from any origin.
- **Technical explanation:** `backend/server.py` line 34. Production `sameOrigin` is in `server.mjs` lines 157–165 and is enforced at lines 253–255. Live cross-origin behaviour was not penetration-tested; the code path is present and covered by `frontend/src/server.integration.test.js` according to the test file. That test was not re-run here.
- **Action:** Leave the mock off any public port.
- **Complexity:** Low.
- **Dependencies:** None.
- **Verification:** Public host does not answer on port 8001. Production POST with a foreign `Origin` returns 403.
- **Mandatory:** No.

## F-13 HSTS

- **Business impact:** After a browser sees HTTPS, it keeps using HTTPS for this host for 180 days.
- **Technical explanation:** `server.mjs` line 111 sets `strict-transport-security: max-age=15552000`. The live site sends the same header. Preload is not set. HSTS on a response that arrived over HTTPS is appropriate for the current host.
- **Action:** On a new host, confirm HTTP redirects to HTTPS before advertising the name. Do not add preload in this change.
- **Complexity:** Low.
- **Dependencies:** Certificate.
- **Verification:** `curl -I http://<host>` is a redirect. The HTTPS response contains HSTS.
- **Mandatory:** No beyond normal HTTPS checks.

## F-14 Public form controls

- **Business impact:** Anyone can submit the form. That is intended. Abuse is limited, not impossible.
- **Technical explanation:** No accounts. Production checks content type, a 1 MB body, same-origin, 5 requests per 10 minutes per IP, honeypot fields, and field lengths (`server.mjs` lines 16–18 and 247–270, `enquiry.js` lines 12–53). The 201 response echoes the submitted record to the person who sent it. Logs include the enquiry id, time, and product interest (`server.mjs` line 177), not the phone number.
- **Action:** Keep these checks. Add durable storage separately (F-01).
- **Complexity:** Already implemented.
- **Verification:** Invalid phone returns 422. A second origin returns 403. Six quick posts return 429.
- **Mandatory:** No new work. Re-test on the new host.

## F-15 Idle sleep

- **Business impact:** The first visit after a quiet period can be slower. A brochure site can accept that.
- **Technical explanation:** Hostinger’s Node.js overview, updated 21 October 2026, says the process stops after a period without traffic and starts on the next request. This app has no always-on worker.
- **Action:** Accept it on the Unlimited plan. A VPS would stay up and is not worth the operations cost for this reason alone.
- **Complexity:** None.
- **Verification:** After idle, `/api/health` returns 200 without a manual restart. Time-to-first-byte was **Not Verified**.
- **Mandatory:** No.

## F-16 Accessibility gaps in source

- **Business impact:** Some motion and structure may be weaker than the rest of the interface. Severity is uncertain until a browser check.
- **Technical explanation:** `Reveal` in `frontend/src/components/Reveal.jsx` does not use `delay` or `y` props that callers pass. Below-the-fold content starts at opacity 0 until an observer runs (`frontend/src/index.css` reveal styles). Menu category tabs share one tab panel (`frontend/src/pages/Menu.jsx`). A story image is a plain `img` without responsive sources. Positive items that are implemented: skip link (`App.jsx` lines 49–54), form labels and alerts on the contact page, FAQ `aria-expanded`, reduced-motion handling.
- **Action:** Browser-test keyboard and a phone-sized viewport after any visual change. Not a launch blocker from code reading alone.
- **Complexity:** Low.
- **Verification:** Keyboard walk of home, menu, and contact. This audit’s browser viewport pass is **Not Verified**.
- **Mandatory:** No.

## F-17 Address and map

- **Business impact:** Local customers get areas and a phone number, not a pin.
- **Technical explanation:** `address_public` and `maps_url` are null. Contact copy says pickup is arranged by phone. This matches the data. It is not a broken map embed.
- **Action:** Publish an address only when you want the location public.
- **Complexity:** Low.
- **Mandatory:** No.

## F-18 No online checkout

- **Business impact:** You cannot take card payments on the site. That matches the current business process.
- **Technical explanation:** `ordering.mode` is `contact`. Zomato, Swiggy, and `online_ordering_url` are null. No payment SDK is in `frontend/package.json`. The content security policy disables the payment feature.
- **Action:** None until you decide to sell online.
- **Complexity:** High if a real checkout is added later.
- **Mandatory:** No.

## F-19 Python is local only

- **Business impact:** None for hosting choice.
- **Technical explanation:** `backend/server.py` lines 1–12 describe a mock. Render’s start command never calls it.
- **Action:** Do not buy a VPS for Python.
- **Mandatory:** No.

## F-20 Inline styles in CSP

- **Business impact:** A styling injection is slightly easier than with a nonce for styles. Scripts already use a nonce.
- **Technical explanation:** `server.mjs` lines 93–97. Tailwind’s build emits utility classes; some inline style attributes may still exist. Not exploited in this audit.
- **Action:** Leave it unless a later security pass removes inline styles.
- **Complexity:** Medium.
- **Mandatory:** No.

## F-21 Domain is not reserved

- **Business impact:** `chiranshfoods.com` can be registered by someone else until you pay.
- **Technical explanation:** Verisign WHOIS at 11:06 PM IST on 28 October 2026 returned `No match` for `chiranshfoods.com`. That is not a Hostinger cart hold.
- **Action:** When you are ready, search the exact name on [Hostinger’s domain page](https://www.hostinger.com/in/domains), read the due-today total, and pay. Details are in [domain-research.md](domain-research.md).
- **Complexity:** Low.
- **Mandatory:** Yes before a public launch on that name. Not required to keep Render running.

## Checks that were not completed

- Render account plan, persistent disk, environment variables, and invoice.
- Hostinger cart price for the exact string `chiranshfoods.com`.
- A full-browser pass of mobile, tablet, and desktop layout, console errors, and Core Web Vitals.
- Dependency CVE scanning with `npm audit` or `pip-audit`. Those tools were not run, because this audit did not install packages.
- A line-by-line secret scan of all 59 historical commits. The current tree was searched for common secret patterns and no matches were returned. A filename history scan did not show a committed `.env` or private key. This is not a certificate that history is clean.
- Penetration testing, load testing, and backup restore on a Hostinger account. No Hostinger account was used.
