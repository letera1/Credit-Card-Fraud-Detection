<div align="center">

# 🛡️ Real-Time Credit Card Fraud Detection
**Enterprise-Grade Machine Learning & Visual Analytics Dashboard**

[![Docker Hub](https://img.shields.io/docker/pulls/tuta699/credit-card-fraud-detection?logo=docker&style=for-the-badge&color=0db7ed)](https://hub.docker.com/r/tuta699/credit-card-fraud-detection)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&style=for-the-badge)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&style=for-the-badge)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)

<br/>

*An end-to-end ML platform featuring an ensemble of XGBoost, LightGBM, and Random Forest models, coupled with a stunning glassmorphic Next.js dashboard and SHAP explainability.*

</div>

---

## ✨ Core Features

* 🧠 **Advanced ML Ensemble:** High accuracy detection using a weighted voting system composed of XGBoost, LightGBM, and Scikit-Learn Random Forests.
* 🔎 **SHAP Explainability:** Not just a "fraud score" — the system returns feature importance vectors to explain *why* a transaction was flagged.
* ⚡ **Ultra-Fast API:** Built on Python `FastAPI` with an optimized inference pipeline capable of sub-50ms predictions.
* 🎨 **Expert Dashboard:** A beautiful, responsive Next.js frontend featuring dark-mode glassmorphism, animated SVG gauges, and real-time inference simulators.
* 🐳 **Production Ready:** Fully Dockerized multi-stage builds running as secure non-root users.

---

## 🚀 Quick Start

The easiest way to get the entire full-stack system (API + Frontend) running is via Docker Compose.

```bash
git clone https://github.com/tuta699/credit-card-fraud-detection.git
cd credit-card-fraud-detection

# Copy environment variables and start the stack
cp .env.example .env
docker-compose up -d
```

| Service | Access Link | Description |
| :--- | :--- | :--- |
| **Dashboard** | [http://localhost:3000](http://localhost:3000) | Next.js visual analytics & inference UI |
| **API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | FastAPI Swagger UI |

> 📚 **Want more deployment details?** Read the comprehensive [🐳 Docker Deployment Guide](./DOCKER_GUIDE.md) covering local builds, Make commands, and environment variables.

---

## 🤖 Model Performance & Architecture

The system was trained and evaluated on the highly imbalanced Kaggle Credit Card dataset (284,807 transactions, 0.172% fraud rate) using SMOTE for class balancing.

| Metric | Score | Details |
|--------|-------|---------|
| **ROC-AUC** | `~0.98` | Indicates excellent separation between fraudulent and valid transactions. |
| **Precision** | `~0.90` | Low false-positive rate, crucial for minimizing customer friction. |
| **Recall** | `~0.85` | High sensitivity, catching the vast majority of true fraud cases. |
| **F1 Score** | `~0.87` | Strong harmonic mean metric optimizing for the severe imbalance. |

---

## 📂 Project Structure

```text
credit-card-fraud-detection/
├── src/                          # Core Python FastAPI Backend
│   ├── api/                      # REST endpoints & schemas
│   ├── pipeline/                 # ML inference processing
│   ├── features/                 # 45+ Engineered Features
│   └── monitoring/               # Drift detection & metrics
├── frontend/                     # Next.js React Dashboard
│   ├── src/components/           # Glassmorphic UI components
│   └── src/app/                  # Layouts & Routing
├── models/                       # Trained .pkl artifacts
├── DOCKER_GUIDE.md               # Extensive container documentation
├── docker-compose.yml            # Multi-service stack config
└── train_advanced_model.py       # Model training entry point
```

---

<div align="center">
  Released under the <a href="LICENSE">MIT License</a>. <br>
  Built for <b>Production-Grade ML Systems</b>.
</div>
