"""
Model Performance Monitoring Module
"""
import numpy as np
from typing import Dict, List
from datetime import datetime
from collections import deque

class ModelMonitor:
    """Monitors model performance and data drift."""
    
    def __init__(self, window_size: int = 1000):
        """
        Initialize model monitor.
        
        Args:
            window_size: Number of recent predictions to track
        """
        self.window_size = window_size
        self.predictions = deque(maxlen=window_size)
        self.actuals = deque(maxlen=window_size)
        self.probabilities = deque(maxlen=window_size)
        self.timestamps = deque(maxlen=window_size)
        
        # Feature statistics for drift detection
        self.feature_stats = {}
        self.baseline_stats = None
    
    def log_prediction(self, 
                      prediction: int, 
                      probability: float,
                      features: np.ndarray = None,
                      actual: int = None):
        """
        Log a prediction for monitoring.
        
        Args:
            prediction: Model prediction (0 or 1)
            probability: Prediction probability
            features: Feature array
            actual: Actual label (if available)
        """
        self.predictions.append(prediction)
        self.probabilities.append(probability)
        self.timestamps.append(datetime.now())
        
        if actual is not None:
            self.actuals.append(actual)
        
        # Track feature statistics
        if features is not None:
            self._update_feature_stats(features)
    
    def _update_feature_stats(self, features: np.ndarray):
        """Update feature statistics for drift detection."""
        if len(features.shape) == 1:
            features = features.reshape(1, -1)
        
        for i in range(features.shape[1]):
            if i not in self.feature_stats:
                self.feature_stats[i] = deque(maxlen=self.window_size)
            self.feature_stats[i].append(features[0, i])
    
    def set_baseline(self, features: np.ndarray):
        """
        Set baseline statistics for drift detection.
        
        Args:
            features: Baseline feature array
        """
        self.baseline_stats = {
            'mean': np.mean(features, axis=0),
            'std': np.std(features, axis=0)
        }
    
    def detect_drift(self, threshold: float = 2.0) -> Dict:
        """
        Detect data drift using statistical tests.
        
        Args:
            threshold: Z-score threshold for drift detection
            
        Returns:
            Dictionary with drift information
        """
        if not self.baseline_stats or not self.feature_stats:
            return {'drift_detected': False, 'message': 'Insufficient data'}
        
        drifted_features = []
        
        for feature_idx, values in self.feature_stats.items():
            if len(values) < 30:  # Need minimum samples
                continue
            
            current_mean = np.mean(values)
            baseline_mean = self.baseline_stats['mean'][feature_idx]
            baseline_std = self.baseline_stats['std'][feature_idx]
            
            if baseline_std > 0:
                z_score = abs((current_mean - baseline_mean) / baseline_std)
                
                if z_score > threshold:
                    drifted_features.append({
                        'feature_index': feature_idx,
                        'z_score': float(z_score),
                        'baseline_mean': float(baseline_mean),
                        'current_mean': float(current_mean)
                    })
        
        return {
            'drift_detected': len(drifted_features) > 0,
            'drifted_features': drifted_features,
            'total_features_monitored': len(self.feature_stats)
        }
    
    def get_performance_metrics(self) -> Dict:
        """
        Calculate current performance metrics.
        
        Returns:
            Dictionary with performance metrics
        """
        if len(self.predictions) == 0:
            return {'error': 'No predictions logged'}
        
        metrics = {
            'total_predictions': len(self.predictions),
            'fraud_rate': float(np.mean(self.predictions)),
            'avg_probability': float(np.mean(self.probabilities)),
            'confidence_distribution': {
                'low': sum(1 for p in self.probabilities if p < 0.3),
                'medium': sum(1 for p in self.probabilities if 0.3 <= p < 0.7),
                'high': sum(1 for p in self.probabilities if p >= 0.7)
            }
        }
        
        # If we have actuals, calculate accuracy
        if len(self.actuals) > 0:
            correct = sum(1 for p, a in zip(self.predictions, self.actuals) if p == a)
            metrics['accuracy'] = float(correct / len(self.actuals))
            metrics['samples_with_labels'] = len(self.actuals)
        
        return metrics
    
    def get_prediction_distribution(self) -> Dict:
        """Get distribution of predictions over time."""
        if len(self.predictions) == 0:
            return {}
        
        # Group by hour
        hourly_fraud_rate = {}
        for pred, ts in zip(self.predictions, self.timestamps):
            hour = ts.hour
            if hour not in hourly_fraud_rate:
                hourly_fraud_rate[hour] = []
            hourly_fraud_rate[hour].append(pred)
        
        return {
            'hourly_fraud_rate': {
                hour: float(np.mean(preds)) 
                for hour, preds in hourly_fraud_rate.items()
            },
            'total_hours_tracked': len(hourly_fraud_rate)
        }
    
    def get_alert_summary(self) -> Dict:
        """Get summary of alerts that should be raised."""
        alerts = []
        
        # Check for sudden spike in fraud rate
        if len(self.predictions) >= 100:
            recent_fraud_rate = np.mean(list(self.predictions)[-100:])
            overall_fraud_rate = np.mean(self.predictions)
            
            if recent_fraud_rate > overall_fraud_rate * 2:
                alerts.append({
                    'type': 'fraud_spike',
                    'severity': 'high',
                    'message': f'Recent fraud rate ({recent_fraud_rate:.2%}) is 2x higher than average',
                    'timestamp': datetime.now().isoformat()
                })
        
        # Check for low confidence predictions
        low_confidence = sum(1 for p in list(self.probabilities)[-100:] if 0.4 < p < 0.6)
        if low_confidence > 20:
            alerts.append({
                'type': 'low_confidence',
                'severity': 'medium',
                'message': f'{low_confidence} predictions with uncertain confidence',
                'timestamp': datetime.now().isoformat()
            })
        
        return {
            'total_alerts': len(alerts),
            'alerts': alerts
        }
