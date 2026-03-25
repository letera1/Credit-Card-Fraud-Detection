"""Tests for models module."""

import pytest
import numpy as np
import pandas as pd
from src.models import ModelTrainer


@pytest.fixture
def sample_train_data():
    """Create sample training data."""
    np.random.seed(42)
    X_train = pd.DataFrame(np.random.randn(1000, 10))
    y_train = pd.Series(np.random.choice([0, 1], 1000, p=[0.9, 0.1]))
    return X_train, y_train


@pytest.fixture
def sample_test_data():
    """Create sample test data."""
    np.random.seed(43)
    X_test = pd.DataFrame(np.random.randn(200, 10))
    y_test = pd.Series(np.random.choice([0, 1], 200, p=[0.9, 0.1]))
    return X_test, y_test


def test_model_trainer_random_forest(sample_train_data, sample_test_data):
    """Test Random Forest training."""
    X_train, y_train = sample_train_data
    X_test, y_test = sample_test_data
    
    trainer = ModelTrainer(random_state=42)
    model = trainer.get_random_forest(n_estimators=10)
    
    trained_model, metrics = trainer.train_and_evaluate(
        model, X_train, y_train, X_test, y_test, 'RF_test'
    )
    
    assert 'Precision' in metrics
    assert 'Recall' in metrics
    assert 'ROC-AUC' in metrics
    assert 0 <= metrics['ROC-AUC'] <= 1


def test_model_trainer_xgboost(sample_train_data, sample_test_data):
    """Test XGBoost training."""
    X_train, y_train = sample_train_data
    X_test, y_test = sample_test_data
    
    trainer = ModelTrainer(random_state=42)
    model = trainer.get_xgboost(n_estimators=10)
    
    trained_model, metrics = trainer.train_and_evaluate(
        model, X_train, y_train, X_test, y_test, 'XGB_test'
    )
    
    assert 'F1-Score' in metrics
    assert metrics['Model'] == 'XGB_test'
