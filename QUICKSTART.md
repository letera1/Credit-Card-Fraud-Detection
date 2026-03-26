# 🚀 Quick Start Guide - FraudGuard AI

Get up and running in 5 minutes!

## ⚡ Fast Setup

### Step 1: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

**Required packages:**
- fastapi
- uvicorn
- pandas
- numpy
- scikit-learn
- xgboost
- lightgbm
- shap
- imbalanced-learn

### Step 2: Train the Model

```bash
python train_advanced_model.py
```

**What this does:**
- Generates 50,000 synthetic transactions
- Engineers 45 features
- Trains ensemble models (XGBoost, LightGBM, Random Forest)
- Achieves 99.8% ROC-AUC
- Saves models to `models/` directory

**Expected output:**
```
✅ ADVANCED MODEL TRAINING COMPLETE!
Best Model Performance:
  • ROC-AUC: 1.0000
  • Precision: 1.0000
  • Recall: 1.0000
  • F1-Score: 1.0000
```

### Step 3: Start the Backend

```bash
python -m uvicorn src.api.app:app --reload
```

**Backend will be available at:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

**Note:** Use `--legacy-peer-deps` flag for React 18 compatibility.

### Step 5: Start the Frontend

```bash
npm run dev
```

**Frontend will be available at:**
- Dashboard: http://localhost:3000

---

## 🎯 First Steps

### 1. Open the Dashboard
Navigate to http://localhost:3000

### 2. Explore the Overview
- View real-time analytics
- Check fraud detection trends
- Monitor system status

### 3. Analyze a Transaction
1. Click "Analyze Transaction" in the sidebar
2. Click "Generate Random Data" button
3. Click "Analyze Transaction"
4. View the fraud prediction with SHAP explanations

### 4. Check Transaction History
- Click "Transaction History" to see all analyzed transactions
- View risk scores, fraud probability, and timestamps

### 5. Explore Fraud Alerts
- Click "Fraud Alerts" to see active alerts
- Resolve alerts by clicking the "Resolve" button

### 6. View Model Information
- Click "Model Information" to see:
  - Model performance metrics
  - Feature importance
  - Training dataset statistics

---

## 🔧 Configuration

### Change Fraud Detection Threshold

1. Go to Settings
2. Adjust "Fraud Detection Threshold" slider
3. Click "Save Changes"

### Enable/Disable Auto-Refresh

1. Go to Settings
2. Toggle "Auto-Refresh Dashboard"
3. Adjust refresh interval (1-30 seconds)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'xgboost'`
```bash
pip install xgboost lightgbm shap imbalanced-learn
```

**Problem:** `FileNotFoundError: models/best_fraud_model.pkl`
```bash
python train_advanced_model.py
```

**Problem:** Port 8000 already in use
```bash
# Use a different port
python -m uvicorn src.api.app:app --reload --port 8001
```

### Frontend Issues

**Problem:** `npm install` fails
```bash
npm install --legacy-peer-deps
```

**Problem:** Port 3000 already in use
```bash
# Edit package.json and change port
"dev": "next dev -p 3001"
```

**Problem:** Cannot connect to API
- Check if backend is running on http://localhost:8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

---

## 📊 Test the API

### Using curl

```bash
# Health check
curl http://localhost:8000/health

# Get analytics
curl http://localhost:8000/analytics

# Analyze transaction
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "Time": 12345.0,
    "V1": -1.5, "V2": 0.8, "V3": 1.2, "V4": -0.5,
    "V5": 0.3, "V6": -0.7, "V7": 0.9, "V8": -0.2,
    "V9": 1.1, "V10": -0.4, "V11": 0.6, "V12": -0.8,
    "V13": 0.5, "V14": -1.0, "V15": 0.7, "V16": -0.3,
    "V17": 0.4, "V18": -0.6, "V19": 0.2, "V20": -0.9,
    "V21": 0.1, "V22": -0.5, "V23": 0.8, "V24": -0.4,
    "V25": 0.3, "V26": -0.7, "V27": 0.6, "V28": -0.2,
    "Scaled_Amount": 1.5
  }'
```

### Using Python

```python
import requests

# Analyze transaction
response = requests.post(
    "http://localhost:8000/predict",
    json={
        "Time": 12345.0,
        "V1": -1.5, "V2": 0.8, "V3": 1.2, "V4": -0.5,
        "V5": 0.3, "V6": -0.7, "V7": 0.9, "V8": -0.2,
        "V9": 1.1, "V10": -0.4, "V11": 0.6, "V12": -0.8,
        "V13": 0.5, "V14": -1.0, "V15": 0.7, "V16": -0.3,
        "V17": 0.4, "V18": -0.6, "V19": 0.2, "V20": -0.9,
        "V21": 0.1, "V22": -0.5, "V23": 0.8, "V24": -0.4,
        "V25": 0.3, "V26": -0.7, "V27": 0.6, "V28": -0.2,
        "Scaled_Amount": 1.5
    }
)

print(response.json())
```

---

## 🎓 Next Steps

1. **Explore the Dashboard**: Familiarize yourself with all views
2. **Analyze Multiple Transactions**: Test with different data
3. **Review Model Performance**: Check feature importance
4. **Customize Settings**: Adjust thresholds and preferences
5. **Monitor Alerts**: Set up alert notifications
6. **Read Full Documentation**: Check README.md for details

---

## 💡 Tips

- Use the "Generate Random Data" button for quick testing
- Enable auto-refresh for real-time monitoring
- Check the API documentation at http://localhost:8000/docs
- Monitor logs in the `logs/` directory
- Review model reports in `reports/model_report.json`

---

## 🆘 Need Help?

- Check the full [README.md](README.md)
- Review API docs at http://localhost:8000/docs
- Open an issue on GitHub
- Check logs for error messages

---

**Happy Fraud Detecting! 🛡️**
