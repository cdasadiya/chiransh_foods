# Chiransh Foods — local copy of `baroda-street-food.preview.emergentagent.com`

Delivery Food Partner (`chiransh_foods`).

A runnable, fully offline local copy of the Chiransh Foods site (100% vegetarian
Gujarati street food: Baroda-style Sev Usal, Tuvar Totha). The frontend is the
**original React source**, recovered from the public webpack source map
(`/static/js/bundle.js.map`, which includes `sourcesContent`). It is wrapped in a
Vite + Tailwind toolchain, and a small FastAPI mock replaces the original backend.

## Run it

**Requirements:** Node.js **20 or newer** with npm (react-router v7 needs Node 20; tested on
20.19), and Python **3.10 or newer** (FastAPI/uvicorn need 3.10; tested on 3.13). Works offline
after the first `npm install` / `pip install`.

### One command

| OS | Command |
|---|---|
| Linux / macOS | `./run.sh` (if it isn't executable after unzipping: `bash run.sh`, or `chmod +x run.sh` first) |
| Windows (cmd or PowerShell) | `run.bat` (opens the API in a second window) |

Both scripts check your Node/Python versions, create `backend/.venv`, install the Python
requirements, run `npm install` the first time, start the mock API on `127.0.0.1:8001` and the
dev server, then open **http://localhost:3000**. Ctrl-C stops everything (on Windows, close the
API window too).

### Manually (two terminals)

```bash
# terminal 1: mock API
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt            # Windows: .venv\Scripts\pip install -r requirements.txt
.venv/bin/uvicorn server:app --port 8001 --reload    # Windows: .venv\Scripts\uvicorn server:app --port 8001 --reload

# terminal 2: website
cd frontend
npm install
npm run dev                                          # http://localhost:3000  (/api is proxied to :8001)
```

On Windows use `py -3 -m venv .venv` (or `python -m venv .venv`) for the first backend step.

### Production build

```bash
cd frontend
npm run build          # outputs dist/
npm run preview        # http://localhost:4173  (/api is still proxied to :8001; start the API first)
```

### Notes

* Open `http://localhost:…`. On Node 17+ the dev/preview servers bind to `localhost`, which
  can resolve to IPv6 `::1` only, so `http://127.0.0.1:3000` may refuse to connect. To expose
  the server on all interfaces, use `npm run dev -- --host`.
* The frontend calls same-origin `/api/...`. Vite proxies it to `http://127.0.0.1:8001`;
  change the target with `API_PROXY_TARGET=http://host:port`, or set `VITE_BACKEND_URL`
  at build time to call an absolute API origin.
* **The site works with the API stopped.** Home, Menu, both dish pages, About, Gallery,
  FAQ and the legal pages render from the built-in fallback data in `src/lib/site.js`.
  Without the API you lose: the WhatsApp number/social links (they come from
  `/api/settings`; the fallback settings have none, so only "Contact us" buttons show) and
  the contact form (it shows a "Something went wrong" toast). The browser console will log
  the failed `/api` requests (proxy 500s); that's expected while the API is down.
* To host `dist/` statically, the host needs SPA fallback (all routes → `index.html`)
  and an `/api` reverse proxy.

## How the original is built

| Layer | Original (Emergent AI app builder) | This copy |
|---|---|---|
| Frontend | React 19 + react-router v7, **Create React App via craco** (webpack dev server, `bundle.js` served in dev mode with source maps), `@/` → `src/` alias | Same source, built with **Vite 6** |
| Styling | Tailwind CSS 3.4.17 + shadcn/ui-style HSL CSS variables, `tailwindcss-animate` | Tailwind 3.4.17; config rebuilt from the compiled CSS. `index.css` is the original (recovered from the CSS source map) |
| Motion | framer-motion (scroll reveals, lightbox, hero), Lenis smooth scroll, CSS marquee | same |
| Data | `@tanstack/react-query` + axios → `${REACT_APP_BACKEND_URL}/api` | same, via `import.meta.env.VITE_BACKEND_URL` |
| Backend | FastAPI (+ MongoDB, judging by `_id` ObjectIds) behind `/api` | `backend/server.py` (FastAPI) + JSON files |
| Images | AI-generated brand images on `static.prod-images.emergentagent.com` | local `frontend/public/images/*.webp` |
| Fonts | Google Fonts CDN | self-hosted woff2 in `frontend/public/fonts/` |
| Extras | Emergent scripts: `emergent-main.js`, error overlay + rrweb session recorder, `visual-edit-overlay.js` + Tailwind CDN (in iframe only), PostHog analytics (`ap.emergent.sh`), Cloudflare challenge/insights | **removed** (see below) |

### API (captured from the live site, reproduced in the mock)

| Method | Path | Notes |
|---|---|---|
| GET | `/api/` | `{"message":"Chiransh Foods API","status":"ok"}` |
| GET | `/api/health` | `{"status":"ok"}` |
| GET | `/api/products` | 2 products (`backend/data/products.json`) |
| GET | `/api/products/{slug}` | 404 `{"detail":"Product not found"}` if unknown |
| GET | `/api/settings` | contact/WhatsApp, location, hours, ordering, socials (`backend/data/settings.json`) |
| POST | `/api/enquiries` | contact form. Validated (422 with `Value error, …` messages like FastAPI/pydantic), appended to `backend/data/enquiries.json` |

I did not POST to the live `/api/enquiries`, so I wouldn't create a fake enquiry
in your real database. The mock's validation copies the frontend's rules.

### Folder structure

```
backend/
  server.py              FastAPI mock API
  data/products.json     products captured from the live API (image paths localised)
  data/settings.json     site settings captured from the live API
  requirements.txt       fastapi, uvicorn
run.sh / run.bat         one-command start (Linux/macOS / Windows)
frontend/
  index.html             cleaned entry HTML (no Emergent/PostHog/Cloudflare scripts)
  vite.config.js         @ alias, .js-as-JSX, /api proxy, vendor chunk splitting
  tailwind.config.js     reconstructed theme (palette, fonts, shadows, slow-spin)
  public/images/         10 WebP images + og-image.jpg
  public/fonts/          self-hosted Google Fonts + fonts.css
  public/{favicon.svg,robots.txt,sitemap.xml}
  src/
    index.js, App.js, index.css
    pages/      Home, Menu, ProductDetail, About, Gallery, Contact, FAQ,
                Privacy, Terms, Refund, Legal (shared layout), NotFound
    components/ Navbar, Footer, Logo, Marquee, OrderButtons, ProductCard,
                Reveal, SectionHeading, SmoothScroll, Values, VegMark,
                ErrorBoundary, ui/sonner
    context/SettingsContext.jsx   loads /api/settings
    hooks/usePageMeta.js          per-page title/meta/OG/JSON-LD
    lib/api.js, lib/site.js       axios client, constants, fallbacks, helpers
scripts/
  capture.py   screenshots + console/network report for every route
  crawl.py     crawls all internal links and tests nav, tabs, FAQ, lightbox, form
screenshots/   original/, clone/, side-by-side/
```

### Routes / sections

`/` (hero with rotating badge and floating dish cards → marquee → Signature
bento → values → story snapshot → menu preview → order band), `/menu`
(category tabs: Gujarati Street Food / Fast Food / Indian), `/menu/:slug`
(`baroda-style-sev-usal`, `tuvar-totha`), `/about`, `/gallery` (masonry with
10 images and a keyboard-navigable lightbox), `/contact` (enquiry form +
WhatsApp), `/faq` (accordion + FAQPage JSON-LD), `/privacy`, `/terms`,
`/refund`, `*` → 404 page.

### Color palette

| Token | Hex | Use |
|---|---|---|
| `leaf` | `#142D21` | primary deep green, header/footer, `theme-color` |
| `forest` | `#1A3A2A` | secondary green |
| `cream` | `#FAF7F2` | page background |
| `ivory` | `#FFFDF9` | cards |
| `charcoal` | `#1C1917` | body text |
| `saffron` | `#D97706` | accent / CTAs / focus ring / selection |
| `saffron-deep` | `#B45309` | accent text |
| `gold` | `#D4AF37` | italic highlights on dark backgrounds |
| `chili` | `#DC2626` | error / alert |

The shadcn CSS variables in `index.css` use HSL equivalents (e.g. `--primary: 157 38% 13%`).

### Fonts

* **Cormorant Garamond** 500/600/700 + italic 500/600: headings (`font-serif`)
* **Plus Jakarta Sans** 400–700: body (`font-sans`)
* **Outfit** 500–700: labels/eyebrows (`font-display`)
* **Noto Serif Gujarati** 500–700: Gujarati names such as સેવ ઉસળ (`font-guj`)

## What was removed (it phones home and isn't needed offline)

* `https://assets.emergent.sh/scripts/emergent-main.js` (Emergent platform script)
* Inline Emergent preview error overlay + `/__emergent_overlay__/recorder.js`
  (rrweb session recorder that POSTs to `/__emergent_overlay__/report`)
* `/visual-edit-overlay.js` + `cdn.tailwindcss.com` (loaded only inside the Emergent editor iframe)
* PostHog analytics snippet (`ap.emergent.sh`, key `phc_DbsPb…`)
* Cloudflare bot-challenge iframe (`/cdn-cgi/challenge-platform/…`) and
  Cloudflare Insights beacon (injected by the CDN)
* The `PerformanceServerTiming` DataCloneError suppressor (it only existed for
  the Emergent recorder)

## Differences from the original

* Build tool is Vite 6 instead of CRA/craco (the original `package.json`,
  `craco.config.js` and `tailwind.config.js` aren't in the source map, so they
  were rebuilt). The compiled CSS output was checked against the original's.
* Changes I made on purpose (listed under "Fixes" below): WebP images,
  route code splitting, light-only toasts, a mobile overflow fix on /about, and
  absolute og:image URLs.
* `robots.txt` / `sitemap.xml` are copied as-is. They point at
  `https://chiranshfoods.com`, which doesn't resolve yet (the original sitemap
  calls it a placeholder). Update them once the domain is live.
* External links (WhatsApp `wa.me/919106354619`, Instagram/Facebook/YouTube
  `@chiranshfoods`) still go to the real services. All of them resolved when checked.

## Fixes

### Problems on the original site
1. **Horizontal scroll on mobile on `/about`**: a decorative dot-pattern
   (`-right-6`) stuck out 8px past the viewport at 390px width. Now
   `-right-4 sm:-right-6`, so desktop is unchanged.
2. **Dark toasts in OS dark mode**: `ui/sonner.jsx` used next-themes'
   `useTheme()` without a `ThemeProvider`, so it fell back to `"system"`. The
   site is light-only, so the theme is now pinned to `"light"` and `next-themes`
   is removed.
3. **Heavy images**: 10 JPEGs totalling 8.5 MB served at full quality. Now
   WebP q80 at the same dimensions, 1.3 MB total (−84%), plus a 175 KB
   progressive JPEG for `og:image`.
4. **Single 3.3 MB dev bundle** (the preview serves the unminified CRA dev
   build). Now a minified production build: non-home routes are lazy-loaded and
   vendor code is split into `react` / `motion` / `vendor` / `icons` chunks.
5. **Unused leftovers**: `tailwindcss-animate` and the Radix accordion
   keyframes (no Radix components are used) are removed.
6. **Telemetry requests that always fail**: the Emergent overlay's
   `/__emergent_overlay__/report` beacons failed (`ERR_ABORTED`) 3× on every
   page. Removed along with the other Emergent/PostHog scripts.

### Problems I introduced in the copy and then fixed
1. Image URLs written as `${IMG}/<hash>.jpeg` templates (Gallery, About)
   weren't switched to `.webp` in the first pass, so 14 images broke. The
   crawler caught it. All references now point at existing files.
2. Relative `og:image` / `twitter:image` / Product JSON-LD `image` after
   making images local. Added `absUrl()` in `lib/site.js` so they're absolute again.
3. A circular manual-chunk warning (`react -> data -> react`). Replaced with
   function-based chunking.
4. `process.env.REACT_APP_BACKEND_URL` (CRA-only). Now `import.meta.env.VITE_BACKEND_URL`,
   defaulting to same-origin `/api` through the Vite proxy.

### Found in the fresh-install review (second pass)
1. **`./run.sh` failed with "Permission denied" after unzipping**: the zip was built with
   Python `zipfile`, which dropped the executable bit. The zip now stores Unix permissions,
   so `run.sh` stays executable. The README also documents `bash run.sh`.
2. **Wrong Node requirement**: the README said Node 18+, but react-router v7 needs
   Node ≥ 20. The README is corrected and `"engines": {"node": ">=20.0.0"}` is now in
   `frontend/package.json`. `run.sh`/`run.bat` check versions and give clear errors.
3. **No Windows launcher**: added `run.bat` and Windows commands for the manual steps.
   `.gitattributes` keeps `run.sh` LF and `run.bat` CRLF.
4. **`run.sh` hardening**: it now re-runs `pip install -r requirements.txt` on every start
   (a half-finished first install used to be skipped forever), starts uvicorn via
   `python -m uvicorn`, and stops the API on Ctrl-C/TERM as well as normal exit.
5. **`npm audit`: 1 moderate advisory** (esbuild ≤ 0.24.2 via Vite 5, a dev-server
   request-forgery issue). Upgraded to Vite 6.4 / @vitejs/plugin-react 4.7 → `found 0 vulnerabilities`.
6. **Menu and dish pages were dead with the API stopped** ("We couldn't load the menu/dish"),
   even though the bundle already ships fallback data for both dishes. `src/lib/api.js` now
   serves `FALLBACK_PRODUCTS` when the API is unreachable (no response or proxy 5xx). A real
   404 from a running API still shows the "Page not found" view.
7. **127.0.0.1 vs localhost**: the dev server only answered on `localhost` (IPv6). This is
   documented above.

## Verification (2026-10-02, fresh install from the zip)

The zip was unzipped into an empty folder and set up with only the steps above
(`./run.sh`; manual venv + `npm install`; `npm run build && npm run preview`):

* `npm install`: `found 0 vulnerabilities`. `vite build`: no warnings.
* `scripts/crawl.py` on dev (`:3000`) and production preview (`:4173`), at desktop
  1440px and mobile 390px. It reached all 11 internal routes and found 0 console errors,
  0 HTTP ≥ 400, 0 failed requests, 0 broken images, 0 font errors, 0 dangling `#`
  links and 0 horizontal overflow.
* Interactions: mobile nav, menu tabs (All / Gujarati Street Food / Fast Food / Indian),
  dish pages, gallery lightbox (click, ←/→, prev/next buttons, Esc, close), FAQ accordion,
  404 page and unknown-dish slug.
* Contact form: 4 invalid combinations show inline errors and send no request. A valid
  submit POSTs, shows the success toast and is stored in `backend/data/enquiries.json`.
  "Send another" resets the form.
* API stopped: every page still renders, including Menu and both dish pages (from
  fallback data). The contact form shows an error toast.
* `scripts/capture.py` makes zero external requests from the copy.
* The screenshot pixel diff against the original is 0.00% on every route except the
  home marquee band (animated) and a 12×10px area on /contact (caret or animation frame).
