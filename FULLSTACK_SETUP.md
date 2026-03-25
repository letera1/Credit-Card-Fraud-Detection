# Full Stack Setup Guide

Complete guide to run the Credit Card Fraud Detection full-stack application.

## 📋 Prerequisites

### Backend
- Python 3.8+
- pip

### Frontend
- Node.js 18+
- npm or yarn

### Optional
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start (Docker - Recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Credit-Card-Fraud-Detection
```

### 2. Prepare Dataset
```bash
# Download creditcard.csv from Kaggle
# Place it in the data/ directory
mkdir -p data
# Copy creditcard.csv to data/
```

### 3. Train Models
```bash
# Install Python dependencies
pip install -r requirements.txt

# Train the ML models
python scripts/train.py
```

### 4. Run Full Stack with Docker
```bash
# Build and start both services
docker-compose -f docker-compose.fullstack.yml up -d

# Check logs
docker-compose -f docker-compose.fullstack.yml logs -f
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔧 Manual Setup (Development)

### Backend Setup

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Place dataset
# Download creditcard.csv and place in data/ directory

# 5. Train models
python scripts/train.py

# 6. Start backend server
uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.local.example .env.local

# 4. Edit .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# 5. Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## 📁 Project Structure

```
Credit-Card-Fraud-Detection/
├── backend/                    # Python ML Backend
│   ├── src/                   # Source code
│   ├── config/                # Configuration
│   ├── models/                # Trained models
│   ├── scripts/               # Training scripts
│   └── tests/                 # Unit tests
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities
│   │   └── types/            # TypeScript types
│   └── package.json
│
├── docker-compose.fullstack.yml  # Full stack deployment
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=src --cov-report=html
```

### Frontend Tests
```bash
cd frontend

# Type check
npm run type-check

# Lint
npm run lint
```

## 🐳 Docker Commands

### Build Images
```bash
# Build both services
docker-compose -f docker-compose.fullstack.yml build

# Build specific service
docker-compose -f docker-compose.fullstack.yml build backend
docker-compose -f docker-compose.fullstack.yml build frontend
```

### Start Services
```bash
# Start in detached mode
docker-compose -f docker-compose.fullstack.yml up -d

# Start with logs
docker-compose -f docker-compose.fullstack.yml up
```

### Stop Services
```bash
# Stop services
docker-compose -f docker-compose.fullstack.yml down

# Stop and remove volumes
docker-compose -f docker-compose.fullstack.yml down -v
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.fullstack.yml logs -f

# Specific service
docker-compose -f docker-compose.fullstack.yml logs -f backend
docker-compose -f docker-compose.fullstack.yml logs -f frontend
```

## 🔍 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

**Models not found:**
```bash
# Train models first
python scripts/train.py
```

**Import errors:**
```bash
# Install in development mode
pip install -e .
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Use different port
npm run dev -- -p 3001
```

**API connection failed:**
- Check backend is running on port 8000
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS settings in backend

**Dependencies issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose -f docker-compose.fullstack.yml logs

# Rebuild without cache
docker-compose -f docker-compose.fullstack.yml build --no-cache
```

**Network issues:**
```bash
# Recreate network
docker-compose -f docker-compose.fullstack.yml down
docker network prune
docker-compose -f docker-compose.fullstack.yml up -d
```

## 📊 Verification

### Check Backend Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Check Frontend
Open http://localhost:3000 in browser

### Test Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Time": 0,
    "V1": -1.36,
    "V2": -0.07,
    "V3": 1.0,
    "V4": 0.5,
    "V5": -0.5,
    "V6": 0.2,
    "V7": -0.3,
    "V8": 0.1,
    "V9": -0.2,
    "V10": 0.4,
    "V11": -0.1,
    "V12": 0.3,
    "V13": -0.4,
    "V14": 0.2,
    "V15": -0.1,
    "V16": 0.5,
    "V17": -0.3,
    "V18": 0.2,
    "V19": -0.1,
    "V20": 0.1,
    "V21": -0.2,
    "V22": 0.3,
    "V23": -0.1,
    "V24": 0.2,
    "V25": -0.3,
    "V26": 0.1,
    "V27": -0.2,
    "V28": 0.1,
    "Scaled_Amount": 0.5
  }'
```

## 🚀 Production Deployment

### Backend (AWS/GCP/Azure)
1. Build Docker image
2. Push to container registry
3. Deploy to cloud platform
4. Configure environment variables
5. Set up load balancer
6. Enable auto-scaling

### Frontend (Vercel - Recommended)
```bash
cd frontend
npm install -g vercel
vercel
```

### Full Stack (Docker Swarm/Kubernetes)
- Use provided docker-compose.fullstack.yml
- Configure orchestration platform
- Set up monitoring and logging
- Configure CI/CD pipeline

## 📚 Additional Resources

- [Backend API Documentation](docs/API.md)
- [Frontend README](frontend/README.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🆘 Support

- Check documentation in `docs/` directory
- Review troubleshooting section above
- Open GitHub issue for bugs
- Check logs for error messages

---

**Status**: ✅ Full Stack Ready
**Last Updated**: 2024
