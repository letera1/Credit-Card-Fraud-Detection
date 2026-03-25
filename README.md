# Credit Card Fraud Detection - Full Stack

Production-ready fraud detection system with ML backend and modern frontend.

## Quick Start

### Windows
Double-click: `start-fullstack.bat`

### Manual Start
```bash
# Terminal 1 - Backend
python -m uvicorn src.api.app:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Docker
```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## First Time Setup

1. Install backend dependencies:
```bash
pip install -r requirements.txt
```

2. Install frontend dependencies:
```bash
cd frontend
npm install --legacy-peer-deps
```

3. Train models (optional):
```bash
python train_model.py
```

## Tech Stack

- **Backend**: Python, FastAPI, scikit-learn, XGBoost
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Deployment**: Docker

## License

MIT
