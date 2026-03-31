# 🚀 Quick Start - Docker Deployment

## One-Command Deploy

### Windows
```batch
deploy.bat
```

### Linux/macOS
```bash
chmod +x deploy.sh && ./deploy.sh
```

---

## Manual Docker Build & Deploy

```bash
# 1. Navigate to project
cd c:\Users\LTR\Documents\projects\machineLearning\Credit-Card-Fraud-Detection

# 2. Build Docker images
docker-compose -f docker/docker-compose.yml build

# 3. Start all services
docker-compose -f docker/docker-compose.yml up -d

# 4. Verify deployment
curl http://localhost:8000/health
```

---

## Access Your Application

| Service | URL |
|---------|-----|
| **Frontend Dashboard** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Documentation** | http://localhost:8000/docs |

---

## Quick Commands

```bash
# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down

# Restart services
docker-compose -f docker/docker-compose.yml restart

# View container status
docker-compose -f docker/docker-compose.yml ps
```

---

## Using Makefile (Linux/macOS)

```bash
make build          # Build Docker images
make up             # Start services
make logs           # View logs
make down           # Stop services
make rebuild        # Rebuild and restart
make help           # Show all commands
```

---

## Troubleshooting

```bash
# Check container status
docker-compose -f docker/docker-compose.yml ps -a

# View API logs
docker-compose -f docker/docker-compose.yml logs api

# Train model if missing
docker-compose -f docker/docker-compose.yml run --rm api python train_advanced_model.py
```

---

**Full documentation:** See [DOCKER_COMMANDS.md](DOCKER_COMMANDS.md) and [ML_EXPERT_DEPLOYMENT.md](ML_EXPERT_DEPLOYMENT.md)
