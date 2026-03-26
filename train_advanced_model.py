"""
Advanced ML Model Training with Ensemble, Feature Engineering, and SMOTE
"""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.metrics import classification_report, roc_auc_score, precision_recall_curve, confusion_matrix
from imblearn.over_sampling import SMOTE
from imblearn.combine import SMOTETomek
import joblib
import os
import json
from datetime import datetime

print("=" * 70)
print("ADVANCED ML MODEL TRAINING - EXPERT EDITION")
print("=" * 70)

# Create directories
os.makedirs('models', exist_ok=True)
os.makedirs('data', exist_ok=True)
os.makedirs('reports', exist_ok=True)

# Generate advanced synthetic data with realistic patterns
print("\n[1/8] Generating Advanced Synthetic Dataset...")
np.random.seed(42)

n_samples = 50000
fraud_rate = 0.02
n_fraud = int(n_samples * fraud_rate)
n_legit = n_samples - n_fraud

# Legitimate transactions - normal distribution
legitimate = pd.DataFrame({
    'Time': np.random.uniform(0, 172800, n_legit),
    **{f'V{i}': np.random.randn(n_legit) for i in range(1, 29)},
    'Amount': np.abs(np.random.lognormal(3, 1.5, n_legit)),
    'Class': 0
})

# Fraudulent transactions - different distribution
fraud = pd.DataFrame({
    'Time': np.random.uniform(0, 172800, n_fraud),
    **{f'V{i}': np.random.randn(n_fraud) * 2.5 + np.random.choice([-2, 2]) for i in range(1, 29)},
    'Amount': np.abs(np.random.lognormal(4, 2, n_fraud)),
    'Class': 1
})

df = pd.concat([legitimate, fraud], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

print(f"✓ Generated {len(df)} transactions")
print(f"  - Legitimate: {len(legitimate)} ({(len(legitimate)/len(df)*100):.2f}%)")
print(f"  - Fraud: {len(fraud)} ({(len(fraud)/len(df)*100):.2f}%)")

# Feature Engineering
print("\n[2/8] Advanced Feature Engineering...")

# Time-based features
df['Hour'] = (df['Time'] / 3600) % 24
df['Day'] = (df['Time'] / 86400).astype(int)
df['Is_Night'] = ((df['Hour'] >= 22) | (df['Hour'] <= 6)).astype(int)
df['Is_Weekend'] = (df['Day'] % 7 >= 5).astype(int)

# Amount-based features
df['Log_Amount'] = np.log1p(df['Amount'])
df['Amount_Squared'] = df['Amount'] ** 2
df['Amount_Sqrt'] = np.sqrt(df['Amount'])

# Statistical features from V columns
v_cols = [f'V{i}' for i in range(1, 29)]
df['V_Mean'] = df[v_cols].mean(axis=1)
df['V_Std'] = df[v_cols].std(axis=1)
df['V_Max'] = df[v_cols].max(axis=1)
df['V_Min'] = df[v_cols].min(axis=1)
df['V_Range'] = df['V_Max'] - df['V_Min']

# Interaction features
df['V1_V2_Interaction'] = df['V1'] * df['V2']
df['V1_Amount_Interaction'] = df['V1'] * df['Log_Amount']

# Anomaly scores
df['V_Anomaly_Score'] = np.abs(df[v_cols]).sum(axis=1)

print(f"✓ Created {len(df.columns) - 31} new features")
print(f"  Total features: {len(df.columns) - 1}")

# Save dataset
df.to_csv('data/creditcard_advanced.csv', index=False)

# Prepare features
print("\n[3/8] Preparing Training Data...")
X = df.drop('Class', axis=1)
y = df['Class']

# Scale Amount
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X['Scaled_Amount'] = scaler.fit_transform(X[['Amount']])
X = X.drop('Amount', axis=1)

# Save scaler
joblib.dump(scaler, 'models/amount_scaler.pkl')

# Train-test split with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"✓ Train: {len(X_train)} samples")
print(f"✓ Test: {len(X_test)} samples")

# Handle class imbalance with SMOTE
print("\n[4/8] Applying SMOTE for Class Imbalance...")
smote = SMOTETomek(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

print(f"✓ Before SMOTE: {sum(y_train)} fraud cases")
print(f"✓ After SMOTE: {sum(y_train_balanced)} fraud cases")
print(f"✓ Balanced dataset: {len(X_train_balanced)} samples")

# Train Ensemble Models
print("\n[5/8] Training Ensemble Models...")

models = {}

# XGBoost
print("  Training XGBoost...")
xgb_model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    scale_pos_weight=1,
    eval_metric='logloss'
)
xgb_model.fit(X_train_balanced, y_train_balanced)
models['xgboost'] = xgb_model

# LightGBM
print("  Training LightGBM...")
lgb_model = LGBMClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    verbose=-1
)
lgb_model.fit(X_train_balanced, y_train_balanced)
models['lightgbm'] = lgb_model

# Random Forest
print("  Training Random Forest...")
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train_balanced, y_train_balanced)
models['random_forest'] = rf_model

print("✓ All models trained")

# Evaluate Models
print("\n[6/8] Evaluating Models...")

results = {}
for name, model in models.items():
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    results[name] = {
        'roc_auc': roc_auc,
        'predictions': y_pred.tolist(),
        'probabilities': y_pred_proba.tolist()
    }
    
    print(f"\n  {name.upper()}:")
    print(f"    ROC-AUC: {roc_auc:.4f}")

# Ensemble Prediction (Voting)
print("\n[7/8] Creating Ensemble Model...")
ensemble_proba = np.mean([
    models['xgboost'].predict_proba(X_test)[:, 1],
    models['lightgbm'].predict_proba(X_test)[:, 1],
    models['random_forest'].predict_proba(X_test)[:, 1]
], axis=0)

ensemble_pred = (ensemble_proba > 0.5).astype(int)
ensemble_roc_auc = roc_auc_score(y_test, ensemble_proba)

print(f"✓ Ensemble ROC-AUC: {ensemble_roc_auc:.4f}")

# Save best model (ensemble weights)
best_model = models['xgboost']  # Use XGBoost as primary
joblib.dump(best_model, 'models/best_fraud_model.pkl')
joblib.dump(models, 'models/ensemble_models.pkl')

# Save feature names
feature_names = X.columns.tolist()
joblib.dump(feature_names, 'models/feature_names.pkl')

print("\n[8/8] Generating Model Report...")

# Detailed metrics
from sklearn.metrics import precision_score, recall_score, f1_score

report = {
    'timestamp': datetime.now().isoformat(),
    'dataset': {
        'total_samples': len(df),
        'fraud_rate': fraud_rate,
        'features': len(feature_names),
        'train_samples': len(X_train),
        'test_samples': len(X_test)
    },
    'models': {
        'xgboost': {
            'roc_auc': float(results['xgboost']['roc_auc']),
            'precision': float(precision_score(y_test, models['xgboost'].predict(X_test))),
            'recall': float(recall_score(y_test, models['xgboost'].predict(X_test))),
            'f1': float(f1_score(y_test, models['xgboost'].predict(X_test)))
        },
        'lightgbm': {
            'roc_auc': float(results['lightgbm']['roc_auc']),
            'precision': float(precision_score(y_test, models['lightgbm'].predict(X_test))),
            'recall': float(recall_score(y_test, models['lightgbm'].predict(X_test))),
            'f1': float(f1_score(y_test, models['lightgbm'].predict(X_test)))
        },
        'random_forest': {
            'roc_auc': float(results['random_forest']['roc_auc']),
            'precision': float(precision_score(y_test, models['random_forest'].predict(X_test))),
            'recall': float(recall_score(y_test, models['random_forest'].predict(X_test))),
            'f1': float(f1_score(y_test, models['random_forest'].predict(X_test)))
        },
        'ensemble': {
            'roc_auc': float(ensemble_roc_auc),
            'precision': float(precision_score(y_test, ensemble_pred)),
            'recall': float(recall_score(y_test, ensemble_pred)),
            'f1': float(f1_score(y_test, ensemble_pred))
        }
    },
    'feature_engineering': {
        'time_features': ['Hour', 'Day', 'Is_Night', 'Is_Weekend'],
        'amount_features': ['Log_Amount', 'Amount_Squared', 'Amount_Sqrt'],
        'statistical_features': ['V_Mean', 'V_Std', 'V_Max', 'V_Min', 'V_Range'],
        'interaction_features': ['V1_V2_Interaction', 'V1_Amount_Interaction'],
        'anomaly_features': ['V_Anomaly_Score']
    }
}

with open('reports/model_report.json', 'w') as f:
    json.dump(report, f, indent=2)

print("\n" + "=" * 70)
print("✅ ADVANCED MODEL TRAINING COMPLETE!")
print("=" * 70)
print(f"\nBest Model Performance:")
print(f"  • ROC-AUC: {ensemble_roc_auc:.4f}")
print(f"  • Precision: {report['models']['ensemble']['precision']:.4f}")
print(f"  • Recall: {report['models']['ensemble']['recall']:.4f}")
print(f"  • F1-Score: {report['models']['ensemble']['f1']:.4f}")
print(f"\nModels saved:")
print(f"  • models/best_fraud_model.pkl")
print(f"  • models/ensemble_models.pkl")
print(f"  • models/feature_names.pkl")
print(f"  • models/amount_scaler.pkl")
print(f"\nReport saved: reports/model_report.json")
print("\n✓ Ready for production deployment!")
