@echo off
echo ========================================================
echo       Starting MenstruAI Full-Stack Platform
echo ========================================================
echo.

echo 1. Launching FastAPI Backend on http://localhost:8000 ...
start "MenstruAI Backend" cmd /k "cd backend && ..\venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload"

echo 2. Launching Vite React Frontend on http://localhost:5173 ...
start "MenstruAI Frontend" cmd /k "cd frontend && npm run dev"

echo 3. Waiting for servers to initialize (5 seconds)...
timeout /t 5 /nobreak >nul

echo 4. Opening MenstruAI in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo   MenstruAI is live and ready for review demonstration!
echo.
echo   Frontend URL:   http://localhost:5173
echo   Backend API:    http://127.0.0.1:8000
echo   API Docs:       http://127.0.0.1:8000/api/v1/docs
echo   Health Status:  http://127.0.0.1:8000/api/health
echo.
echo   Demo Account:
echo     Email:    demo@menstruai.com
echo     Password: Password123!
echo.
echo   (If MySQL is not running, start it from Services first)
echo ========================================================
pause
