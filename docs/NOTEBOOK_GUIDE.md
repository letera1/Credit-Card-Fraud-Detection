# Credit Card Fraud Detection - ML Pipeline

## Overview
Production-ready Jupyter Notebook for credit card fraud detection using advanced sampling techniques and ensemble methods.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Data Setup
Place your `creditcard.csv` file in the parent directory:
```
Credit-Card-Fraud-Detection/
├── backend/
│   ├── credit_card_fraud_detection.ipynb
│   └── requirements.txt
└── creditcard.csv  # <-- Place here
```

### 3. Run the Notebook
```bash
cd backend
jupyter notebook credit_card_fraud_detection.ipynb
```

## Notebook Structure

| Section | Description |
|---------|-------------|
| **EDA** | Data exploration, class imbalance visualization, correlation analysis |
| **Preprocessing** | Feature scaling, stratified train/test split |
| **Sampling** | Undersampling, Oversampling, SMOTE comparison |
| **Modeling** | Random Forest, XGBoost with hyperparameter tuning |
| **Evaluation** | Precision, Recall, F1, ROC-AUC, Confusion Matrix |
| **Business** | Cost-benefit analysis, threshold optimization, deployment recommendations |

## Key Features

- ✅ Handles severe class imbalance (~0.17% fraud rate)
- ✅ Multiple sampling strategies (Undersampling, Oversampling, SMOTE)
- ✅ Two ensemble models (Random Forest, XGBoost)
- ✅ Hyperparameter tuning with GridSearchCV
- ✅ Comprehensive evaluation metrics
- ✅ Business impact analysis with cost-benefit calculations
- ✅ Threshold optimization for optimal financial outcome
- ✅ Production deployment recommendations

## Output Artifacts

After running the notebook:
- `best_fraud_model.pkl` - Trained model for deployment
- `amount_scaler.pkl` - Feature scaler
- `model_comparison_results.csv` - Performance comparison
- Various visualization PNGs

## Business Metrics

The notebook calculates:
- **Net Financial Benefit**: Fraud prevented - Fraud missed - False positive costs
- **Optimal Threshold**: Decision threshold maximizing financial outcome
- **ROI**: Return on investment for fraud detection system

## Customization

Adjust these parameters based on your business context:
```python
AVG_FRAUD_AMOUNT = 500        # Your average fraud transaction amount
COST_FALSE_POSITIVE = 10      # Cost of investigating false alarm
```
