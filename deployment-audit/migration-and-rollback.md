# Migration and rollback

The public site stays on Render until you approve stage 7. This document does not perform the move.

There is no database. The only data that can diverge is `backend/data/enquiries.json`, which is not in Git. Menu, settings, images, and code move by deploying Git. Phone and WhatsApp orders never enter the server.

## Stage 1 — Baseline

Record, without copying secret values into Git:

| Item | How to see it | Known from this audit |
| --- | --- | --- |
| Process | Render start command | `yarn start` → `node server.mjs` |
| Health | `GET /api/health` | Returned 200 on 28 October 2026 |
| Code version | Render deploy commit | **Not Verified** against the dashboard. `render.yaml` tracks `main` |
| Environment variables | Render dashboard | Only `NODE_VERSION` is in Git. Others: **Not Verified** |
| Disk | Render disk settings | **Not Verified**. Assume enquiries may vanish until you see a persistent disk |
| Enquiries | `backend/data/enquiries.json` on the server, if the file exists | Not in Git. Do not download it into the repository |
| Integrations | Settings JSON | WhatsApp and phone links. No payment, no email sender, no analytics script |
| Edge | Response headers | Cloudflare in front of Render. Who configured Cloudflare: **Not Verified** |

Write down the current Render URL and keep it. It is the rollback target.

## Stage 2 — Backup

1. Export enquiries from Render if the file exists and you need those rows. Store the export in a private place. Not in Git, not in chat, not in this folder.
2. Confirm the export opens and contains the test row you expect.
3. The Git repository is the backup of the menu and the code. `git status` should be clean except for the audit documents when those are committed.
4. A database dump command does not apply. Do not invent a `pg_dump`.

If Render has no file, the backup result is “there was nothing to copy.” Say that explicitly so nobody later thinks a backup was skipped by accident.

## Stage 3 — Prepare the target without DNS

1. Buy Unlimited hosting only after Node.js Web Apps are available. F-04.
2. Deploy the Git repository to the Hostinger preview hostname. [deployment-runbook.md](deployment-runbook.md).
3. Do not change the public domain’s A records.
4. Do not change `canonical_base` yet. The preview host may show Render canonical URLs inside the HTML. That is acceptable on a private preview. It is not acceptable after cutover. F-03.

## Stage 4 — Staging copy and a test dataset

1. Submit one enquiry on the preview host with an obvious test name.
2. Read it back from the file or from the success response.
3. Deploy the same commit again.
4. Record whether the row survived. Expect it not to survive inside `hbuilds`. F-01.
5. Products should still number 22, because they come from Git.

Do not copy real customer rows onto a preview host that other people can open.

## Stage 5 — Tests

Use [deployment-checklist.md](deployment-checklist.md) sections H, I, and J on the preview host.

Minimum bar:

- `/api/health` is 200.
- `/`, `/menu`, `/contact`, `/gu` return specific titles.
- Sitemap has every current slug.
- Cross-origin POST is 403.
- HTTPS works on the preview name.
- You can still place an order by phone. The phone path does not depend on the new host.

Performance numbers are not a gate. A broken form or a static-site mis-detection is a gate.

## Stage 6 — DNS preparation

1. Save the records you will need to put back: Render’s custom-domain instructions, even if the domain is not attached yet.
2. Lower TTL on the Hostinger zone to 300 seconds if the panel allows it, at least several hours before the change.
3. Decide the canonical hostname. This design uses the apex and redirects `www`.
4. Attach the certificate on the new name only when you are ready to publish it. Some panels issue the certificate as soon as DNS points at them. That is why DNS itself waits for stage 7.

## Stage 7 — Approval

Stop until you explicitly approve production cutover. A passing preview is not approval. The approval should say:

- the domain name
- the host (Hostinger or “stay on Render”)
- whether lost enquiries on redeploy are accepted
- that Render will not be deleted

## Stage 8 — Cutover

1. Point DNS as in [dns-ssl-checklist.md](dns-ssl-checklist.md).
2. Confirm HTTP redirects to HTTPS and `www` redirects once.
3. Deploy the canonical URL change. F-03.
4. Submit the new sitemap.
5. Place a phone-order test and a form test.
6. Watch logs for the rest of the day.

During the TTL window some visitors still reach Render and some reach Hostinger. Both can accept form posts. Those posts land in different files. That is the divergence window.

## Stage 9 — Keep the old site

Leave the Render service and its data in place. Keep paying for it until the new site has been stable long enough for you to decide. A weekend is a start, not a rule this document can set for your business.

Do not point both hosts at different menus. Continue to deploy from the same Git commit, or accept that they differ.

## Stage 10 — Rollback

### When to roll back

- The new host returns 5xx on `/` or `/api/health` for more than a few minutes and a restart does not fix it.
- The contact form or the menu API is missing because the app was published as static files.
- The certificate name does not match.
- You cannot read orders in the way you expected, and the business cannot operate on phone and WhatsApp alone.

### What to do

1. In Hostinger DNS, restore the records that send the domain to Render, using the values you saved in stage 6. If the domain never pointed at Render before, rollback means removing the public records and telling customers to use `https://chiransh-foods.onrender.com/` again.
2. Wait for TTL. Check from a phone network.
3. Confirm the Render URL returns 200 and the menu loads.
4. Export any enquiries that were written only on Hostinger before you redeploy or delete that app. DNS rollback does not move those rows back to Render.
5. Do not delete the Hostinger app until the export is stored. Do not delete Render at all in the rollback step.

### What rollback cannot fix

- Enquiries submitted to host A are not on host B.
- A browser that cached HSTS for a hostname will keep using HTTPS. Both hosts must have a valid certificate while HSTS is in play. The current Render host already sends HSTS. A broken certificate on the new name is painful. Do not advertise the new name until stage 8 step 2 passes.
- Sessions are not an issue. There is no login session to invalidate.
- Uploaded images are not an issue. Images are in Git.

## Staying on Render instead

If you choose the fallback, stages 3–5 are “add the domain in Render’s panel and read the DNS targets.” Stage 8 is those DNS records at Hostinger. The Node process does not move. F-01 remains a property of Render’s disk, which is still **Not Verified**. Canonical update (F-03) still happens at cutover.

## Explicit non-actions

- Do not run a destructive database command. There is nothing to drop.
- Do not force-push `main`.
- Do not disable the Render auto-deploy until you intend the new host to be the only one, and even then leave the service up.
