.PHONY: help install test lint format clean train serve docker-build docker-run

help:
	@echo "Available commands:"
	@echo "  install       Install dependencies"
	@echo "  test          Run tests"
	@echo "  lint          Run linting"
	@echo "  format        Format code"
	@echo "  clean         Clean generated files"
	@echo "  train         Run training pipeline"
	@echo "  serve         Start API server"
	@echo "  docker-build  Build Docker image"
	@echo "  docker-run    Run Docker container"

install:
	pip install -r requirements.txt
	pip install -e .

test:
	pytest tests/ -v --cov=src --cov-report=html

lint:
	flake8 src tests
	black --check src tests

format:
	black src tests
	isort src tests

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf .coverage
	rm -rf dist build *.egg-info

train:
	python scripts/train.py

serve:
	uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000

docker-build:
	docker build -t fraud-detection:latest .

docker-run:
	docker-compose up -d
