#!/bin/bash

echo "============================================"
echo "Starting Credit Card Fraud Detection"
echo "Full Stack Application"
echo "============================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

echo "[1/4] Checking backend dependencies..."
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "Installing backend dependencies..."
    pip3 install -r requirements.txt
fi

echo ""
echo "[2/4] Checking frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --legacy-peer-deps
fi
cd ..

echo ""
echo "[3/4] Starting Backend API on port 8000..."
python3 -m uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo ""
echo "[4/4] Starting Frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "Services Started Successfully!"
echo "============================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services..."

# Trap Ctrl+C and cleanup
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for processes
wait
