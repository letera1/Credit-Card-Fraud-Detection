@echo off
REM Fraud Detection AI - Quick Deploy Script for Windows
REM This script helps you deploy the application quickly

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   Fraud Detection AI - Quick Deployment Script        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)
echo [OK] Docker is installed

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)
echo [OK] Docker Compose is installed

REM Check if models exist
if not exist "models\best_fraud_model.pkl" (
    echo [WARNING] ML model not found. Training required.
    echo.
    set /p train_model="Do you want to train the model first? (y/n) "
    if /i "%train_model%"=="y" (
        echo Training ML model...
        
        REM Check if Python is available
        where python >nul 2>nul
        if %errorlevel% equ 0 (
            python train_advanced_model.py
        ) else (
            echo [ERROR] Python is not installed. Please install Python 3.11+
            exit /b 1
        )
        
        echo [OK] Model training complete
    )
)

REM Create .env files if they don't exist
if not exist ".env" (
    echo Creating .env file...
    if exist ".env.example" (
        copy .env.example .env >nul
    ) else (
        echo # Backend Environment > .env
    )
)

if not exist "frontend\.env.local" (
    echo Creating frontend .env.local file...
    if exist "frontend\.env.example" (
        copy frontend\.env.example frontend\.env.local >nul
    ) else (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000 > frontend\.env.local
    )
)

REM Build and start services
echo.
echo Building Docker images...
docker-compose build

echo.
echo Starting services...
docker-compose up -d

REM Wait for services to be healthy
echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Health check
echo.
echo Checking service health...

set MAX_RETRIES=30
set RETRY_COUNT=0

:health_check
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is healthy
    goto health_ok
)

set /a RETRY_COUNT+=1
if %RETRY_COUNT% geq %MAX_RETRIES% (
    echo [WARNING] Backend health check failed. Check logs with: docker-compose logs backend
    goto health_ok
)

echo Waiting for backend... (%RETRY_COUNT%/%MAX_RETRIES%)
timeout /t 2 /nobreak >nul
goto health_check

:health_ok
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              Deployment Complete!                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo.
echo Useful commands:
echo   docker-compose logs -f     View logs
echo   docker-compose down        Stop services
echo.

endlocal
