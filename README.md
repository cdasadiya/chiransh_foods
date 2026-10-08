# Chiransh Foods 🍲

Welcome to **Chiransh Foods**, an authentic Gujarati vegetarian street food application. Experience the true soul of Gujarat's culinary heritage, crafted with care and 100% vegetarian ingredients.

## 🌟 Features

- **Authentic Menu**: Browse Baroda-style street food including Sev Usal, Tuvar Totha, and more.
- **Multilingual Support**: English pages stay on the normal URLs. Gujarati pages use the same path under `/gu`. The language button switches the address.
- **Responsive & Accessible**: Beautifully designed UI that works seamlessly across all devices.
- **Dynamic Content**: Data-driven UI fetching products seamlessly from the backend API.
- **Premium Aesthetics**: Elegant design with smooth transitions and animations.

## 🛠 Technology Stack

This project is built using modern web development technologies to ensure a fast, reliable, and smooth user experience.

### Frontend
- **React 19**: Modern component-based UI.
- **Vite 8**: Next-generation, lightning-fast frontend tooling.
- **Tailwind CSS 4**: Utility-first CSS framework for rapid styling.
- **React Router Dom 7**: Declarative routing for single-page applications.
- **Framer Motion**: Production-ready animation library.
- **Lucide React**: Beautiful and consistent iconography.
- **i18next**: Robust internationalization framework for English & Gujarati support.

### Production server
- **Node.js**: `server.mjs` serves the built site, per-page SEO, and `/api` on Render.
- **JSON data**: Menu and settings live in `backend/data`.

### Local API
- **FastAPI**: Local mock of the same API, used with `./run.sh` and pytest.
- **Uvicorn**: ASGI server for that local API.
- **Python 3.10+**: Required for the local API, tests, and helper scripts.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v20.19 or newer, below 23; Render uses Node 22)
- [Python](https://www.python.org/) (v3.10 or higher). All Python packages are pinned in the root [`requirements.txt`](requirements.txt) (API, tests, and helper scripts). The API-only subset is `backend/requirements.txt`.

### Quick Start (Recommended)

The easiest way to start both the frontend and backend servers is from the repository root:

```bash
# Linux or macOS
chmod +x run.sh
./run.sh
```

```bat
REM Windows
run.bat
```

The script sets up the Python virtual environment, installs dependencies, and starts both servers.
- Frontend will be available at: `http://localhost:3000`
- Backend API will be available at: `http://127.0.0.1:8001`

### Manual Installation

If you prefer to run the services separately, follow these steps:

#### 1. Start the Backend
Open a terminal in the project root and run:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt          # API only; use ../requirements.txt for tests and scripts too
python -m uvicorn server:app --host 127.0.0.1 --port 8001
```

#### 2. Start the Frontend
Open a **new** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```

## 📜 Available Scripts

From the repository root, the same commands Render uses are:

- `yarn` or `npm install`: Installs dependencies and builds `frontend/dist`.
- `yarn start` or `npm start`: Serves that build with `server.mjs`, including page SEO tags and `/api`.

In the `frontend` directory:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Serves the built files only. It does not inject the production SEO tags or the API. Use `yarn start` from the repository root for that.

## Public site details

Editable public facts live in [`backend/data/settings.json`](backend/data/settings.json): Ahmedabad, the pickup areas, daily hours, the phone and WhatsApp number, and the canonical host `https://chiransh-foods.onrender.com`. Email and the Google Maps link are still empty.

The contact form stores enquiries in `backend/data/enquiries.json`. That file is gitignored.

The canonical host, sitemap, and `robots.txt` use the Render address. `chiranshfoods.com` is not the live site.

## Deploy on Render

The live site is https://chiransh-foods.onrender.com. Merging into `main` publishes it. Render is connected to this GitHub repo and deploys that branch on every commit (`render.yaml`: `branch: main`, `autoDeployTrigger: commit`). There is no manual copy step in the Render dashboard.

The service root is the repository root. Render runs `yarn` to build and `yarn start` to serve. `yarn` installs the root package and, in `postinstall`, installs and builds `frontend/`. `yarn start` runs `server.mjs`, which listens on Render's `PORT`, serves `frontend/dist` (including client-side routes), and answers `/api` from `backend/data`. Render checks `/api/health` before the new deploy goes live.

Node is pinned to 22 (`package.json` `engines`, and `NODE_VERSION` in `render.yaml`) so Render does not pick a newer major than this app is tested with.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to open a pull request or file an issue to improve the project.

## 📄 License
© 2026 Chiransh Foods · Gujarat, India. All Rights Reserved.
