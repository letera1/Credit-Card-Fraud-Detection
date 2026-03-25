"""Tests for pipeline modules."""

import pytest
from unittest.mock import Mock, patch
from src.pipeline import InferencePipeline


def test_inference_pipeline_initialization():
    """Test inference pipeline initialization."""
    with patch('src.pipeline.inference_pipeline.load_model') as mock_load:
        mock_load.return_value = Mock()
        pipeline = InferencePipeline(model_path='test_model.pkl')
        assert pipeline.model is not None
        assert pipeline.threshold > 0


def test_inference_pipeline_predict():
    """Test single prediction."""
    with patch('src.pipeline.inference_pipeline.load_model') as mock_load:
        mock_model = Mock()
        mock_model.predict_proba.return_value = [[0.3, 0.7]]
        mock_load.return_value = mock_model
        
        pipeline = InferencePipeline(model_path='test_model.pkl')
        
        transaction = {
            'V1': 0.1, 'V2': 0.2, 'V3': 0.3,
            'Scaled_Amount': 0.5
        }
        
        result = pipeline.predict(transaction)
        
        assert 'fraud_probability' in result
        assert 'is_fraud' in result
        assert 'confidence' in result
        assert isinstance(result['is_fraud'], bool)
