"""Unit tests for ML components: FeatureEngineer, InferencePipeline, and ModelExplainer."""

import pytest
import numpy as np
import pandas as pd
from src.features.feature_engineer import FeatureEngineer
from src.pipeline.inference_pipeline import InferencePipeline
from src.explainability import ModelExplainer

SAMPLE_TRANSACTION = {
    "Time": 45000.0,
    "V1": 0.05, "V2": -0.12, "V3": 0.08, "V4": 0.03,
    "V5": -0.04, "V6": 0.09, "V7": -0.06, "V8": 0.02, "V9": -0.05,
    "V10": 0.07, "V11": -0.03, "V12": 0.04, "V13": -0.08, "V14": 0.02,
    "V15": -0.05, "V16": 0.06, "V17": -0.04, "V18": 0.03, "V19": -0.07,
    "V20": 0.04, "V21": -0.03, "V22": 0.05, "V23": -0.04, "V24": 0.02,
    "V25": -0.05, "V26": 0.06, "V27": -0.03, "V28": 0.04,
    "Scaled_Amount": 0.25
}


def test_feature_engineering_output_shape():
    """Test that FeatureEngineer creates all 45 features."""
    fe = FeatureEngineer()
    df = fe.engineer_features(SAMPLE_TRANSACTION)
    assert isinstance(df, pd.DataFrame)
    assert df.shape[1] == 45
    assert "V_Mean" in df.columns
    assert "V_Std" in df.columns
    assert "V_Anomaly_Score" in df.columns


def test_inference_pipeline_single_prediction():
    """Test InferencePipeline predict method."""
    fe = FeatureEngineer()
    df = fe.engineer_features(SAMPLE_TRANSACTION)
    
    pipeline = InferencePipeline()
    result = pipeline.predict(df)
    
    assert "fraud_probability" in result
    assert "is_fraud" in result
    assert "threshold" in result
    assert "confidence" in result
    assert 0.0 <= result["fraud_probability"] <= 1.0


def test_model_explainer_shap():
    """Test ModelExplainer SHAP values generation."""
    fe = FeatureEngineer()
    df = fe.engineer_features(SAMPLE_TRANSACTION)
    
    explainer = ModelExplainer()
    explanation = explainer.explain_prediction(df.values, top_n=5)
    
    assert "base_value" in explanation
    assert "top_features" in explanation
    assert len(explanation["top_features"]) == 5
    assert "total_features" in explanation
    assert explanation["total_features"] == 45


def test_model_explainer_feature_importance():
    """Test ModelExplainer get_feature_importance method."""
    explainer = ModelExplainer()
    importance = explainer.get_feature_importance()
    assert isinstance(importance, list)
    assert len(importance) > 0
    assert "feature" in importance[0]
    assert "importance" in importance[0]
