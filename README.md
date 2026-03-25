# Credit Card Fraud Detection

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
cd backend
pip install -r requirements.txt
```

### 2. Data Preparation
Download the [Credit Card Fraud Detection dataset](https://www.kaggle.com/mlg-ulb/creditcardfraud) and place `creditcard.csv` in the root directory:
```
Credit-Card-Fraud-Detection/
├── backend/
│   ├── credit_card_fraud_detection.ipynb
│   ├── requirements.txt
│   └── README.md
├── creditcard.csv    # ← Place dataset here
└── README.md
```

### 3. Run the Analysis
```bash
cd backend
jupyter notebook credit_card_fraud_detection.ipynb
```

---

## 📊 Project Structure

```
Credit-Card-Fraud-Detection/
├── backend/
│   ├── credit_card_fraud_detection.ipynb   # Main analysis notebook
│   ├── requirements.txt                     # Python dependencies
│   └── README.md                            # Backend documentation
├── creditcard.csv                           # Input dataset
└── README.md                                # Project overview
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
- ✅ Comprehensive EDA with visualizations
- ✅ Multiple class imbalance handling strategies
- ✅ Hyperparameter tuning with GridSearchCV
- ✅ Multi-metric evaluation dashboard
- ✅ Model persistence for deployment

### Business
- ✅ Cost-benefit analysis framework
- ✅ Threshold optimization for financial impact
- ✅ Precision vs Recall trade-off analysis
- ✅ Production deployment recommendations
- ✅ ROI calculations

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

After running the notebook:

| File | Description |
|------|-------------|
| `best_fraud_model.pkl` | Trained model ready for deployment |
| `amount_scaler.pkl` | Feature scaler for preprocessing |
| `model_comparison_results.csv` | Performance comparison table |
| `*.png` | Visualization charts |

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
import joblib

# Load model
model = joblib.load('best_fraud_model.pkl')
scaler = joblib.load('amount_scaler.pkl')

# Predict
def predict_fraud(transaction_data):
    # Preprocess
    transaction_data['Scaled_Amount'] = scaler.transform([transaction_data['Amount']])
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

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional feature engineering
- Deep learning approaches (Autoencoders, LSTMs)
- Real-time streaming implementation
- Model explainability (SHAP, LIME)

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
