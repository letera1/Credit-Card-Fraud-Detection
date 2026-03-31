# 🐳 Complete Docker Deployment Guide

Welcome to the **Credit Card Fraud Detection** Docker guide! This project uses a **multi-container microservices architecture** designed for production-grade Machine Learning deployments. 

---

## 🏗️ Architecture Overview

The system is deployed using `docker-compose` and consists of two primary services communicating over a private bridge network.

```mermaid
graph LR
    User([🕵️ User / Analyst]) -->|HTTP :3000| Frontend
    
    subgraph Docker Bridge Network [fraud-detection]
        Frontend[🎨 Next.js Frontend\ntuta699/...-frontend\n(Port: 3000)]
        Backend[🧠 FastAPI ML Engine\ntuta699/...\n(Port: 8000)]
        
        Frontend -->|Internal API Calls\nhttp://backend:8000| Backend
    end
    
    Backend --> Models[(📦 .pkl Models)]
```

---

## 🚀 Quick Start (Recommended)

The absolute fastest way to get the entire system running is using our pre-built images from Docker Hub via Docker Compose.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tuta699/credit-card-fraud-detection.git
   cd credit-card-fraud-detection
   ```

2. **Start the stack:**
   ```bash
   docker-compose up -d
   ```

3. **Access the Application:**
   - 🎨 **Expert ML Dashboard (UI):** [http://localhost:3000](http://localhost:3000)
   - 🧠 **FastAPI Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Building the Images Locally

If you are a developer modifying the source code or training new models, use the `Makefile` commands to manage your local Docker environment.

### 1. Build Both Services
```bash
make docker-build
```
> *Note: Building the backend image (`tuta699/credit-card-fraud-detection`) can take 10-15 minutes on the first run as it compiles heavy data-science libraries (XGBoost, SciPy). We use Docker BuildKit caching to make subsequent builds instant!*

### 2. Run the Stack
```bash
make docker-run
```
*(This maps the local `./models` directory into the container, so any newly trained `.pkl` models are immediately available without rebuilding!)*

### 3. Stop and Clean Up
```bash
make docker-stop    # Stops containers gracefully
make docker-clean   # Removes the local images to free up space
```

---

## 🔐 Environment Variables

The `docker-compose.yml` automatically reads from your `.env` file. To customize the deployment:

1. Copy the example file: `cp .env.example .env`
2. Configure settings:

```ini
# --- API CONFIG ---
API_PORT=8000
APP_ENV=production
LOG_LEVEL=INFO

# --- FRONTEND CONFIG ---
FRONTEND_PORT=3000
# Note: Next.js uses this at build-time to point to the backend container
NEXT_PUBLIC_API_URL=http://backend:8000 
```

---

## 🌟 Pro-Tips for ML Developers

* **Hot-Swapping Models:** The `docker-compose.yml` uses volume mounts `v ./models:/app/models`. If you train a better model locally (`python train_advanced_model.py`), simply drop the new `.pkl` files into the `./models` folder. The FastAPI container will pick them up immediately!
* **Non-Root Security:** The backend image runs as a non-root `appuser (uid:1001)`. Ensure your host machine's `./logs` and `./models` folders have the correct read/write permissions.
