# System Architecture

## Overview
This document describes the architecture of the Credit Card Fraud Detection system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Raw Data     │  │ Processed    │  │ Model        │          │
│  │ (CSV)        │  │ Data         │  │ Artifacts    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Processing Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Data Loader  │→ │ Preprocessor │→ │ Feature      │          │
│  │              │  │              │  │ Engineer     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Training Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Sampling     │→ │ Model        │→ │ Evaluation   │          │
│  │ Strategies   │  │ Training     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Inference Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ API Gateway  │→ │ Inference    │→ │ Response     │          │
│  │ (FastAPI)    │  │ Pipeline     │  │ Formatter    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Monitoring Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Logging      │  │ Metrics      │  │ Alerting     │          │
│  │              │  │ Tracking     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Data Layer
- **Raw Data**: Credit card transaction data (CSV format)
- **Processed Data**: Cleaned and transformed data
- **Model Artifacts**: Trained models, scalers, and metadata

### 2. Processing Layer
- **Data Loader**: Loads and validates input data
- **Preprocessor**: Handles data splitting, scaling, and transformation
- **Feature Engineer**: Creates derived features and transformations

### 3. Training Layer
- **Sampling Strategies**: Handles class imbalance (SMOTE, over/undersampling)
- **Model Training**: Trains Random Forest and XGBoost models
- **Evaluation**: Computes metrics and selects best model

### 4. Inference Layer
- **API Gateway**: FastAPI REST endpoints
- **Inference Pipeline**: Orchestrates prediction workflow
- **Response Formatter**: Formats predictions for clients

### 5. Monitoring Layer
- **Logging**: Structured logging with rotation
- **Metrics Tracking**: Performance metrics persistence
- **Alerting**: (Future) Real-time alerts for anomalies

## Design Patterns

### 1. Pipeline Pattern
- Training and inference are organized as pipelines
- Each stage is independent and testable
- Easy to add new stages or modify existing ones

### 2. Strategy Pattern
- Multiple sampling strategies can be selected at runtime
- Easy to add new sampling methods
- Configuration-driven selection

### 3. Factory Pattern
- Model creation through factory methods
- Consistent interface for different model types
- Easy to add new model types

### 4. Singleton Pattern
- Configuration manager ensures single config instance
- Logger setup maintains consistent logging

## Data Flow

### Training Flow
```
Raw Data → Load → Validate → Split → Scale → Sample → Train → Evaluate → Save
```

### Inference Flow
```
Request → Validate → Preprocess → Predict → Format → Response
```

## Scalability Considerations

### Horizontal Scaling
- API can be replicated behind load balancer
- Stateless design enables easy scaling
- Docker containers for consistent deployment

### Vertical Scaling
- Model training can use more CPU/memory
- Batch prediction for large datasets
- GPU support for deep learning models (future)

### Caching
- Model loaded once at startup
- Configuration cached in memory
- Feature transformations optimized

## Security

### API Security
- Input validation on all endpoints
- Rate limiting (to be implemented)
- Authentication/Authorization (to be implemented)

### Data Security
- No PII in logs
- Secure model storage
- Encrypted communication (HTTPS)

## Monitoring & Observability

### Metrics
- Request latency
- Prediction distribution
- Model performance drift
- Resource utilization

### Logging
- Structured JSON logs
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Daily log rotation
- Centralized log aggregation (future)

### Health Checks
- Liveness probe: `/health`
- Readiness probe: `/`
- Model availability check

## Future Enhancements

1. **Model Registry**: MLflow or similar for model versioning
2. **Feature Store**: Centralized feature management
3. **A/B Testing**: Compare model versions in production
4. **Real-time Streaming**: Kafka/Kinesis integration
5. **Model Explainability**: SHAP/LIME integration
6. **Automated Retraining**: Scheduled model updates
7. **Dashboard**: Grafana for monitoring
8. **Alerting**: PagerDuty/Slack integration
