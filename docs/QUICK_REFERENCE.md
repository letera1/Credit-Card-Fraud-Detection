# Quick Reference Guide

## Common Commands

### Setup
```bash
# Install dependencies
make install

# Or manually
pip install -r requirements.txt
pip install -e .
```

### Training
```bash
# Train models
make train

# Or directly
python scripts/train.py
```

### Prediction
```bash
# Single prediction (example)
python scripts/predict.py

# Batch prediction
python scripts/predict.py --input data/test.csv --output results.csv

# With specific model
python scripts/predict.py --model models/best_fraud_model.pkl
```

### Evaluation
```bash
python scripts/evaluate.py \
  --model models/best_fraud_model.pkl \
  --test-data data/test.csv \
  --output-dir outputs/evaluation
```

### API Server
```bash
# Development
make serve

# Production
uvicorn src.api.app:app --host 0.0.0.0 --port 8000 --workers 4

# Docker
docker-compose up -d
```

### Testing
```bash
# Run all tests
make test

# Run specific test
pytest tests/test_models.py -v

# With coverage
pytest tests/ --cov=src --cov-report=html
```

### Code Quality
```bash
# Format code
make format

# Lint code
make lint

# Both
make lint && make test
```

### Docker
```bash
# Build image
make docker-build

# Run container
make docker-run

# Or manually
docker build -t fraud-detection:latest .
docker run -p 8000:8000 fraud-detection:latest
```

## Configuration

Edit `config/config.yaml` to customize:

```yaml
data:
  raw_data_path: "data/creditcard.csv"
  test_size: 0.2
  random_state: 42

models:
  random_forest:
    n_estimators: 100
    max_depth: 10
  
  xgboost:
    n_estimators: 100
    max_depth: 6
    learning_rate: 0.1

business:
  avg_fraud_amount: 500
  cost_false_positive: 10
  optimal_threshold: 0.35
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/
```

### Predict
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "Time": 0,
    "V1": -1.36,
    "V2": -0.07,
    ...
    "Scaled_Amount": 0.5
  }'
```

## Project Structure

```
src/
├── api/              # FastAPI application
├── config/           # Configuration management
├── features/         # Feature engineering
├── monitoring/       # Logging and metrics
├── pipeline/         # Training and inference pipelines
├── data_loader.py    # Data loading
├── preprocessing.py  # Data preprocessing
├── sampling.py       # Sampling strategies
├── models.py         # Model training
├── evaluation.py     # Model evaluation
└── utils.py          # Utilities
```

## Troubleshooting

### Import Errors
```bash
# Ensure package is installed
pip install -e .

# Or add to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Model Not Found
```bash
# Train model first
python scripts/train.py

# Check models directory
ls -la models/
```

### API Not Starting
```bash
# Check if port is in use
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Use different port
uvicorn src.api.app:app --port 8001
```

### Tests Failing
```bash
# Install test dependencies
pip install pytest pytest-cov

# Run with verbose output
pytest tests/ -v -s
```

## Performance Tips

1. **Batch Predictions**: Use batch prediction for multiple transactions
2. **Model Caching**: Model is loaded once at API startup
3. **Async Processing**: Use async endpoints for better throughput
4. **Resource Limits**: Set appropriate CPU/memory limits in Docker
5. **Load Balancing**: Use multiple API instances behind load balancer

## Monitoring

### Logs
```bash
# View logs
tail -f logs/fraud_detection_*.log

# Search logs
grep "ERROR" logs/fraud_detection_*.log
```

### Metrics
```bash
# View metrics history
cat outputs/metrics/metrics_history.json | jq
```

## Best Practices

1. Always use virtual environment
2. Run tests before committing
3. Format code with Black
4. Update documentation
5. Use configuration files
6. Log important events
7. Monitor model performance
8. Version control models
9. Regular retraining
10. Security audits
