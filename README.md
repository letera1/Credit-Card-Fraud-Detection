# Credit Card Fraud Detection

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-passing-brightgreen.svg)](https://github.com)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

A production-ready machine learning pipeline for detecting credit card fraud using advanced sampling techniques and ensemble methods.

---

## 📋 Overview

This project tackles the challenging problem of **credit card fraud detection** in highly imbalanced datasets where fraudulent transactions represent less than 0.2% of all transactions. The solution goes beyond accuracy to focus on minimizing financial loss while maintaining acceptable customer experience.

### Key Challenges Addressed
- **Severe Class Imbalance** (~570:1 ratio)
- **Cost Asymmetry** - False negatives are far more costly than false positives
- **Real-world Deployment** - Actionable business insights and threshold optimization

---

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone <repository-url>
cd Credit-Card-Fraud-Detection

# Using Make (recommended)
make install

# Or manually
pip install -r requirements.txt
pip install -e .
```

### 2. Data Preparation
Download the [Credit Card Fraud Detection dataset](https://www.kaggle.com/mlg-ulb/creditcardfraud) and place `creditcard.csv` in the `data/` directory:
```
Credit-Card-Fraud-Detection/
├── data/
│   └── creditcard.csv    # ← Place dataset here
└── ...
```

### 3. Run the Training Pipeline
```bash
# Using Make
make train

# Or directly
python scripts/train.py
```

### 4. Start API Server
```bash
# Using Make
make serve

# Using Docker
docker-compose up -d

# Or directly
uvicorn src.api.app:app --reload
```

### 5. Make Predictions
```bash
# Single prediction
python scripts/predict.py

# Batch prediction
python scripts/predict.py --input data/test.csv --output results.csv
```

---

## 📊 Project Structure

```
Credit-Card-Fraud-Detection/
├── .github/
│   └── workflows/
│       └── ci.yml                           # CI/CD pipeline
├── config/
│   └── config.yaml                          # Configuration management
├── data/
│   └── creditcard.csv                       # Dataset (place here)
├── docs/
│   ├── API.md                               # API documentation
│   ├── DEPLOYMENT.md                        # Deployment guide
│   ├── NOTEBOOK_GUIDE.md                    # Notebook guide
│   ├── PROJECT_STRUCTURE.md                 # Structure details
│   └── SETUP.md                             # Setup instructions
├── logs/                                    # Application logs
├── models/                                  # Trained model artifacts
├── notebooks/
│   └── credit_card_fraud_detection.ipynb   # Analysis notebook
├── outputs/
│   ├── metrics/                             # Metrics tracking
│   ├── plots/                               # Visualizations
│   └── results/                             # Model results
├── scripts/
│   ├── train.py                             # Training pipeline
│   └── predict.py                           # Prediction script
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   └── app.py                           # FastAPI application
│   ├── config/
│   │   ├── __init__.py
│   │   └── config_manager.py                # Config management
│   ├── features/
│   │   ├── __init__.py
│   │   └── feature_engineer.py              # Feature engineering
│   ├── monitoring/
│   │   ├── __init__.py
│   │   ├── logger.py                        # Logging setup
│   │   └── metrics_tracker.py               # Metrics tracking
│   ├── pipeline/
│   │   ├── __init__.py
│   │   ├── training_pipeline.py             # Training orchestration
│   │   └── inference_pipeline.py            # Inference orchestration
│   ├── data_loader.py                       # Data loading
│   ├── preprocessing.py                     # Preprocessing
│   ├── sampling.py                          # Sampling strategies
│   ├── models.py                            # Model training
│   ├── evaluation.py                        # Evaluation
│   └── utils.py                             # Utilities
├── tests/
│   ├── conftest.py                          # Pytest configuration
│   ├── test_data_loader.py                  # Data loader tests
│   ├── test_models.py                       # Model tests
│   └── test_preprocessing.py                # Preprocessing tests
├── .gitignore
├── docker-compose.yml                       # Docker Compose config
├── Dockerfile                               # Docker image definition
├── Makefile                                 # Build automation
├── pyproject.toml                           # Project metadata
├── requirements.txt                         # Python dependencies
├── setup.py                                 # Package setup
├── LICENSE
└── README.md                                # This file
```

---

## 🔬 Methodology

### Pipeline Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│     EDA     │ →  │ Preprocessing│ →  │   Sampling  │ →  │   Modeling   │ →  │  Evaluation │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
     • Shape            • Split           • Undersample      • Random Forest    • Precision
     • Missing          • Scale           • Oversample       • XGBoost          • Recall
     • Distribution     • Stratify        • SMOTE            • GridSearchCV     • F1-Score
     • Correlation                                                          • ROC-AUC
```

### Models & Techniques

| Component | Methods |
|-----------|---------|
| **Sampling** | Random Undersampling, Random Oversampling, SMOTE |
| **Algorithms** | Random Forest, XGBoost |
| **Validation** | Stratified K-Fold Cross-Validation |
| **Metrics** | Precision, Recall, F1, ROC-AUC, Confusion Matrix |

---

## 📈 Key Features

### Technical
- ✅ Modular, production-ready architecture
- ✅ Comprehensive EDA with visualizations
- ✅ Multiple class imbalance handling strategies
- ✅ Hyperparameter tuning with GridSearchCV
- ✅ Multi-metric evaluation dashboard
- ✅ RESTful API with FastAPI
- ✅ Docker containerization
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Comprehensive logging and monitoring
- ✅ Unit tests with pytest

### Business
- ✅ Cost-benefit analysis framework
- ✅ Threshold optimization for financial impact
- ✅ Precision vs Recall trade-off analysis
- ✅ Production deployment recommendations
- ✅ ROI calculations
- ✅ Real-time inference capabilities

---

## 🎯 Results Summary

The notebook evaluates **8 model configurations** (2 algorithms × 4 sampling strategies) and provides:

| Metric | Description |
|--------|-------------|
| **ROC-AUC** | Overall discrimination ability |
| **Recall** | % of fraud cases correctly detected |
| **Precision** | % of predicted fraud that is actual fraud |
| **Net Benefit** | Financial impact (fraud prevented - losses - costs) |

### Expected Performance (Typical)
- **ROC-AUC**: 0.97+
- **Recall**: 85-95%
- **Precision**: 80-90%

---

## 💼 Business Impact

### Cost Model
```
Net Benefit = (Fraud Prevented) - (Fraud Missed) - (False Positive Costs)
```

### Default Assumptions (Customizable)
| Parameter | Value | Description |
|-----------|-------|-------------|
| Avg Fraud Amount | $500 | Average fraudulent transaction |
| False Positive Cost | $10 | Investigation/customer service cost |
| False Negative Cost | $500 | Full fraud loss |

### Threshold Recommendations
- **Low Threshold (0.1-0.3)**: Maximize fraud detection, more false alarms
- **Medium Threshold (0.3-0.5)**: Balanced approach (recommended)
- **High Threshold (0.5+)**: Minimize false alarms, risk missing fraud

---

## 🛠️ Configuration

### Customize for Your Business
Edit these parameters in the notebook:

```python
AVG_FRAUD_AMOUNT = 500        # Your average fraud amount
COST_FALSE_POSITIVE = 10      # Cost per false alarm
```

### Model Parameters
```python
# XGBoost tuning grid
param_grid = {
    'max_depth': [4, 6, 8],
    'learning_rate': [0.05, 0.1, 0.2],
    'n_estimators': [50, 100, 200]
}
```

---

## 📁 Output Artifacts

After running the training pipeline:

| File | Location | Description |
|------|----------|-------------|
| `best_fraud_model.pkl` | `models/` | Trained model ready for deployment |
| `amount_scaler.pkl` | `models/` | Feature scaler for preprocessing |
| `model_comparison.csv` | `outputs/results/` | Performance comparison table |
| `*.png` | `outputs/plots/` | Visualization charts |

---

## 🚀 Deployment Guide

### Production Checklist

1. **Model Selection**: Use best-performing configuration (typically XGBoost + SMOTE)
2. **Threshold Setting**: Deploy with optimized threshold for your cost structure
3. **Monitoring**: Track precision/recall drift weekly
4. **Retraining**: Monthly retraining with new fraud patterns
5. **Risk Mitigation**: Human review for borderline cases (0.3-0.7 probability)

### Integration Example
```python
from src.utils import load_model

# Load model
model = load_model('models/best_fraud_model.pkl')
scaler = load_model('models/amount_scaler.pkl')

# Predict
def predict_fraud(transaction_data):
    # Preprocess
    transaction_data['Scaled_Amount'] = scaler.transform([[transaction_data['Amount']]])[0]
    # Predict
    proba = model.predict_proba([transaction_data])[0, 1]
    return proba >= 0.35  # Optimized threshold
```

---

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| pandas | 1.3+ | Data manipulation |
| numpy | 1.21+ | Numerical operations |
| scikit-learn | 0.24+ | ML algorithms |
| imbalanced-learn | 0.8+ | Sampling techniques |
| xgboost | 1.4+ | Gradient boosting |
| matplotlib/seaborn | 3.4+/0.11+ | Visualizations |

---

## 📖 Dataset

**Source**: [ULB Machine Learning Group - Credit Card Fraud Detection](https://www.kaggle.com/mlg-ulb/creditcardfraud)

**Characteristics**:
- 284,807 transactions
- 492 fraud cases (0.172%)
- 30 features (V1-V28 are PCA-transformed, plus Amount and Class)
- Data collected over 2 days in September 2013

**Privacy Note**: Features V1-V28 are anonymized PCA components. Only `Amount` and `Class` are original features.

---

## 📚 Documentation

- [Quick Reference](docs/QUICK_REFERENCE.md) - Common commands and tips
- [Setup Guide](docs/SETUP.md) - Installation and configuration
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [API Documentation](docs/API.md) - REST API endpoints and usage
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment strategies
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Codebase organization
- [Notebook Guide](docs/NOTEBOOK_GUIDE.md) - Jupyter notebook details
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [Changelog](CHANGELOG.md) - Version history

## 🧪 Testing

```bash
# Run all tests
make test

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_models.py -v
```

## 🎨 Code Quality

```bash
# Format code
make format

# Lint code
make lint

# Run all quality checks
make lint && make test
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas for improvement:
- Additional feature engineering techniques
- Deep learning approaches (Autoencoders, LSTMs, Transformers)
- Real-time streaming implementation with Kafka/Kinesis
- Model explainability (SHAP, LIME, Integrated Gradients)
- Advanced ensemble methods
- Automated hyperparameter optimization (Optuna, Ray Tune)
- Model monitoring and drift detection
- A/B testing framework

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Dataset provided by [ULB Machine Learning Group](https://www.ulb.ac.be/en/sciences/di/map/mlg.html)
- Inspired by real-world fraud detection challenges in financial services

---

## 📞 Contact

For questions or collaboration opportunities, please open an issue in the repository.

---

**⚠️ Disclaimer**: This project is for educational and research purposes. For production use, ensure compliance with financial regulations and data privacy laws.
