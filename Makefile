# ══════════════════════════════════════════════════════════════
#  Credit Card Fraud Detection — Makefile
#  Docker image: tuta699/credit-card-fraud-detection
# ══════════════════════════════════════════════════════════════

IMAGE   := tuta699/credit-card-fraud-detection
TAG     := latest
PORT    := 8000

.PHONY: help install install-dev lint format test train \
        docker-build docker-run docker-stop docker-push docker-clean

# ── Help ────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  Credit Card Fraud Detection — Available commands"
	@echo "  ──────────────────────────────────────────────────"
	@echo "  Local development"
	@echo "    make install        Install production deps"
	@echo "    make install-dev    Install all deps incl. dev/test"
	@echo "    make lint           Run flake8 + isort checks"
	@echo "    make format         Auto-format with black + isort"
	@echo "    make test           Run test suite with coverage"
	@echo "    make train          Train the ML model"
	@echo ""
	@echo "  Docker"
	@echo "    make docker-build   Build Docker image"
	@echo "    make docker-run     Run API container locally"
	@echo "    make docker-stop    Stop and remove container"
	@echo "    make docker-push    Push image to Docker Hub"
	@echo "    make docker-clean   Remove image locally"
	@echo ""

# ── Local Development ───────────────────────────────────────
install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements-dev.txt

lint:
	flake8 src/ tests/ --max-line-length=100
	isort --check-only src/ tests/

format:
	black src/ tests/ --line-length 100
	isort src/ tests/

test:
	pytest tests/ -v --cov=src --cov-report=term-missing --cov-report=html

train:
	python train_advanced_model.py

# ── Docker ──────────────────────────────────────────────────
docker-build:
	docker build \
	  --target runtime \
	  -t $(IMAGE):$(TAG) \
	  -t $(IMAGE):$(shell git rev-parse --short HEAD 2>/dev/null || echo "local") \
	  .

docker-run:
	docker run -d \
	  --name fraud-detection-api \
	  -p $(PORT):8000 \
	  -v $(PWD)/models:/app/models:ro \
	  -v $(PWD)/config:/app/config:ro \
	  -e APP_ENV=development \
	  $(IMAGE):$(TAG)
	@echo "API running → http://localhost:$(PORT)"
	@echo "Docs       → http://localhost:$(PORT)/docs"

docker-stop:
	docker stop fraud-detection-api 2>/dev/null || true
	docker rm   fraud-detection-api 2>/dev/null || true

docker-push: docker-build
	docker push $(IMAGE):$(TAG)

docker-clean: docker-stop
	docker rmi $(IMAGE):$(TAG) 2>/dev/null || true
