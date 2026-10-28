# Deployment runbook

Use this after you approve a move. Do not run it against the live Render service as part of reading this audit. Placeholders are written in angle brackets. They are not real passwords.

The commands match this repository: Node 22, root `package.json`, and `server.mjs`. They are not Django or PHP commands.

## 0. Safety

- Keep `https://chiransh-foods.onrender.com/` in service.
- Do not point the public domain at Hostinger until section 6 passes on the temporary hostname.
- Do not commit `.env` files or enquiry exports.
- Do not edit `render.yaml` to force a Render deploy while testing Hostinger.

## 1. Purchase and empty app

1. Buy **Web Hosting Unlimited** after the panel shows Node.js Web Apps. If it does not, stop. F-04.
2. Buy the domain only after the cart total for the exact name is acceptable. [domain-research.md](domain-research.md).
3. In hPanel, add the domain. Do not change nameservers away from Hostinger if mail will live here.
4. Create one Node.js Web App. Leave it on the temporary hostname until DNS cutover.

## 2. hPanel build settings

| Setting | Value |
| --- | --- |
| Repository | `https://github.com/cdasadiya/chiransh_foods` |
| Branch | staging branch, not `main`, for the first build |
| Root | `/` of the repository |
| Node.js version | `22` |
| Framework preset | `Other` |
| Package manager | `yarn` |
| Build command | `yarn` |
| Entry file | `server.mjs` |
| Output directory | empty. This is not a static site |
| Environment variables | none required. Do not set `VITE_BACKEND_URL` |

`PORT` is provided by Hostinger. The app reads it in `server.mjs` line 14.

If the build log never mentions `frontend` or `npm ci`, Yarn did not run `postinstall`. Change the build command to:

```bash
npm install
```

`npm install` at the root also runs `postinstall` (`package.json` lines 8–10), which installs `frontend/` from `frontend/package-lock.json` and builds `frontend/dist`.

## 3. What success looks like in the log

- Node reports version 22.
- `npm ci` runs inside `frontend`.
- Vite writes `frontend/dist`.
- The process prints `Chiransh Foods listening on http://0.0.0.0:<PORT>`.
- A missing `frontend/dist/index.html` aborts start. That abort is correct. Fix the build. Do not upload a hand-copied `dist` as the only site.

## 4. Local smoke test before you depend on Hostinger

On a developer machine, from the repository root, with Node 22:

```bash
node -v
yarn
yarn start
```

Then, in another terminal, against `http://127.0.0.1:10000` (the default when `PORT` is unset):

```bash
curl -sS http://127.0.0.1:10000/api/health
curl -sS http://127.0.0.1:10000/menu | head
```

Expect `{"status":"ok"}` and an HTML title that mentions the menu. `yarn start` is the same start command Render uses.

This audit did not execute those commands. Dependencies were not installed here.

## 5. Staging checks on the Hostinger hostname

Replace `<preview-host>` with the hostname hPanel shows.

```bash
curl -sSI "https://<preview-host>/api/health"
curl -sS "https://<preview-host>/menu" | head
curl -sS "https://<preview-host>/sitemap.xml" | grep -c "<loc>"
```

Expect health JSON, a menu `<title>`, and 62 `<loc>` entries until the product file changes.

Form check, from the browser on `https://<preview-host>/contact` only:

- Submit one enquiry with a name and phone you can recognize as a test.
- Confirm the UI shows success.
- In hPanel file manager, find `backend/data/enquiries.json` under the live Node directory (`hbuilds/current/nodejs` on current Hostinger docs).
- Redeploy the same commit.
- Open the file again. If the test row is gone, F-01 is confirmed on your account. Do not cut DNS until you accept that or you have an export.

Do not post that test to the Render production host.

Cross-origin check:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" \
  -H "Origin: https://example.com" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9100000000","message":"ignore"}' \
  "https://<preview-host>/api/enquiries"
```

Expect `403`.

## 6. DNS cutover

Only after you say yes.

1. Lower TTL if the panel allows.
2. Attach `chiranshfoods.com` to the existing Node app. Redirect `www` to the apex. F-05.
3. Wait for the certificate to show as issued. Do not upload a random certificate file.
4. Check:

```bash
curl -sSI http://chiranshfoods.com/
curl -sSI https://chiranshfoods.com/api/health
curl -sSI https://www.chiranshfoods.com/
```

Expect HTTP to redirect to HTTPS, health 200, and `www` to redirect once to the apex.

5. Update `backend/data/settings.json` `domain.canonical_base` to `https://chiranshfoods.com` in a reviewed Git change. Redeploy. F-03.
6. Confirm view-source canonical and `https://chiranshfoods.com/robots.txt` both use the new origin.
7. Leave Render running. Optionally add the Render redirect that Render’s docs describe for retired custom domains. The old host can keep serving until you are satisfied.

## 7. Rollback

1. In Hostinger DNS, remove the new website records or point the name back to Render using the records Render displays.
2. DNS rollback does not restore enquiry rows that were written only on Hostinger. F-01.
3. Render is still the previous application. Do not delete it in the same week as the cutover.
4. If the Hostinger build is bad but DNS was not changed, rollback is “keep the last successful Hostinger deployment” or simply ignore Hostinger. Visitors are still on Render.

## 8. Aftercare

- Watch hPanel logs for HTTP 500s on `/api/enquiries`.
- Export enquiries before every production deploy until F-01 is solved in code.
- Renew the domain before expiry. Auto-renewal is on by default at Hostinger; confirm the card on file.
- Do not enable HSTS preload.
