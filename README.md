<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0f,50:0d1117,100:161b22&height=180&section=header&text=FraudShield%20ML&fontSize=48&fontColor=ffffff&fontAlignY=38&desc=Credit%20Card%20Fraud%20Detection%20Platform&descAlignY=60&descSize=17&animation=fadeIn" width="100%"/>

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-Ensemble-FF6600?style=for-the-badge&logoColor=white)](https://xgboost.readthedocs.io)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

> **Production-ready fraud detection pipeline — real-time ML inference, explainable predictions, and a live analytics dashboard. Containerized, CI/CD-enabled, and security-hardened.**

<br/>

[![CI/CD](https://img.shields.io/github/actions/workflow/status/letera1/Credit-Card-Fraud-Detection/ci-cd.yml?branch=main&label=CI%2FCD&style=flat-square)](https://github.com/letera1/Credit-Card-Fraud-Detection/actions)
[![API](https://img.shields.io/badge/API-FastAPI%20%2B%20Uvicorn-009688?style=flat-square)](#api-reference)
[![ML](https://img.shields.io/badge/ML-XGBoost%20%7C%20LightGBM%20%7C%20RF-FF6600?style=flat-square)](#model-training)
[![Security](https://img.shields.io/badge/Security-Hardened-red?style=flat-square)](#security)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blueviolet?style=flat-square)](CONTRIBUTING.md)

<br/>

[**Quick Start**](#-quick-start) · [**Architecture**](#-architecture) · [**ML Pipeline**](#-model-training) · [**API Reference**](#-api-reference) · [**Deployment**](#-docker--deployment)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Model Training](#-model-training)
- [Repository Structure](#-repository-structure)
- [Docker & Deployment](#-docker--deployment)
- [CI/CD](#-cicd)
- [Security](#-security)
- [License](#-license)

---

## 🧭 Overview

**FraudShield ML** is a production-grade credit card fraud detection system that combines ensemble machine learning with a real-time inference API and a modern analytics dashboard. Built to handle severely class-imbalanced financial data, the pipeline outputs calibrated fraud probabilities, risk severity scores, and SHAP-based feature attributions — all served at low latency through a Dockerized, security-hardened full-stack deployment.

```
Raw Transaction  →  Feature Engineering  →  Ensemble Model  →  Risk Score + Explanation  →  Dashboard Alert
```

**Core capabilities at a glance:**

- Real-time fraud probability scoring with sub-100ms p99 inference latency
- Risk severity categorization: Low · Medium · High · Critical
- SHAP-powered per-prediction explainability and feature importance access
- Transaction history, active alert management, and per-user risk profiles
- Security-hardened Docker deployment — non-root containers, dropped capabilities, read-only mounts
- GitHub Actions CI/CD with automated testing, image builds, and deploy notifications

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          FraudShield ML                              │
│                                                                      │
│  ┌─────────────────────┐    REST API      ┌──────────────────────┐  │
│  │   Next.js 15        │ ◄──────────────► │   FastAPI            │  │
│  │   Dashboard         │  /predict        │   Inference Server   │  │
│  │   (Port 3000)       │  /analytics      │   (Port 8000)        │  │
│  │                     │  /alerts         │                      │  │
│  │  ┌───────────────┐  │  /transactions   │  ┌────────────────┐  │  │
│  │  │ Live Alerts   │  │                  │  │  /predict      │  │  │
│  │  │ Analytics     │  │                  │  │  /alerts       │  │  │
│  │  │ Risk Profiles │  │                  │  │  /health       │  │  │
│  │  └───────────────┘  │                  │  └───────┬────────┘  │  │
│  └─────────────────────┘                  │          │           │  │
│                                           │  ┌───────▼────────┐  │  │
│                                           │  │   Ensemble     │  │  │
│                                           │  │   Pipeline     │  │  │
│                                           │  └───────┬────────┘  │  │
│                                           └──────────┼───────────┘  │
│  ┌───────────────────────────────────────────────────▼────────────┐ │
│  │  Model Artifacts                                                │ │
│  │  best_fraud_model.pkl · ensemble_models.pkl · amount_scaler   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend API** | FastAPI, Uvicorn, Pydantic | Async inference server with schema validation |
| **ML Core** | scikit-learn, XGBoost, LightGBM | Ensemble fraud classifier |
| **Explainability** | SHAP | Per-prediction feature attribution |
| **Imbalance Handling** | imbalanced-learn (SMOTE + Tomek) | Class imbalance correction |
| **Data** | pandas, numpy | Feature engineering and preprocessing |
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS | Real-time analytics dashboard |
| **DevOps** | Docker, Docker Compose, GitHub Actions | Containerized CI/CD deployment |

---

## 🚀 Quick Start

### Option A — Docker (Recommended)

The fastest path to a running full stack. No manual dependency management.

```bash
git clone https://github.com/letera1/Credit-Card-Fraud-Detection.git
cd Credit-Card-Fraud-Detection
docker compose up -d --build
```

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

### Option B — Local Development

**Backend:**

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1

# Linux / macOS
source .venv/bin/activate

# Install and serve
pip install -r requirements.txt
uvicorn src.api.app:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

> **No model artifacts yet?** Run `python train_advanced_model.py` before starting the API server.

---

## 🔧 Environment Configuration

```bash
cp .env.example .env
```

```ini
# Server
API_PORT=8000
FRONTEND_PORT=3000
APP_ENV=production
LOG_LEVEL=INFO

# Security
CORS_ALLOW_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENABLE_RESET_ENDPOINT=false
```

> ⚠️ Before exposing to production: restrict `CORS_ALLOW_ORIGINS` to trusted domains, rotate all secrets, and keep `ENABLE_RESET_ENDPOINT=false`.

---

## 📡 API Reference

### Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Fraud probability, risk score, and severity label |
| `GET` | `/analytics` | Aggregate dashboard metrics |
| `GET` | `/transactions` | Recent transaction history |
| `GET` | `/alerts` | Active and resolved fraud alerts |
| `POST` | `/alerts/{alert_id}/resolve` | Resolve an active alert |
| `GET` | `/risk-profile/{user_id}` | Per-user risk profile summary |
| `GET` | `/model/info` | Model metadata and training details |
| `GET` | `/model/feature-importance` | Top feature weights |
| `GET` | `/health` | Service and model health status |

### Prediction Request

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "Time": 10000,
    "V1": 0.1,   "V2": -0.2,  "V3": 0.3,   "V4": -0.1,
    "V5": 0.2,   "V6": -0.3,  "V7": 0.1,   "V8": -0.05,
    "V9": 0.07,  "V10": -0.11,"V11": 0.08, "V12": -0.02,
    "V13": 0.03, "V14": -0.15,"V15": 0.04, "V16": -0.09,
    "V17": 0.06, "V18": -0.07,"V19": 0.12, "V20": -0.05,
    "V21": 0.01, "V22": -0.08,"V23": 0.02, "V24": -0.04,
    "V25": 0.03, "V26": -0.06,"V27": 0.05, "V28": -0.01,
    "Scaled_Amount": 0.75
  }'
```

**Response:**

```json
{
  "fraud_probability": 0.032,
  "risk_score": 3.2,
  "severity": "LOW",
  "is_fraud": false,
  "top_features": ["V14", "V4", "V12"],
  "model_version": "ensemble-v2.1"
}
```

---

## 🔬 Model Training

### Pipeline Overview

```
Raw Data → Synthetic Generation → Feature Engineering → SMOTE + Tomek → Ensemble Training → Artifacts
```

```bash
python train_advanced_model.py
```

### Training Stages

| Stage | Description |
|---|---|
| Data generation | Synthetic fraud / legitimate transaction simulation |
| Feature engineering | Amount scaling, time-based features, PCA components (V1–V28) |
| Imbalance handling | SMOTE oversampling + Tomek link undersampling |
| Model training | XGBoost · LightGBM · Random Forest ensemble with cross-validation |
| Evaluation | ROC-AUC · Precision-Recall · F1 (fraud class) · Confusion Matrix |
| Reporting | Full metrics written to `reports/model_report.json` |

### Saved Artifacts

```
models/
├── best_fraud_model.pkl      # Best single model by ROC-AUC
├── ensemble_models.pkl       # All ensemble members
├── feature_names.pkl         # Feature schema for inference validation
└── amount_scaler.pkl         # StandardScaler for Amount normalization
```

---

## 📁 Repository Structure

```
Credit-Card-Fraud-Detection/
│
├── src/                          # Core backend application
│   ├── api/                      # FastAPI app and route definitions
│   ├── pipelines/                # Training and inference pipelines
│   ├── features/                 # Feature engineering logic
│   └── monitoring/               # Runtime health and alerting
│
├── frontend/                     # Next.js 15 analytics dashboard
│   ├── app/                      # App Router pages and layouts
│   ├── components/               # Reusable UI components
│   └── lib/                      # API client, types, utilities
│
├── models/                       # Serialized model artifacts (*.pkl)
├── data/                         # Raw and processed datasets
├── config/                       # Runtime configuration files
├── apis/                         # API compatibility wrappers
├── reports/                      # Training evaluation outputs
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions pipeline definition
│
├── train_advanced_model.py       # Full model training entry point
├── Dockerfile                    # Backend container definition
├── docker-compose.yml            # Full-stack development compose
├── docker-compose.prod.yml       # Backend-only production compose
├── Makefile                      # Build, run, and clean automation
├── requirements.txt              # Pinned Python dependencies
├── DOCKER_GUIDE.md               # Extended Docker operations guide
└── README.md
```

---

## 🐳 Docker & Deployment

### Full Stack — Development

```bash
docker compose up -d --build      # Build and start all services
docker compose logs -f            # Follow live logs
docker compose down               # Stop and remove containers
```

### Backend Only — Production

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Makefile Shortcuts

```bash
make docker-build     # Build all Docker images
make docker-run       # Start containers
make docker-stop      # Stop containers
make docker-clean     # Remove containers and volumes
```

For full production hardening guidance, volume configuration, and multi-environment setup, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md).

---

## 🔄 CI/CD

GitHub Actions pipeline runs on every push and pull request to `main`:

| Stage | Action |
|---|---|
| **Dependencies** | Python pip install from `requirements.txt` |
| **Lint & Test** | Code quality checks and unit test suite |
| **Frontend** | npm lockfile validation |
| **Build** | Docker image build — backend and frontend |
| **Deploy** | Main branch deploy notification |

---

## 🔒 Security

### Container Hardening

- Non-root user execution inside all containers
- Dropped Linux capabilities (`--cap-drop ALL`)
- `no-new-privileges` flag enabled on all services
- Read-only bind mounts for model and config directories
- Runtime health checks on all services

### Pre-Production Checklist

- [ ] Restrict `CORS_ALLOW_ORIGINS` to trusted domains only
- [ ] Confirm `ENABLE_RESET_ENDPOINT=false`
- [ ] Rotate and externalize all secrets (Vault or cloud secrets manager)
- [ ] Enable HTTPS termination at the reverse proxy layer
- [ ] Scope and enforce API authentication on sensitive endpoints

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:161b22,50:0d1117,100:0a0a0f&height=100&section=footer" width="100%"/>

**Built for financial security — one prediction at a time.**

*If this project helped you, consider giving it a ⭐*

</div>