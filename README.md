# Credit Card Fraud Detection - Full Stack Application

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-passing-brightgreen.svg)](https://github.com)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

A production-ready, full-stack machine learning application for detecting credit card fraud with real-time predictions.

---

## 🎯 Overview

This project provides a complete fraud detection system with:
- **Backend**: Python FastAPI with ML models (Random Forest, XGBoost)
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Deployment**: Docker containerization for easy deployment

---

## 🚀 Quick Start

### Option 1: Run Both Services with Docker Compose (Recommended)

```bash
# Build and start both backend and frontend
docker-compose -f docker-compose.fullstack.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Run Services Separately

#### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Place dataset
# Download creditcard.csv and place in data/ directory

# Train models
python scripts/train.py

# Start API server
uvicorn src.api.app:app --reload
```

#### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

---

## 📊 Project Structure

```
Credit-Card-Fraud-Detection/
├── backend/                    # Python ML Backend
│   ├── src/
│   │   ├── api/               # FastAPI application
│   │   ├── pipeline/          # ML pipelines
│   │   ├── models.py          # Model training
│   │   └── ...
│   ├── config/                # Configuration
│   ├── models/                # Trained models
│   ├── scripts/               # Training scripts
│   └── tests/                 # Unit tests
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & API client
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   └── package.json
│
├── docker-compose.fullstack.yml  # Full stack deployment
├── Dockerfile                    # Backend container
└── README.md
```

---

## 🎨 Frontend Features

- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for modern UI
- 📘 **TypeScript** for type safety
- 🔄 **Real-time predictions**
- 📊 **Interactive visualizations**
- 📱 **Responsive design**
- 🔍 **API health monitoring**

### Frontend Screenshots

**Home Page**
- Transaction input form
- Real-time fraud prediction
- Confidence metrics
- Visual indicators

**Features**
- Generate random test data
- PCA feature inputs (V1-V28)
- Fraud probability visualization
- Actionable recommendations

---

## 🔧 Backend Features

- 🤖 **ML Models**: Random Forest & XGBoost
- ⚖️ **Class Imbalance**: SMOTE, Over/Undersampling
- 📈 **Metrics**: ROC-AUC, Precision, Recall, F1
- 💼 **Business Logic**: Cost-benefit analysis
- 🔌 **REST API**: FastAPI with auto-docs
- 📝 **Logging**: Structured logging
- 🧪 **Testing**: Pytest with coverage
- 🐳 **Docker**: Containerized deployment

---

## 🌐 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Predict Fraud
```bash
POST http://localhost:8000/predict
Content-Type: application/json

{
  "Time": 0,
  "V1": -1.36,
  "V2": -0.07,
  ...
  "V28": 0.1,
  "Scaled_Amount": 0.5
}
```

**Response:**
```json
{
  "fraud_probability": 0.85,
  "is_fraud": true,
  "threshold": 0.35,
  "confidence": 0.85
}
```

### Interactive API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🛠️ Development

### Backend Development
```bash
# Run tests
pytest tests/ -v --cov=src

# Format code
black src tests scripts

# Lint code
flake8 src tests

# Type check
mypy src
```

### Frontend Development
```bash
cd frontend

# Run dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## 📦 Deployment

### Docker Deployment (Full Stack)
```bash
# Build and run
docker-compose -f docker-compose.fullstack.yml up -d

# View logs
docker-compose -f docker-compose.fullstack.yml logs -f

# Stop services
docker-compose -f docker-compose.fullstack.yml down
```

### Individual Services

**Backend Only:**
```bash
docker build -t fraud-detection-backend .
docker run -p 8000:8000 fraud-detection-backend
```

**Frontend Only:**
```bash
cd frontend
docker build -t fraud-detection-frontend .
docker run -p 3000:3000 fraud-detection-frontend
```

### Cloud Deployment

**Vercel (Frontend):**
```bash
cd frontend
vercel
```

**AWS/GCP/Azure (Backend):**
- Deploy Docker container to cloud platform
- Configure environment variables
- Set up load balancer
- Enable auto-scaling

---

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=src --cov-report=html

# Specific test
pytest tests/test_models.py -v
```

### Frontend Tests
```bash
cd frontend

# Run tests (when added)
npm test

# E2E tests (when added)
npm run test:e2e
```

---

## 📚 Documentation

- [Backend API Documentation](docs/API.md)
- [Frontend README](frontend/README.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)

---

## 🔒 Security

- Input validation on all endpoints
- CORS configuration
- Rate limiting (recommended)
- Environment variable management
- No sensitive data in logs

---

## 📈 Performance

- **Backend**: <50ms prediction time
- **Frontend**: Optimized with Next.js
- **API**: Async/await for concurrency
- **Caching**: Model loaded once at startup

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- Dataset: [ULB Machine Learning Group](https://www.kaggle.com/mlg-ulb/creditcardfraud)
- Built with Next.js, FastAPI, scikit-learn, and XGBoost

---

## 📞 Support

- Documentation: See `docs/` directory
- Issues: Open a GitHub issue
- Email: your.email@example.com

---

**Status**: ✅ Production Ready | Full Stack Application
