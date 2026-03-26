"""
Create a real fraud detection model with synthetic data
"""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib
import os

print("=" * 60)
print("Creating Real Fraud Detection Model")
print("=" * 60)

# Create models directory
os.makedirs('models', exist_ok=True)
os.makedirs('data', exist_ok=True)

# Generate synthetic credit card transaction data
print("\n[1/5] Generating synthetic transaction data...")
np.random.seed(42)

n_samples = 10000
n_fraud = 200  # 2% fraud rate (realistic)

# Generate legitimate transactions
legitimate = pd.DataFrame({
    'Time': np.random.uniform(0, 172800, n_samples - n_fraud),
    **{f'V{i}': np.random.randn(n_samples - n_fraud) for i in range(1, 29)},
    'Scaled_Amount': np.abs(np.random.randn(n_samples - n_fraud) * 0.5),
    'Class': 0
})

# Generate fraudulent transactions (different distribution)
fraud = pd.DataFrame({
    'Time': np.random.uniform(0, 172800, n_fraud),
    **{f'V{i}': np.random.randn(n_fraud) * 2 + 1 for i in range(1, 29)},
    'Scaled_Amount': np.abs(np.random.randn(n_fraud) * 2 + 1),
    'Class': 1
})

# Combine and shuffle
df = pd.concat([legitimate, fraud], ignore_index=True)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"✓ Generated {len(df)} transactions ({n_fraud} fraudulent, {n_samples - n_fraud} legitimate)")

# Save dataset
df.to_csv('data/creditcard.csv', index=False)
print(f"✓ Saved dataset to data/creditcard.csv")

# Prepare features
print("\n[2/5] Preparing features...")
X = df.drop('Class', axis=1)
y = df['Class']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"✓ Training set: {len(X_train)} samples")
print(f"✓ Test set: {len(X_test)} samples")

# Train XGBoost model
print("\n[3/5] Training XGBoost model...")
model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    scale_pos_weight=(len(y_train) - sum(y_train)) / sum(y_train)
)

model.fit(X_train, y_train)
print("✓ Model trained successfully")

# Evaluate model
print("\n[4/5] Evaluating model...")
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

roc_auc = roc_auc_score(y_test, y_pred_proba)
print(f"\n✓ ROC-AUC Score: {roc_auc:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Fraud']))

# Save model
print("\n[5/5] Saving model...")
joblib.dump(model, 'models/best_fraud_model.pkl')
print("✓ Model saved to models/best_fraud_model.pkl")

print("\n" + "=" * 60)
print("✅ Real fraud detection model created successfully!")
print("=" * 60)
print(f"\nModel Performance:")
print(f"  • ROC-AUC Score: {roc_auc:.4f}")
print(f"  • Training Samples: {len(X_train)}")
print(f"  • Test Samples: {len(X_test)}")
print(f"  • Fraud Rate: {(sum(y) / len(y) * 100):.2f}%")
print("\n✓ Ready to start the application!")
