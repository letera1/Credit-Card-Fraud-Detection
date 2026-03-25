"""Prediction script for fraud detection."""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import pandas as pd
from src.utils import load_model, load_config


def predict_fraud(transaction_data, model_path, scaler_path=None, threshold=0.35):
    """Predict fraud probability for a transaction."""
    model = load_model(model_path)
    
    # Preprocess if needed
    if scaler_path:
        scaler = load_model(scaler_path)
        transaction_data['Scaled_Amount'] = scaler.transform([[transaction_data['Amount']]])[0]
        transaction_data = transaction_data.drop('Amount')
    
    # Predict
    proba = model.predict_proba([transaction_data])[0, 1]
    is_fraud = proba >= threshold
    
    return {
        'fraud_probability': proba,
        'is_fraud': is_fraud,
        'threshold': threshold
    }


def main():
    """Example prediction."""
    config = load_config()
    
    # Example transaction (replace with actual data)
    transaction = {
        'Time': 0,
        'V1': -1.3598071336738,
        'V2': -0.0727811733098497,
        # ... add all features
        'Amount': 149.62
    }
    
    model_path = f"{config['outputs']['models_dir']}best_fraud_model.pkl"
    result = predict_fraud(transaction, model_path, threshold=config['business']['optimal_threshold'])
    
    print(f"Fraud Probability: {result['fraud_probability']:.2%}")
    print(f"Prediction: {'FRAUD' if result['is_fraud'] else 'LEGITIMATE'}")


if __name__ == "__main__":
    main()
