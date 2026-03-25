# 🚀 START HERE - Run Both Services

## ⚡ Quickest Way (Windows)

**Just double-click this file:**
```
start-fullstack.bat
```

This will:
1. ✅ Check all dependencies
2. ✅ Install missing packages
3. ✅ Start backend (port 8000)
4. ✅ Start frontend (port 3000)
5. ✅ Open in separate windows

## 🌐 Access Your Application

After starting:
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛑 Stop Services

- Press any key in the startup script window
- OR close both terminal windows

## 📝 Alternative: Manual Start

If the script doesn't work, open TWO terminals:

**Terminal 1 - Backend:**
```bash
python -m uvicorn src.api.app:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## ⚠️ First Time Setup

### If you see "Model not found" error:

1. Download dataset from: https://www.kaggle.com/mlg-ulb/creditcardfraud
2. Place `creditcard.csv` in `data/` folder
3. Run: `python scripts/train.py`

### If frontend won't start:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### If backend won't start:

```bash
pip install -r requirements.txt
python -m uvicorn src.api.app:app --reload
```

## 🎯 What to Do Next

1. ✅ Start both services (use start-fullstack.bat)
2. ✅ Open http://localhost:3000
3. ✅ Click "Generate Random" button
4. ✅ Click "Analyze Transaction"
5. ✅ See fraud prediction result!

## 📚 More Help

- **Quick Start**: See [QUICK_START.md](QUICK_START.md)
- **Full Setup**: See [FULLSTACK_SETUP.md](FULLSTACK_SETUP.md)
- **Frontend**: See [frontend/README.md](frontend/README.md)
- **API Docs**: http://localhost:8000/docs (after starting backend)

## 🐳 Docker Alternative

If you have Docker installed:

```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

Then access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

**Need Help?** Check [QUICK_START.md](QUICK_START.md) for troubleshooting!
