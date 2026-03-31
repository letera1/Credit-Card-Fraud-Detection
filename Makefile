# Fraud Detection AI - Makefile
# Common Docker and deployment commands

.PHONY: help build up down logs clean rebuild restart test backend frontend

# Default target
help:
	@echo "Fraud Detection AI - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "Development:"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs (follow mode)"
	@echo "  make rebuild      - Rebuild and restart"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start in production mode"
	@echo "  make prod-build   - Build production images"
	@echo ""
	@echo "Services:"
	@echo "  make backend      - Start backend only"
	@echo "  make frontend     - Start frontend only"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        - Remove containers and volumes"
	@echo "  make prune        - Remove dangling images"
	@echo "  make test         - Run tests"
	@echo "  make train        - Train ML model"
	@echo ""

# Build Docker images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Restart all services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# Backend logs
logs-backend:
	docker-compose logs -f backend

# Frontend logs
logs-frontend:
	docker-compose logs -f frontend

# Rebuild and restart
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Production deployment
prod:
	docker-compose -f docker-compose.prod.yml up -d

# Production build
prod-build:
	docker-compose -f docker-compose.prod.yml build --no-cache

# Start backend only
backend:
	docker-compose up -d backend

# Start frontend only
frontend:
	docker-compose up -d frontend

# Clean up containers and volumes
clean:
	docker-compose down -v
	docker system prune -f

# Prune dangling images
prune:
	docker image prune -f

# Run tests
test:
	docker-compose run --rm backend pytest

# Train ML model
train:
	docker-compose run --rm backend python train_advanced_model.py

# Health check
health:
	@echo "Checking backend health..."
	curl -f http://localhost:8000/health || echo "Backend not healthy"
	@echo ""
	@echo "Checking frontend..."
	curl -f http://localhost:3000 || echo "Frontend not healthy"

# Show running containers
ps:
	docker-compose ps

# Shell access to backend
shell-backend:
	docker-compose exec backend /bin/bash

# Shell access to frontend
shell-frontend:
	docker-compose exec frontend /bin/sh

# View resource usage
stats:
	docker stats fraud-detection-backend fraud-detection-frontend
