# 🚀 Docker Deployment Commands

## Quick Deploy (Recommended)

### Windows
```batch
deploy.bat
```

### Linux/macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Manual Docker Deployment

### Build & Deploy

```bash
# Navigate to project root
cd c:\Users\LTR\Documents\projects\machineLearning\Credit-Card-Fraud-Detection

# Build Docker images
docker-compose -f docker/docker-compose.yml build

# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Or build and start in one command
docker-compose -f docker/docker-compose.yml up --build -d
```

### Using Makefile (Linux/macOS)

```bash
# Build images
make build

# Start services
make up

# View logs
make logs

# Stop services
make down

# Rebuild and restart
make rebuild

# Production deployment
make prod

# View all commands
make help
```

---

## Verify Deployment

```bash
# Check container status
docker-compose -f docker/docker-compose.yml ps

# Test backend health
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000

# View API documentation
# Open browser: http://localhost:8000/docs
```

---

## Access Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend Dashboard** | http://localhost:3000 | Next.js UI |
| **Backend API** | http://localhost:8000 | FastAPI REST API |
| **API Documentation** | http://localhost:8000/docs | Swagger UI |
| **Health Check** | http://localhost:8000/health | System Health |

---

## Docker Management

### View Logs
```bash
# All services
docker-compose -f docker/docker-compose.yml logs -f

# API only
docker-compose -f docker/docker-compose.yml logs -f api

# Frontend only
docker-compose -f docker/docker-compose.yml logs -f frontend
```

### Access Container Shell
```bash
# API container
docker-compose -f docker/docker-compose.yml exec api /bin/bash

# Frontend container
docker-compose -f docker/docker-compose.yml exec frontend /bin/sh
```

### Train Model in Container
```bash
docker-compose -f docker/docker-compose.yml run --rm api python train_advanced_model.py
```

### Run Tests
```bash
docker-compose -f docker/docker-compose.yml run --rm api pytest
```

### Stop Services
```bash
# Stop all
docker-compose -f docker/docker-compose.yml down

# Stop and remove volumes
docker-compose -f docker/docker-compose.yml down -v
```

---

## Production Deployment

```bash
# Production configuration with resource limits
docker-compose -f docker/docker-compose.prod.yml up -d --build

# Scale API service
docker-compose -f docker/docker-compose.prod.yml up -d --scale api=3
```

---

## Troubleshooting

### Check Container Status
```bash
docker-compose -f docker/docker-compose.yml ps -a
```

### View Resource Usage
```bash
docker stats fraud-detection-api fraud-detection-frontend
```

### Restart Failed Service
```bash
docker-compose -f docker/docker-compose.yml restart api
```

### Rebuild Without Cache
```bash
docker-compose -f docker/docker-compose.yml build --no-cache
```

---

## Environment Variables

### API Configuration
```bash
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
MODEL_THRESHOLD=0.5
```

### Frontend Configuration
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=production
```

---

## Project Structure (ML Expert)

```
credit-card-fraud-detection/
├── apis/                    # API services layer
├── core/                    # Core configuration
├── data/                    # Data layer
├── features/                # Feature engineering
├── models/                  # Model definitions
├── pipelines/               # ML pipelines
├── monitoring/              # Production monitoring
├── explainability/          # Model explainability
├── artifacts/               # Trained models (gitignored)
├── experiments/             # Experiment tracking
├── tests/                   # Test suite
├── scripts/                 # Utility scripts
├── docker/                  # Docker configurations
│   ├── Dockerfile.api
│   └── docker-compose.yml
├── configs/                 # Configuration files
└── frontend/                # Next.js frontend
```

---

## Next Steps

1. **Deploy to Cloud**
   - AWS ECS/EKS
   - Google Cloud Run
   - Azure Container Apps

2. **Set up CI/CD**
   - GitHub Actions configured in `.github/workflows/`

3. **Monitor Production**
   - Set up Prometheus/Grafana
   - Configure alerting
   - Track model drift

---

**Ready to deploy! 🚀**
