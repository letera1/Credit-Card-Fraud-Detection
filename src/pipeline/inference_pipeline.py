"""Inference pipeline for predictions."""

import logging
from pathlib import Path
from typing import Dict, Any, Union
import pandas as pd
import numpy as np

from src.config import ConfigManager
from src.utils import load_model

logger = logging.getLogger(__name__)


class InferencePipeline:
    """Handle model inference and predictions."""
    
    def __init__(
        self,
        model_path: str = None,
        config_path: str = "config/config.yaml"
    ):
        self.config = ConfigManager(config_path)
        
        if model_path is None:
            model_path = Path(self.config.get('outputs.models_dir')) / 'best_fraud_model.pkl'
        
        self.model = load_model(model_path)
        self.threshold = self.config.get('business.optimal_threshold', 0.35)
        
    def predict(
        self,
        transaction: Union[Dict[str, float], pd.DataFrame]
    ) -> Dict[str, Any]:
        """Predict fraud probability for a transaction."""
        
        # Convert to DataFrame if dict
        if isinstance(transaction, dict):
            transaction = pd.DataFrame([transaction])
        
        # Validate features
        self._validate_features(transaction)
        
        # Predict
        proba = self.model.predict_proba(transaction)[:, 1]
        prediction = (proba >= self.threshold).astype(int)
        
        result = {
            'fraud_probability': float(proba[0]),
            'is_fraud': bool(prediction[0]),
            'threshold': self.threshold,
            'confidence': float(max(proba[0], 1 - proba[0]))
        }
        
        logger.info(f"Prediction: {'FRAUD' if result['is_fraud'] else 'LEGITIMATE'} "
                   f"(probability: {result['fraud_probability']:.2%})")
        
        return result
    
    def predict_batch(
        self,
        transactions: pd.DataFrame
    ) -> pd.DataFrame:
        """Predict fraud for multiple transactions."""
        
        self._validate_features(transactions)
        
        probas = self.model.predict_proba(transactions)[:, 1]
        predictions = (probas >= self.threshold).astype(int)
        
        results = transactions.copy()
        results['fraud_probability'] = probas
        results['is_fraud'] = predictions
        results['confidence'] = np.maximum(probas, 1 - probas)
        
        logger.info(f"Batch prediction completed: {len(transactions)} transactions")
        logger.info(f"Fraud detected: {predictions.sum()} ({predictions.mean()*100:.2f}%)")
        
        return results
    
    def _validate_features(self, data: pd.DataFrame) -> None:
        """Validate input features."""
        required_features = getattr(self.model, 'feature_names_in_', None)
        
        if required_features is not None:
            missing_features = set(required_features) - set(data.columns)
            if missing_features:
                raise ValueError(f"Missing features: {missing_features}")
