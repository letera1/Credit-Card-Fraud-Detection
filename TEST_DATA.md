# 🧪 Test Data for Fraud Detection

Copy and paste these transaction examples into the analyzer to test different scenarios.

---

## 🚨 HIGH FRAUD RISK Transactions

### Example 1: Suspicious High-Value Transaction
```json
{
  "Time": 84000,
  "V1": -3.5,
  "V2": 2.8,
  "V3": -4.2,
  "V4": 3.1,
  "V5": -2.9,
  "V6": 3.7,
  "V7": -3.3,
  "V8": 2.5,
  "V9": -3.8,
  "V10": 2.9,
  "V11": -3.1,
  "V12": 3.4,
  "V13": -2.7,
  "V14": 3.9,
  "V15": -3.2,
  "V16": 2.6,
  "V17": -3.5,
  "V18": 3.0,
  "V19": -2.8,
  "V20": 3.3,
  "V21": -3.6,
  "V22": 2.7,
  "V23": -3.4,
  "V24": 3.2,
  "V25": -2.9,
  "V26": 3.5,
  "V27": -3.1,
  "V28": 2.8,
  "Scaled_Amount": 4.5
}
```

### Example 2: Late Night Suspicious Activity
```json
{
  "Time": 82800,
  "V1": -4.1,
  "V2": 3.2,
  "V3": -3.9,
  "V4": 2.7,
  "V5": -3.5,
  "V6": 4.0,
  "V7": -3.7,
  "V8": 2.9,
  "V9": -4.2,
  "V10": 3.1,
  "V11": -3.8,
  "V12": 3.6,
  "V13": -3.3,
  "V14": 4.1,
  "V15": -3.9,
  "V16": 2.8,
  "V17": -4.0,
  "V18": 3.3,
  "V19": -3.6,
  "V20": 3.8,
  "V21": -4.2,
  "V22": 3.0,
  "V23": -3.7,
  "V24": 3.5,
  "V25": -3.4,
  "V26": 4.0,
  "V27": -3.8,
  "V28": 3.2,
  "Scaled_Amount": 5.2
}
```

### Example 3: Abnormal Pattern Transaction
```json
{
  "Time": 156000,
  "V1": -5.2,
  "V2": 4.1,
  "V3": -4.8,
  "V4": 3.9,
  "V5": -4.5,
  "V6": 5.0,
  "V7": -4.7,
  "V8": 3.8,
  "V9": -5.1,
  "V10": 4.2,
  "V11": -4.9,
  "V12": 4.6,
  "V13": -4.3,
  "V14": 5.2,
  "V15": -4.8,
  "V16": 3.7,
  "V17": -5.0,
  "V18": 4.3,
  "V19": -4.6,
  "V20": 4.9,
  "V21": -5.1,
  "V22": 4.0,
  "V23": -4.7,
  "V24": 4.5,
  "V25": -4.4,
  "V26": 5.0,
  "V27": -4.8,
  "V28": 4.2,
  "Scaled_Amount": 6.8
}
```

---

## ⚠️ MEDIUM RISK Transactions

### Example 4: Moderately Suspicious
```json
{
  "Time": 45000,
  "V1": -1.8,
  "V2": 1.5,
  "V3": -1.6,
  "V4": 1.3,
  "V5": -1.4,
  "V6": 1.7,
  "V7": -1.5,
  "V8": 1.2,
  "V9": -1.9,
  "V10": 1.4,
  "V11": -1.6,
  "V12": 1.8,
  "V13": -1.3,
  "V14": 1.9,
  "V15": -1.7,
  "V16": 1.1,
  "V17": -1.8,
  "V18": 1.5,
  "V19": -1.4,
  "V20": 1.6,
  "V21": -1.9,
  "V22": 1.3,
  "V23": -1.7,
  "V24": 1.5,
  "V25": -1.5,
  "V26": 1.8,
  "V27": -1.6,
  "V28": 1.4,
  "Scaled_Amount": 2.8
}
```

### Example 5: Unusual Time Pattern
```json
{
  "Time": 165000,
  "V1": -2.1,
  "V2": 1.8,
  "V3": -1.9,
  "V4": 1.6,
  "V5": -1.7,
  "V6": 2.0,
  "V7": -1.8,
  "V8": 1.5,
  "V9": -2.2,
  "V10": 1.7,
  "V11": -1.9,
  "V12": 2.1,
  "V13": -1.6,
  "V14": 2.2,
  "V15": -2.0,
  "V16": 1.4,
  "V17": -2.1,
  "V18": 1.8,
  "V19": -1.7,
  "V20": 1.9,
  "V21": -2.2,
  "V22": 1.6,
  "V23": -2.0,
  "V24": 1.8,
  "V25": -1.8,
  "V26": 2.1,
  "V27": -1.9,
  "V28": 1.7,
  "Scaled_Amount": 3.2
}
```

---

## ✅ LOW RISK (Legitimate) Transactions

### Example 6: Normal Daytime Purchase
```json
{
  "Time": 32400,
  "V1": -0.5,
  "V2": 0.3,
  "V3": -0.4,
  "V4": 0.2,
  "V5": -0.3,
  "V6": 0.4,
  "V7": -0.2,
  "V8": 0.1,
  "V9": -0.5,
  "V10": 0.3,
  "V11": -0.4,
  "V12": 0.5,
  "V13": -0.2,
  "V14": 0.6,
  "V15": -0.4,
  "V16": 0.2,
  "V17": -0.5,
  "V18": 0.3,
  "V19": -0.3,
  "V20": 0.4,
  "V21": -0.5,
  "V22": 0.2,
  "V23": -0.4,
  "V24": 0.3,
  "V25": -0.3,
  "V26": 0.5,
  "V27": -0.4,
  "V28": 0.2,
  "Scaled_Amount": 0.8
}
```

### Example 7: Regular Small Transaction
```json
{
  "Time": 54000,
  "V1": -0.3,
  "V2": 0.2,
  "V3": -0.2,
  "V4": 0.1,
  "V5": -0.2,
  "V6": 0.3,
  "V7": -0.1,
  "V8": 0.1,
  "V9": -0.3,
  "V10": 0.2,
  "V11": -0.2,
  "V12": 0.3,
  "V13": -0.1,
  "V14": 0.4,
  "V15": -0.3,
  "V16": 0.1,
  "V17": -0.3,
  "V18": 0.2,
  "V19": -0.2,
  "V20": 0.3,
  "V21": -0.3,
  "V22": 0.1,
  "V23": -0.2,
  "V24": 0.2,
  "V25": -0.2,
  "V26": 0.3,
  "V27": -0.2,
  "V28": 0.1,
  "Scaled_Amount": 0.5
}
```

### Example 8: Typical Weekend Purchase
```json
{
  "Time": 518400,
  "V1": -0.6,
  "V2": 0.4,
  "V3": -0.5,
  "V4": 0.3,
  "V5": -0.4,
  "V6": 0.5,
  "V7": -0.3,
  "V8": 0.2,
  "V9": -0.6,
  "V10": 0.4,
  "V11": -0.5,
  "V12": 0.6,
  "V13": -0.3,
  "V14": 0.7,
  "V15": -0.5,
  "V16": 0.3,
  "V17": -0.6,
  "V18": 0.4,
  "V19": -0.4,
  "V20": 0.5,
  "V21": -0.6,
  "V22": 0.3,
  "V23": -0.5,
  "V24": 0.4,
  "V25": -0.4,
  "V26": 0.6,
  "V27": -0.5,
  "V28": 0.3,
  "Scaled_Amount": 1.2
}
```

---

## 🎯 Edge Cases

### Example 9: Very High Amount (Likely Fraud)
```json
{
  "Time": 72000,
  "V1": -6.5,
  "V2": 5.2,
  "V3": -5.8,
  "V4": 4.9,
  "V5": -5.5,
  "V6": 6.0,
  "V7": -5.7,
  "V8": 4.8,
  "V9": -6.1,
  "V10": 5.2,
  "V11": -5.9,
  "V12": 5.6,
  "V13": -5.3,
  "V14": 6.2,
  "V15": -5.8,
  "V16": 4.7,
  "V17": -6.0,
  "V18": 5.3,
  "V19": -5.6,
  "V20": 5.9,
  "V21": -6.1,
  "V22": 5.0,
  "V23": -5.7,
  "V24": 5.5,
  "V25": -5.4,
  "V26": 6.0,
  "V27": -5.8,
  "V28": 5.2,
  "Scaled_Amount": 8.5
}
```

### Example 10: Borderline Case
```json
{
  "Time": 43200,
  "V1": -1.2,
  "V2": 0.9,
  "V3": -1.0,
  "V4": 0.8,
  "V5": -0.9,
  "V6": 1.1,
  "V7": -1.0,
  "V8": 0.7,
  "V9": -1.3,
  "V10": 0.9,
  "V11": -1.1,
  "V12": 1.2,
  "V13": -0.8,
  "V14": 1.3,
  "V15": -1.1,
  "V16": 0.7,
  "V17": -1.2,
  "V18": 0.9,
  "V19": -0.9,
  "V20": 1.0,
  "V21": -1.3,
  "V22": 0.8,
  "V23": -1.1,
  "V24": 0.9,
  "V25": -0.9,
  "V26": 1.2,
  "V27": -1.0,
  "V28": 0.8,
  "Scaled_Amount": 1.8
}
```

---

## 📊 Quick Copy Format (One-Line JSON)

### 🚨 High Fraud Risk
```
{"Time":84000,"V1":-3.5,"V2":2.8,"V3":-4.2,"V4":3.1,"V5":-2.9,"V6":3.7,"V7":-3.3,"V8":2.5,"V9":-3.8,"V10":2.9,"V11":-3.1,"V12":3.4,"V13":-2.7,"V14":3.9,"V15":-3.2,"V16":2.6,"V17":-3.5,"V18":3.0,"V19":-2.8,"V20":3.3,"V21":-3.6,"V22":2.7,"V23":-3.4,"V24":3.2,"V25":-2.9,"V26":3.5,"V27":-3.1,"V28":2.8,"Scaled_Amount":4.5}
```

### ⚠️ Medium Risk
```
{"Time":45000,"V1":-1.8,"V2":1.5,"V3":-1.6,"V4":1.3,"V5":-1.4,"V6":1.7,"V7":-1.5,"V8":1.2,"V9":-1.9,"V10":1.4,"V11":-1.6,"V12":1.8,"V13":-1.3,"V14":1.9,"V15":-1.7,"V16":1.1,"V17":-1.8,"V18":1.5,"V19":-1.4,"V20":1.6,"V21":-1.9,"V22":1.3,"V23":-1.7,"V24":1.5,"V25":-1.5,"V26":1.8,"V27":-1.6,"V28":1.4,"Scaled_Amount":2.8}
```

### ✅ Low Risk (Legitimate)
```
{"Time":32400,"V1":-0.5,"V2":0.3,"V3":-0.4,"V4":0.2,"V5":-0.3,"V6":0.4,"V7":-0.2,"V8":0.1,"V9":-0.5,"V10":0.3,"V11":-0.4,"V12":0.5,"V13":-0.2,"V14":0.6,"V15":-0.4,"V16":0.2,"V17":-0.5,"V18":0.3,"V19":-0.3,"V20":0.4,"V21":-0.5,"V22":0.2,"V23":-0.4,"V24":0.3,"V25":-0.3,"V26":0.5,"V27":-0.4,"V28":0.2,"Scaled_Amount":0.8}
```

---

## 🎓 Understanding the Data

### Field Explanations:
- **Time**: Seconds elapsed since first transaction (0-172800 = 48 hours)
- **V1-V28**: PCA-transformed features (anonymized for privacy)
- **Scaled_Amount**: Normalized transaction amount

### Time Patterns:
- **0-28800** (0-8 hours): Early morning
- **28800-64800** (8-18 hours): Business hours
- **64800-86400** (18-24 hours): Evening
- **86400+**: Next day

### Risk Indicators:
- **High V values** (>3 or <-3): Unusual patterns
- **High Scaled_Amount** (>3): Large transactions
- **Late night Time** (>79200): Suspicious timing
- **Extreme combinations**: Multiple red flags

---

## 🧪 Testing Scenarios

### Scenario 1: Test Fraud Detection
1. Copy "High Fraud Risk" example
2. Paste into analyzer
3. Expected: 🚨 FRAUD with high risk score (>80)

### Scenario 2: Test Legitimate Transaction
1. Copy "Low Risk" example
2. Paste into analyzer
3. Expected: ✅ LEGITIMATE with low risk score (<30)

### Scenario 3: Test Borderline Case
1. Copy "Borderline Case" example
2. Paste into analyzer
3. Expected: Medium risk score (30-60)

### Scenario 4: Compare Multiple Transactions
1. Test all 10 examples
2. Compare risk scores
3. Observe SHAP explanations

---

## 💡 Tips

- Use the **"Generate Random Data"** button for quick testing
- Try **modifying values** to see how predictions change
- **Higher V values** (positive or negative) increase fraud risk
- **Higher Scaled_Amount** increases fraud probability
- **Late night transactions** (Time > 79200) are more suspicious

---

## 🔍 What to Look For

When testing, observe:
1. **Fraud Probability**: 0-100%
2. **Risk Score**: 0-100
3. **Risk Level**: LOW, MEDIUM, HIGH, CRITICAL
4. **SHAP Explanations**: Which features influenced the decision
5. **Anomaly Flags**: Unusual patterns detected
6. **Recommended Action**: APPROVE, REVIEW, or BLOCK

---

**Happy Testing! 🛡️**
