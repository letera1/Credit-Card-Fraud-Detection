# API Documentation

## Overview
The Fraud Detection API provides real-time fraud prediction capabilities through RESTful endpoints.

## Base URL
```
http://localhost:8000
```

## Endpoints

### Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Credit Card Fraud Detection API",
  "version": "1.0.0"
}
```

### Detailed Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Predict Fraud
```http
POST /predict
```

**Request Body:**
```json
{
  "Time": 0,
  "V1": -1.3598071336738,
  "V2": -0.0727811733098497,
  "V3": 1.0,
  ...
  "V28": 0.1,
  "Scaled_Amount": 0.5
}
```

**Response:**
```json
{
  "fraud_probability": 0.85,
  "is_fraud": true,
  "threshold": 0.35,
  "confidence": 0.85
}
```

## Running the API

### Local Development
```bash
uvicorn src.api.app:app --reload --host 0.0.0.0 --port 8000
```

### Docker
```bash
docker-compose up -d
```

### Using Make
```bash
make serve
```

## Example Usage

### Python
```python
import requests

url = "http://localhost:8000/predict"
transaction = {
    "Time": 0,
    "V1": -1.36,
    # ... all features
    "Scaled_Amount": 0.5
}

response = requests.post(url, json=transaction)
result = response.json()
print(f"Fraud: {result['is_fraud']}")
```

### cURL
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

## Interactive Documentation
Once the API is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
