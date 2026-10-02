#!/usr/bin/env bash
# Linux / macOS: start the mock API (127.0.0.1:8001) and the Vite dev server
# (http://localhost:3000) together. Ctrl-C stops both.
# Needs: Node >= 20 (with npm) and Python >= 3.10.  Windows: use run.bat.
set -euo pipefail
cd "$(dirname "$0")"

PY=${PYTHON:-python3}
command -v "$PY" >/dev/null || { echo "error: $PY not found (need Python >= 3.10)"; exit 1; }
"$PY" -c 'import sys; sys.exit(sys.version_info < (3, 10))' || { echo "error: Python >= 3.10 required, found $("$PY" -V)"; exit 1; }
command -v node >/dev/null || { echo "error: node not found (need Node >= 20)"; exit 1; }
node -e 'process.exit(Number(process.versions.node.split(".")[0]) < 20 ? 1 : 0)' || { echo "error: Node >= 20 required, found $(node -v)"; exit 1; }

[ -x backend/.venv/bin/python ] || "$PY" -m venv backend/.venv
backend/.venv/bin/python -m pip install -q -r backend/requirements.txt
[ -d frontend/node_modules ] || (cd frontend && npm install)

(cd backend && exec .venv/bin/python -m uvicorn server:app --host 127.0.0.1 --port 8001) &
API_PID=$!
trap 'kill $API_PID 2>/dev/null || true' EXIT INT TERM
cd frontend && npm run dev
