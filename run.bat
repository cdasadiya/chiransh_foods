@echo off
REM Windows: start the mock API (127.0.0.1:8001) in a second window and the
REM Vite dev server (http://localhost:3000) in this one.
REM Needs: Node >= 20 (with npm) and Python >= 3.10 on PATH ("py" launcher or "python").
setlocal
cd /d "%~dp0"

where py >nul 2>nul && (set "PY=py -3") || (set "PY=python")
%PY% -c "import sys; sys.exit(sys.version_info < (3, 10))" || (echo error: Python 3.10+ required & exit /b 1)
node -e "process.exit(Number(process.versions.node.split('.')[0]) < 20 ? 1 : 0)" || (echo error: Node 20+ required & exit /b 1)

if not exist backend\.venv\Scripts\python.exe %PY% -m venv backend\.venv
backend\.venv\Scripts\python.exe -m pip install -q -r backend\requirements.txt || exit /b 1
if not exist frontend\node_modules (pushd frontend & call npm install & popd)

start "Chiransh API :8001" /D "%~dp0backend" "%~dp0backend\.venv\Scripts\python.exe" -m uvicorn server:app --host 127.0.0.1 --port 8001
cd frontend
call npm run dev