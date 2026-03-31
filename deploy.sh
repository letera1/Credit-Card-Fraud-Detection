#!/bin/bash

# Fraud Detection AI - Quick Deploy Script
# This script helps you deploy the application quickly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Fraud Detection AI - Quick Deployment Script        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker Compose is installed"

# Check if models exist
if [ ! -f "models/best_fraud_model.pkl" ]; then
    echo -e "${YELLOW}⚠${NC} ML model not found. Training required."
    echo ""
    read -p "Do you want to train the model first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Training ML model...${NC}"
        
        # Check if Python is available
        if command -v python &> /dev/null; then
            python train_advanced_model.py
        elif command -v python3 &> /dev/null; then
            python3 train_advanced_model.py
        else
            echo -e "${RED}❌ Python is not installed. Please install Python 3.11+${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✓${NC} Model training complete"
    fi
fi

# Create .env files if they don't exist
if [ ! -f ".env" ]; then
    echo -e "${GREEN}Creating .env file...${NC}"
    cp .env.example .env 2>/dev/null || echo "# Backend Environment" > .env
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${GREEN}Creating frontend .env.local file...${NC}"
    cp frontend/.env.example frontend/.env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
fi

# Build and start services
echo ""
echo -e "${GREEN}Building Docker images...${NC}"
docker-compose build

echo ""
echo -e "${GREEN}Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo ""
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Health check
echo ""
echo -e "${GREEN}Checking service health...${NC}"

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Backend is healthy"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "${YELLOW}Waiting for backend... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}⚠${NC} Backend health check failed. Check logs with: docker-compose logs backend"
fi

# Final status
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Deployment Complete! 🎉                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Frontend:${NC}  http://localhost:3000"
echo -e "${GREEN}Backend:${NC}   http://localhost:8000"
echo -e "${GREEN}API Docs:${NC}  http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  docker-compose logs -f     # View logs"
echo "  docker-compose down        # Stop services"
echo "  make help                  # More commands"
echo ""
