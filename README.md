# 🛡️ Credit Card Fraud Detection

[![Docker Hub](https://img.shields.io/docker/pulls/tuta699/credit-card-fraud-detection?logo=docker&label=Docker%20Hub)](https://hub.docker.com/r/tuta699/credit-card-fraud-detection)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **Production-grade ML system** for real-time credit card fraud detection using an Ensemble of XGBoost, LightGBM, and Random Forest with SHAP explainability, advanced feature engineering, and live monitoring.

---

## 📐 Project Structure

```
credit-card-fraud-detection/
├── src/                          # Core Python package
│   ├── api/                      # FastAPI application
│   │   └── app.py                # REST API + WebSocket endpoints
│   ├── pipeline/                 # ML pipeline modules
│   │   ├── training_pipeline.py  # Model training orchestration
│   │   └── inference_pipeline.py # Real-time inference
│   ├── features/                 # Feature engineering
│   │   └── feature_engineer.py   # 45+ engineered features
│   ├── monitoring/               # Model & system monitoring
│   │   ├── model_monitor.py      # Drift detection, perf metrics
│   │   └── metrics_tracker.py    # Prometheus-style metrics
│   └── config/                   # Config management
│       └── config_manager.py
│
├── models/                       # Trained model artifacts (.pkl)
├── config/                       # YAML configuration files
├── data/                         # Raw & processed data (gitignored)
├── experiments/                  # Experiment tracking logs
├── reports/                      # Generated evaluation reports
├── tests/                        # Unit & integration tests
├── frontend/                     # Next.js dashboard
│
├── Dockerfile                    # Multi-stage production image
├── docker-compose.yml            # Full stack (API + frontend)
├── docker-compose.prod.yml       # Production (API only)
├── requirements.txt              # Production dependencies
├── requirements-dev.txt          # Dev/test dependencies
├── Makefile                      # Developer commands
└── train_advanced_model.py       # Model training entry point
```

---

## 🚀 Quick Start

### Option 1 — Docker Hub (fastest)

```bash
# Pull and run directly from Docker Hub
docker pull tuta699/credit-card-fraud-detection:latest

docker run -d \
  --name fraud-api \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models:ro \
  -v $(pwd)/config:/app/config:ro \
  tuta699/credit-card-fraud-detection:latest
```

API live at → **http://localhost:8000**  
Swagger docs → **http://localhost:8000/docs**

### Option 2 — Docker Compose (full stack)

```bash
git clone https://github.com/tuta699/credit-card-fraud-detection
cd credit-card-fraud-detection
cp .env.example .env
docker-compose up -d
```

| Service  | URL                       |
|----------|---------------------------|
| API      | http://localhost:8000     |
| Docs     | http://localhost:8000/docs|
| Frontend | http://localhost:3000     |

### Option 3 — Local Development

```bash
git clone https://github.com/tuta699/credit-card-fraud-detection
cd credit-card-fraud-detection

python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements-dev.txt

# Train the model first
python train_advanced_model.py

# Start API
uvicorn src.api.app:app --reload --port 8000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Service info & feature list |
| `GET` | `/health` | Liveness + readiness probe |
| `POST` | `/predict` | Real-time fraud prediction |
| `GET` | `/analytics` | Dashboard statistics |
| `GET` | `/transactions` | Transaction history |
| `GET` | `/alerts` | Active fraud alerts |
| `POST` | `/alerts/{id}/resolve` | Resolve an alert |
| `GET` | `/risk-profile/{user_id}` | User risk profile |
| `GET` | `/model/info` | Model metadata |
| `GET` | `/model/feature-importance` | SHAP feature importance |
| `WS` | `/ws/monitor` | Real-time monitoring stream |

### POST `/predict` — Example Request

```json
{
  "Time": 72000,
  "V1": -1.359807, "V2": -0.072781, "V3":  2.536347,
  "V4":  1.378155, "V5": -0.338321, "V6":  0.462388,
  "V7":  0.239599, "V8":  0.098698, "V9":  0.363787,
  "V10": 0.090794, "V11":-0.551600, "V12":-0.617801,
  "V13":-0.991390, "V14":-0.311169, "V15": 1.468177,
  "V16":-0.470401, "V17": 0.207971, "V18": 0.025791,
  "V19": 0.403993, "V20": 0.251412, "V21":-0.018307,
  "V22": 0.277838, "V23":-0.110474, "V24": 0.066928,
  "V25": 0.128539, "V26":-0.189115, "V27": 0.133558,
  "V28":-0.021053, "Scaled_Amount": 0.244964
}
```

---

## 🐳 Docker — Build & Push

```bash
# 1. Login to Docker Hub
docker login

# 2. Build production image
docker build -t tuta699/credit-card-fraud-detection:latest .

# 3. Push to Docker Hub
docker push tuta699/credit-card-fraud-detection:latest
```

Or use the Makefile shortcut:
```bash
make docker-push   # builds then pushes in one command
```

---

## 🛠️ Makefile Commands

```bash
make install        # Install production deps
make install-dev    # Install all deps
make train          # Train the ML model
make test           # Run test suite
make lint           # Flake8 + isort check
make format         # Black + isort auto-format

make docker-build   # Build Docker image
make docker-run     # Run container locally
make docker-stop    # Stop container
make docker-push    # Build + push to Docker Hub
make docker-clean   # Remove local image
```

---

## 🤖 ML Architecture

| Component | Details |
|-----------|---------|
| **Algorithms** | XGBoost, LightGBM, Random Forest (Ensemble) |
| **Class Balancing** | SMOTE + undersampling |
| **Features** | 30 raw PCA features + 15+ engineered |
| **Explainability** | SHAP TreeExplainer |
| **Threshold** | Optimized via F1 / precision-recall |
| **Monitoring** | Data drift, confidence drift, performance degradation |

---

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| ROC-AUC | ~0.98 |
| Precision | ~0.90 |
| Recall | ~0.85 |
| F1 Score | ~0.87 |

> Evaluated on the [Kaggle Credit Card Fraud Dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) (284,807 transactions, 0.172% fraud rate).

---

## 📄 License

[MIT](LICENSE) © 2024 tuta699
