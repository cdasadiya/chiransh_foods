# Repository audit

Inspection date: 28 October 2026, IST. Scope: the Git checkout at the repository root. Hidden dependency folders such as `node_modules`, `frontend/dist`, and `.venv` are not in the checkout. Ignored runtime data is noted from `.gitignore`, not from a live disk on Render.

The inventory is grouped. Listing every image would not change the deployment decision. Production relevance means “needed for the public site,” not “needed to compile on a developer laptop.”

## Application shape

| Path | Purpose | Production? | Follow-up |
| --- | --- | --- | --- |
| `server.mjs` | Production HTTP server: pages, SEO injection, `/api`, robots, sitemap | Yes | This is the process Hostinger must start |
| `package.json` | Root scripts. `postinstall` installs and builds `frontend/`. `start` runs `node server.mjs`. Engines: Node `22.x` | Yes | Build must run this install, not a static copy of `dist` alone |
| `yarn.lock` | Yarn v1 lockfile header only. No packages are locked at the root | Yes, as a signal | Hostinger may select Yarn because this file exists. The real JavaScript lock is `frontend/package-lock.json` |
| `render.yaml` | Render service: Node, branch `main`, `yarn` then `yarn start`, health `/api/health`, `NODE_VERSION=22.14.0` | Documents current host | Do not assume a future Hostinger app reads this file |
| `README.md` | Human setup and the Render deploy description | No | Canonical host is documented as the Render URL |
| `.github/workflows/ci.yml` | GitHub Actions: Node 22 frontend build and Vitest; Python 3.12 pytest | No | CI was not re-run for this audit |
| `.gitignore` | Ignores `node_modules/`, `dist/`, virtualenvs, `.env`, and `backend/data/enquiries.json` | Protects secrets and runtime data | No `.env` file is present, and no `.env.example` is present |
| `.gitattributes` | Line-ending attributes | No | None |

## Frontend

| Path | Purpose | Production? | Follow-up |
| --- | --- | --- | --- |
| `frontend/package.json` | React 19, Vite 8, React Router 7, i18next, Tailwind 4. Node `>=20.19.0 <23` | Build time | Compatible with Node 22 |
| `frontend/package-lock.json` | npm lock used by `npm ci` in `postinstall` and in CI | Build time | Keep it in Git |
| `frontend/index.html` | Vite shell. Default title and description. Self-hosted fonts | Built into `dist` | Production replaces the title per URL inside `server.mjs` |
| `frontend/vite.config.js` | Dev server, `/api` proxy to port 8001, manual chunks | Build time | `API_PROXY_TARGET` is development only |
| `frontend/src/` | Pages, components, English and Gujarati copy, SEO helpers, enquiry rules | Built into the browser bundle. `seo.js` and `enquiry.js` are also imported by `server.mjs` | Do not delete `frontend/src` on the server: the Node process imports it |
| `frontend/public/images/` | 54 WebP files and 1 JPEG Open Graph image | Yes, copied into `dist` | Not individually audited for pixel dimensions |
| `frontend/public/fonts/` | 21 WOFF2 files and `fonts.css` | Yes | Self-hosted |
| `frontend/public/robots.txt` | Static robots file pointing at the Render host | Overridden in production | `server.mjs` generates `/robots.txt` from settings |
| `frontend/public/sitemap.xml` | Static sitemap, 50 URLs, 16 dishes | Overridden in production | Live server sitemap had 62 URLs and 22 dishes. See F-09 |
| `frontend/public/.well-known/security.txt` | Contact and policy URLs on the Render host | Served if requested as a static file | Update the host when the domain changes |
| `frontend/public/favicon.svg` | Icon | Yes | None |

`frontend/dist/` is build output. It is gitignored. It must be created by `yarn` / `npm install` before `server.mjs` will start (`server.mjs` lines 367–369).

## Backend data and the local Python API

| Path | Purpose | Production? | Follow-up |
| --- | --- | --- | --- |
| `backend/data/products.json` | 22 menu items. Read by `server.mjs` | Yes | Source of the live menu |
| `backend/data/settings.json` | Phone, WhatsApp, hours, areas, social links, FSSAI licence, canonical URL | Yes | Public business data, not a secret. Email and maps URL are null |
| `backend/data/enquiries.json` | Created at runtime by `POST /api/enquiries`. Gitignored | Yes, and it is the only writable data | Lost when the app directory is replaced. F-01 |
| `backend/server.py` | FastAPI mock of the same routes for local use | No | Open CORS. Not the Render process. F-12 |
| `backend/test_server.py` | Pytest for the mock | No | Does not prove Render behaviour |
| `backend/requirements.txt` | FastAPI and Uvicorn pins | No | Not installed on the production host |
| `requirements.txt` | Full Python set for API, tests, and Playwright. Comment says resolved on Python 3.12 | No | Do not install this on Hostinger web hosting |
| `run.sh`, `run.bat` | Local Vite on port 3000 and Uvicorn on port 8001. Python 3.10+ | No | Not a production start command |
| `scripts/crawl.py`, `scripts/capture.py` | Playwright helpers | No | Not part of the website process |

## Not present

These were looked for and are absent: `Dockerfile`, `docker-compose`, `Procfile`, `runtime.txt`, `pyproject.toml`, `.python-version`, `.env`, `.env.example`, database migrations, ORM models, and an admin UI.

## Generated and unrelated material

Do not deploy `node_modules/`, `.venv/`, `__pycache__/`, `.pytest_cache/`, or editor folders. Do not treat `frontend/dist/` as a hand-edited source. Do not commit `backend/data/enquiries.json`.

## Tests that exist, and what this audit did not run

CI (`.github/workflows/ci.yml`) installs the frontend, builds it, runs `npm test`, then runs pytest for `backend/test_server.py` on Python 3.12. This audit did not install packages and did not re-run those tests. Current CI status is **Not Verified** in this session.

Frontend tests cover enquiry rules, catalog alignment, SEO helpers, contact UI, menu, product pages, and an integration test for `server.mjs` (`frontend/src/server.integration.test.js`). That integration test is part of `npm test` because it lives under `frontend/src/`.

## Production file set, in one sentence

A production machine needs the repository root, `server.mjs`, `frontend/` (source, lockfile, and public assets), and `backend/data/products.json` plus `settings.json`, then a build that creates `frontend/dist`. It does not need Python.
