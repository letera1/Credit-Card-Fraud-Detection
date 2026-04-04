# Test Transaction Data

This folder contains pre-configured test transactions for the Fraud Detection system.

## Available Test Cases

### 1. **legitimate_transaction.json**
- **Expected Result:** LEGITIMATE (Low Risk)
- **Risk Score:** ~5-15
- **Characteristics:** Normal PCA feature values, low amount, typical transaction time
- **Use Case:** Testing normal transaction flow

### 2. **moderate_risk_transaction.json**
- **Expected Result:** LEGITIMATE or MEDIUM Risk
- **Risk Score:** ~30-50
- **Characteristics:** Slightly elevated PCA values, moderate amount
- **Use Case:** Testing borderline cases that require review

### 3. **fraud_transaction.json**
- **Expected Result:** FRAUD (High Risk)
- **Risk Score:** ~60-80
- **Characteristics:** Abnormal PCA patterns, elevated amount, suspicious timing
- **Use Case:** Testing fraud detection capabilities

### 4. **high_risk_fraud.json**
- **Expected Result:** FRAUD (Critical Risk)
- **Risk Score:** ~80-95
- **Characteristics:** Extreme PCA deviations, very high amount, late-night transaction
- **Use Case:** Testing critical fraud alerts

## How to Use in Frontend

### Method 1: Copy & Paste
1. Open any JSON file above
2. Copy the entire content
3. In the frontend, switch to "JSON/Raw" mode
4. Paste the content into the JSON Payload Window
5. Click "RUN PREDICTION MODEL"

### Method 2: Manual Testing
1. Click "Inject Fraud Signature" button in the frontend
2. The system will auto-populate with fraud_transaction.json data
3. Click "RUN PREDICTION MODEL"

### Method 3: Auto-Generate
1. Stay in "Auto/Benign" mode
2. Click "RUN PREDICTION MODEL"
3. System generates random legitimate transaction data

## Understanding the Features

- **Time:** Seconds elapsed since first transaction (0-172800 for 48 hours)
- **V1-V28:** PCA-transformed features (anonymized for privacy)
  - Normal range: -2 to +2
  - Suspicious: > 2 or < -2
  - Critical: > 3 or < -3
- **Scaled_Amount:** Normalized transaction amount
  - Low: < 1.0
  - Medium: 1.0 - 2.5
  - High: 2.5 - 4.0
  - Very High: > 4.0

## Expected API Response

```json
{
  "fraud_probability": 0.032,
  "is_fraud": false,
  "threshold": 0.5,
  "confidence": 0.968,
  "risk_score": 3,
  "risk_level": "LOW",
  "transaction_id": "TXN-20260404215911-0",
  "timestamp": "2026-04-04T21:59:11.123456",
  "anomaly_flags": [],
  "recommended_action": "APPROVE - Transaction appears legitimate",
  "shap_explanation": {
    "top_features": [...]
  },
  "model_version": "3.0.0"
}
```

## Tips for Testing

1. **Test Progression:** Start with legitimate → moderate → fraud → high_risk
2. **Compare Results:** Note how risk scores and SHAP values change
3. **Anomaly Flags:** Watch for specific warnings in fraud cases
4. **Response Time:** Monitor inference latency in the UI
5. **Alert System:** Check if fraud cases trigger alerts in the dashboard

## Customizing Test Data

To create your own test cases:
1. Copy any existing JSON file
2. Modify the values:
   - Increase V1-V28 values for higher fraud probability
   - Increase Scaled_Amount for amount-based flags
   - Set Time > 150000 for late-night transaction flags
3. Save with a descriptive name
4. Test in the frontend

## Batch Testing

For automated testing, you can use these files with:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d @test_data/fraud_transaction.json
```
