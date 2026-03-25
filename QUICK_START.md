# Quick Start Guide

## 🚀 Fastest Way to Run Both Services

### Windows

1. **Double-click** `start-fullstack.bat`

OR run in terminal:
```bash
start-fullstack.bat
```

### Linux/Mac

```bash
chmod +x start-fullstack.sh
./start-fullstack.sh
```

The script will:
- ✅ Check dependencies
- ✅ Install missing packages
- ✅ Start backend on port 8000
- ✅ Start frontend on port 3000
- ✅ Open both in separate windows

## 📱 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛑 Stop Services

### Windows
- Press any key in the startup script window
- OR close both terminal windows

### Linux/Mac
- Press `Ctrl+C` in the terminal

## 🔧 Manual Setup (If Script Fails)

### Step 1: Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

### Step 3: Start Backend (Terminal 1)
```bash
python -m uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

## ⚠️ Troubleshooting

### "npm install" fails with dependency conflict

**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
```

### Port 8000 or 3000 already in use

**Windows:**
```bash
# Find process using port
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Backend: "No module named 'fastapi'"

**Solution:**
```bash
pip install -r requirements.txt
```

### Frontend: "next: command not found"

**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
```

### Backend: "Model not found"

**Solution:**
```bash
# Train the model first
python scripts/train.py
```

## 🐳 Alternative: Docker (Easiest)

If you have Docker installed:

```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

This will:
- Build both services
- Start them in containers
- Handle all dependencies automatically

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

Stop:
```bash
docker-compose -f docker-compose.fullstack.yml down
```

## 📊 Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### 2. Check Frontend
Open http://localhost:3000 in your browser

### 3. Test Prediction
- Click "Generate Random" button
- Click "Analyze Transaction"
- See prediction result

## 🎯 Next Steps

1. ✅ Both services running
2. ✅ Frontend accessible at http://localhost:3000
3. ✅ Backend API at http://localhost:8000
4. ✅ Try making a prediction!

## 📚 More Information

- [Full Setup Guide](FULLSTACK_SETUP.md)
- [Frontend README](frontend/README.md)
- [API Documentation](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)

## 💡 Tips

- Use the "Generate Random" button to quickly test
- Check API docs at http://localhost:8000/docs
- Frontend auto-refreshes on code changes
- Backend auto-reloads on code changes

---

**Need Help?** Check the troubleshooting section above or see [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)
