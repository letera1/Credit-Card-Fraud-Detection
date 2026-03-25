# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### 1. ModuleNotFoundError: No module named 'imblearn'

**Error:**
```
ModuleNotFoundError: No module named 'imblearn'
```

**Solution:**
```bash
pip install imbalanced-learn
# OR
pip install -r requirements.txt
```

#### 2. Port 8000 already in use

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:8000 | xargs kill -9
```

#### 3. Model not found error

**Solution:**
```bash
# Download dataset from Kaggle
# Place creditcard.csv in data/ folder
python scripts/train.py
```

### Frontend Issues

#### 1. CSS Error: border-border class does not exist

**Error:**
```
The `border-border` class does not exist
```

**Solution:**
This has been fixed in `frontend/src/app/globals.css`. If you still see it:
```bash
cd frontend
rm -rf .next
npm run dev
```

#### 2. Dependency conflict with React

**Error:**
```
ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
```

#### 3. Port 3000 already in use

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

#### 4. "next: command not found"

**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Installation Issues

#### 1. Python dependencies won't install

**Solution:**
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Node.js not found

**Solution:**
- Download and install Node.js 18+ from https://nodejs.org/
- Restart your terminal
- Verify: `node --version`

#### 3. Python not found

**Solution:**
- Download and install Python 3.8+ from https://python.org/
- Make sure to check "Add Python to PATH" during installation
- Restart your terminal
- Verify: `python --version`

### Runtime Issues

#### 1. API returns 500 error

**Check:**
1. Backend logs for errors
2. Model files exist in `models/` directory
3. Configuration in `config/config.yaml`

**Solution:**
```bash
# Check backend logs
# Look for specific error messages
# Train models if missing
python scripts/train.py
```

#### 2. Frontend can't connect to backend

**Check:**
1. Backend is running on port 8000
2. `.env.local` has correct API URL
3. No CORS errors in browser console

**Solution:**
```bash
# Check .env.local
cat frontend/.env.local
# Should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Restart frontend
cd frontend
npm run dev
```

#### 3. Prediction returns error

**Check:**
1. All 30 features (V1-V28, Time, Scaled_Amount) are provided
2. Values are numeric
3. Backend model is loaded

**Solution:**
- Use "Generate Random" button to test with valid data
- Check browser console for errors
- Check backend logs

### Docker Issues

#### 1. Docker containers won't start

**Solution:**
```bash
# Check logs
docker-compose -f docker-compose.fullstack.yml logs

# Rebuild without cache
docker-compose -f docker-compose.fullstack.yml build --no-cache

# Start again
docker-compose -f docker-compose.fullstack.yml up -d
```

#### 2. Network issues between containers

**Solution:**
```bash
# Recreate network
docker-compose -f docker-compose.fullstack.yml down
docker network prune
docker-compose -f docker-compose.fullstack.yml up -d
```

#### 3. Volume permission issues

**Solution:**
```bash
# Linux/Mac
sudo chown -R $USER:$USER models/ logs/

# Windows
# Run Docker Desktop as Administrator
```

### Performance Issues

#### 1. Slow predictions

**Check:**
- Model size
- System resources (CPU, RAM)
- Number of concurrent requests

**Solution:**
- Use smaller model
- Increase system resources
- Implement caching

#### 2. Frontend slow to load

**Solution:**
```bash
cd frontend
npm run build
npm start
```

### Development Issues

#### 1. Hot reload not working

**Frontend:**
```bash
cd frontend
rm -rf .next
npm run dev
```

**Backend:**
```bash
# Make sure using --reload flag
python -m uvicorn src.api.app:app --reload
```

#### 2. Changes not reflecting

**Solution:**
- Clear browser cache (Ctrl+Shift+R)
- Restart development server
- Check file is saved

## Getting Help

### Check Logs

**Backend:**
```bash
# Terminal output
# OR
cat logs/fraud_detection_*.log
```

**Frontend:**
```bash
# Browser console (F12)
# Terminal output
```

### Verify Setup

**Backend:**
```bash
curl http://localhost:8000/health
```

**Frontend:**
```bash
# Open http://localhost:3000 in browser
```

### Still Having Issues?

1. Check all documentation:
   - [RUN_ME_FIRST.md](RUN_ME_FIRST.md)
   - [QUICK_START.md](QUICK_START.md)
   - [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)

2. Verify prerequisites:
   - Python 3.8+
   - Node.js 18+
   - pip and npm installed

3. Try clean install:
   ```bash
   # Backend
   pip uninstall -r requirements.txt -y
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json .next
   npm install --legacy-peer-deps
   ```

4. Use Docker as alternative:
   ```bash
   docker-compose -f docker-compose.fullstack.yml up -d
   ```

## Quick Fixes Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`cd frontend && npm install --legacy-peer-deps`)
- [ ] Dataset in `data/` folder (if training)
- [ ] Models trained (`python scripts/train.py`)
- [ ] Ports 3000 and 8000 available
- [ ] `.env.local` file exists in frontend
- [ ] No firewall blocking localhost

---

**Last Updated:** 2024
