"""Simple training script for fraud detection models."""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib
from pathlib import Path

print("Training Fraud Detection Model...")

# Create directories
Path("models").mkdir(exist_ok=True)

# Load data
print("Loading data...")
df = pd.read_csv("data/creditcard.csv")

# Split features and target
X = df.drop("Class", axis=1)
y = df["Class"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale Amount feature
scaler = StandardScaler()
X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()
X_train_scaled["Scaled_Amount"] = scaler.fit_transform(X_train[["Amount"]])
X_test_scaled["Scaled_Amount"] = scaler.transform(X_test[["Amount"]])
X_train_scaled = X_train_scaled.drop("Amount", axis=1)
X_test_scaled = X_test_scaled.drop("Amount", axis=1)

# Apply SMOTE
print("Applying SMOTE...")
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train_scaled, y_train)

# Train model
print("Training XGBoost model...")
model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    use_label_encoder=False,
    eval_metric="logloss",
)
model.fit(X_resampled, y_resampled)

# Evaluate
from sklearn.metrics import roc_auc_score, classification_report

y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"\nModel Performance:")
print(f"ROC-AUC: {roc_auc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save model and scaler
print("\nSaving model...")
joblib.dump(model, "models/best_fraud_model.pkl")
joblib.dump(scaler, "models/amount_scaler.pkl")

print("✓ Training complete!")
print("✓ Model saved to models/best_fraud_model.pkl")
