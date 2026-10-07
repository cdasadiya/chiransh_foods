# Chiransh Foods 🍲

Welcome to **Chiransh Foods**, an authentic Gujarati vegetarian street food application. Experience the true soul of Gujarat's culinary heritage, crafted with care and 100% vegetarian ingredients.

## 🌟 Features

- **Authentic Menu**: Browse Baroda-style street food including Sev Usal, Tuvar Totha, and more.
- **Multilingual Support**: Fully localized in English and Gujarati (`i18next`).
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

### Backend (API)
- **FastAPI**: High-performance Python web framework for building APIs.
- **Uvicorn**: Lightning-fast ASGI server.
- **Python 3**: For reliable data serving.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v20.19 or newer, below 23; Render uses Node 22)
- [Python](https://www.python.org/) (v3.10 or higher). All Python packages are pinned in the root [`requirements.txt`](requirements.txt) (API, tests, and helper scripts). The API-only subset is `backend/requirements.txt`.

### Quick Start (Recommended)

The easiest way to start both the frontend and backend servers is by using the provided bash script from the root directory:

```bash
# Make the script executable
chmod +x run.sh

# Start both frontend and backend servers concurrently
./run.sh
```
This script automatically sets up the python virtual environment, installs dependencies, and boots up both servers.
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

In the `frontend` directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally preview the production build.

## Deploy on Render

The live site is a Node web service with the repository root as its root directory. Render runs `yarn` (build) and `yarn start` (start). There is no `package.json` inside a nested app root, so those commands have to live at the repository root.

`yarn` installs the root package and, in `postinstall`, installs and builds `frontend/`. `yarn start` runs `server.mjs`, which listens on Render's `PORT`, serves `frontend/dist` (including client-side routes), and answers `/api` from `backend/data`.

Node is pinned to 22 (`package.json` `engines`, and `NODE_VERSION` in `render.yaml`) so Render does not pick a newer major than this app is tested with.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to open a pull request or file an issue to improve the project.

## 📄 License
© 2026 Chiransh Foods · Gujarat, India. All Rights Reserved.
