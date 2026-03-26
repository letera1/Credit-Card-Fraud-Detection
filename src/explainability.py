"""
SHAP-based Model Explainability Module
"""
import shap
import numpy as np
import joblib
from typing import Dict, List

class ModelExplainer:
    """Provides SHAP-based explanations for model predictions."""
    
    def __init__(self, model_path: str = 'models/best_fraud_model.pkl'):
        """Initialize SHAP explainer."""
        self.model = joblib.load(model_path)
        self.explainer = shap.TreeExplainer(self.model)
        
        try:
            self.feature_names = joblib.load('models/feature_names.pkl')
        except:
            self.feature_names = None
    
    def explain_prediction(self, X: np.ndarray, top_n: int = 5) -> Dict:
        """
        Generate SHAP explanation for a prediction.
        
        Args:
            X: Feature array (1D or 2D)
            top_n: Number of top features to return
            
        Returns:
            Dictionary with SHAP values and feature importance
        """
        if len(X.shape) == 1:
            X = X.reshape(1, -1)
        
        # Calculate SHAP values
        shap_values = self.explainer.shap_values(X)
        
        # Get base value (expected value)
        base_value = self.explainer.expected_value
        
        # For binary classification, get positive class SHAP values
        if isinstance(shap_values, list):
            shap_values = shap_values[1]  # Fraud class
        
        # Get feature importance
        feature_importance = np.abs(shap_values[0])
        
        # Get top features
        top_indices = np.argsort(feature_importance)[-top_n:][::-1]
        
        top_features = []
        for idx in top_indices:
            feature_name = self.feature_names[idx] if self.feature_names else f"Feature_{idx}"
            top_features.append({
                'feature': feature_name,
                'value': float(X[0, idx]),
                'shap_value': float(shap_values[0, idx]),
                'impact': 'increases' if shap_values[0, idx] > 0 else 'decreases'
            })
        
        return {
            'base_value': float(base_value),
            'prediction_value': float(base_value + np.sum(shap_values[0])),
            'top_features': top_features,
            'total_features': len(feature_importance)
        }
    
    def get_feature_importance(self, X: np.ndarray = None, n_samples: int = 100) -> List[Dict]:
        """
        Get global feature importance.
        
        Args:
            X: Optional feature array for sample-based importance
            n_samples: Number of samples to use
            
        Returns:
            List of features with importance scores
        """
        if X is None:
            # Use model's feature importance if available
            if hasattr(self.model, 'feature_importances_'):
                importance = self.model.feature_importances_
            else:
                return []
        else:
            # Calculate SHAP-based importance
            if len(X) > n_samples:
                X = X[:n_samples]
            
            shap_values = self.explainer.shap_values(X)
            if isinstance(shap_values, list):
                shap_values = shap_values[1]
            
            importance = np.abs(shap_values).mean(axis=0)
        
        # Sort by importance
        indices = np.argsort(importance)[::-1]
        
        features = []
        for idx in indices[:20]:  # Top 20 features
            feature_name = self.feature_names[idx] if self.feature_names else f"Feature_{idx}"
            features.append({
                'feature': feature_name,
                'importance': float(importance[idx]),
                'rank': len(features) + 1
            })
        
        return features
