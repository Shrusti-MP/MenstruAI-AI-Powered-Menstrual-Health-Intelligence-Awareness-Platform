Write-Host "Starting MenstruAI FastAPI Backend on port 8000..." -ForegroundColor Cyan
& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --app-dir backend --port 8000
