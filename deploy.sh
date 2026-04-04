#!/bin/bash

# FraudGuard AI - Deployment Script
# This script automates the deployment process

set -e

echo "=========================================="
echo "  FraudGuard AI - Deployment Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Check if models exist
if [ ! -f "models/best_fraud_model.pkl" ]; then
    echo -e "${YELLOW}⚠ Model not found. Training model first...${NC}"
    python train_advanced_model.py
    echo -e "${GREEN}✓ Model trained successfully${NC}"
else
    echo -e "${GREEN}✓ Model files found${NC}"
fi
echo ""

# Build Docker images
echo "🔨 Building Docker images..."
docker-compose build
echo -e "${GREEN}✓ Docker images built successfully${NC}"
echo ""

# Start services
echo "🚀 Starting services..."
docker-compose up -d
echo -e "${GREEN}✓ Services started successfully${NC}"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check backend health
if curl -f http://localhost:8000/health &> /dev/null; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

# Check frontend
if curl -f http://localhost:3000 &> /dev/null; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${RED}❌ Frontend is not accessible${NC}"
fi

echo ""
echo "=========================================="
echo "  🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo ""
