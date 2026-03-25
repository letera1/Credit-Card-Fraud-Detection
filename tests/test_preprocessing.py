"""Tests for preprocessing module."""

import pytest
import pandas as pd
import numpy as np
from src.preprocessing import Preprocessor


def test_preprocessor_split():
    """Test data splitting."""
    df = pd.DataFrame({
        'V1': np.random.randn(1000),
        'V2': np.random.randn(1000),
        'Amount': np.random.rand(1000) * 100,
        'Class': np.random.choice([0, 1], 1000, p=[0.998, 0.002])
    })
    
    preprocessor = Preprocessor(test_size=0.2, random_state=42)
    X_train, X_test, y_train, y_test = preprocessor.split_data(df)
    
    assert len(X_train) == 800
    assert len(X_test) == 200
    assert 'Class' not in X_train.columns
