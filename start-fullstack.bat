@echo off
echo ============================================
echo Starting Credit Card Fraud Detection
echo Full Stack Application
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/4] Checking backend dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing backend dependencies...
    pip install -r requirements.txt
) else (
    echo Backend dependencies found. Checking imbalanced-learn...
    pip show imbalanced-learn >nul 2>&1
    if errorlevel 1 (
        echo Installing imbalanced-learn...
        pip install imbalanced-learn
    )
)

echo.
echo [2/4] Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install --legacy-peer-deps
)
cd ..

echo.
echo [3/4] Starting Backend API on port 8000...
start "Backend API" cmd /k "python -m uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting Frontend on port 3000...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ============================================
echo Services Started Successfully!
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo Stopping services...
taskkill /FI "WINDOWTITLE eq Backend API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /T /F >nul 2>&1

echo Services stopped.
pause
