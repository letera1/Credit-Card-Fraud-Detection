# 🚀 Deployment Guide

Complete deployment guide for the Credit Card Fraud Detection System.

---

## 📋 Prerequisites

- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: For cloning the repository

---

## 🐳 Docker Deployment (Recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/tuta699/credit-card-fraud-detection.git
cd credit-card-fraud-detection

# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js Dashboard |
| Backend API | http://localhost:8000 | FastAPI REST API |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health Check | http://localhost:8000/health | API Health Status |

### Managing Services

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build --force-recreate
```

### Health Check

Verify services are running:

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

---

## 🖥️ Local Development Setup

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Train the ML model (first time only)
python train_advanced_model.py

# Start the API server
python -m uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

---

## 🔧 Configuration

### Environment Variables

#### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONUNBUFFERED` | `1` | Python output buffering |
| `MODEL_PATH` | `models/best_fraud_model.pkl` | Path to trained model |
| `LOG_LEVEL` | `INFO` | Logging level |

#### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |
| `PORT` | `3000` | Frontend port |

### Configuration File

Edit `config/config.yaml` for model and API settings:

```yaml
model:
  path: models/best_fraud_model.pkl
  threshold: 0.5

api:
  host: 0.0.0.0
  port: 8000

logging:
  level: INFO
  path: logs/
```

---

## ☁️ Cloud Deployment

### Deploy to AWS

#### Using ECS (Elastic Container Service)

1. **Build and push to ECR**

```bash
# Create ECR repository
aws ecr create-repository --repository-name fraud-detection-backend

# Login to ECR
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account.dkr.ecr.your-region.amazonaws.com

# Build and push
docker build -t your-account.dkr.ecr.your-region.amazonaws.com/fraud-detection-backend:latest .
docker push your-account.dkr.ecr.your-region.amazonaws.com/fraud-detection-backend:latest
```

2. **Deploy to ECS**
   - Create ECS cluster
   - Create task definition
   - Create service with load balancer

### Deploy to Google Cloud Run

```bash
# Build container
docker build -t gcr.io/your-project/fraud-detection-backend .

# Push to Container Registry
docker push gcr.io/your-project/fraud-detection-backend

# Deploy to Cloud Run
gcloud run deploy fraud-detection-backend \
  --image gcr.io/your-project/fraud-detection-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Azure Container Apps

```bash
# Build and push to ACR
az acr build --registry your-registry --image fraud-detection-backend:latest .

# Deploy to Container Apps
az containerapp create \
  --name fraud-detection-backend \
  --resource-group your-rg \
  --environment your-environment \
  --image your-registry.azurecr.io/fraud-detection-backend:latest \
  --target-port 8000 \
  --ingress external
```

---

## 🔒 Security Considerations

### Production Checklist

- [ ] Change default ports if needed
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up authentication/authorization
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use secrets management (not environment variables)
- [ ] Enable monitoring and alerting
- [ ] Set up log aggregation
- [ ] Configure backup strategy

### HTTPS Setup

For production, always use HTTPS:

```yaml
# docker-compose.prod.yml
services:
  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.fraud-detection.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.fraud-detection.entrypoints=websecure"
      - "traefik.http.routers.fraud-detection.tls.certresolver=myresolver"
```

---

## 📊 Monitoring

### Health Endpoints

```bash
# Backend health
curl http://localhost:8000/health

# Get model info
curl http://localhost:8000/model/info

# Get analytics
curl http://localhost:8000/analytics
```

### Logs Location

- **Backend Logs**: `logs/` directory (mounted volume)
- **Docker Logs**: `docker-compose logs`

### Metrics

Track these key metrics:

- API Response Time (< 50ms)
- Request Throughput
- Error Rate (< 1%)
- Model Prediction Accuracy
- False Positive Rate

---

## 🧪 Testing

### Run Tests in Docker

```bash
# Backend tests
docker-compose run backend pytest

# Frontend tests
docker-compose run frontend npm test
```

### Integration Testing

```bash
# Test prediction endpoint
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "Time": 12345.0,
    "V1": -1.5, "V2": 0.8, "V3": 1.2,
    "V4": -0.5, "V5": 0.3, "V6": -0.7,
    "V7": 0.9, "V8": -0.2, "V9": 1.1,
    "V10": -0.4, "V11": 0.6, "V12": -0.8,
    "V13": 0.5, "V14": -1.0, "V15": 0.7,
    "V16": -0.3, "V17": 0.4, "V18": -0.6,
    "V19": 0.2, "V20": -0.9, "V21": 0.1,
    "V22": -0.5, "V23": 0.8, "V24": -0.4,
    "V25": 0.3, "V26": -0.7, "V27": 0.6,
    "V28": -0.2, "Scaled_Amount": 1.5
  }'
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker images
      run: docker-compose build
    
    - name: Run tests
      run: docker-compose run backend pytest
    
    - name: Deploy
      run: |
        docker-compose up -d
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Verify model files exist
ls -la models/

# Rebuild without cache
docker-compose build --no-cache backend
```

#### Frontend can't connect to backend

```bash
# Check environment variable
docker-compose exec frontend env | grep API_URL

# Verify backend is running
docker-compose ps

# Check network connectivity
docker-compose exec frontend ping backend
```

#### Port already in use

```bash
# Change ports in docker-compose.yml
ports:
  - "8001:8000"  # Backend
  - "3001:3000"  # Frontend
```

#### Model not found

```bash
# Train the model first
docker-compose run backend python train_advanced_model.py

# Or copy pre-trained models
docker-compose run backend cp /app/models/* /app/models/
```

---

## 📞 Support

For issues or questions:

1. Check existing [GitHub Issues](https://github.com/tuta699/credit-card-fraud-detection/issues)
2. Create a new issue with details
3. Include logs and error messages

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.
