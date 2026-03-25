"""Tests for data loader module."""

import pytest
import pandas as pd
import numpy as np
from pathlib import Path
from src.data_loader import DataLoader


@pytest.fixture
def sample_data(tmp_path):
    """Create sample data for testing."""
    data = pd.DataFrame({
        'Time': np.random.rand(1000),
        'V1': np.random.randn(1000),
        'V2': np.random.randn(1000),
        'Amount': np.random.rand(1000) * 100,
        'Class': np.random.choice([0, 1], 1000, p=[0.998, 0.002])
    })
    
    file_path = tmp_path / "test_data.csv"
    data.to_csv(file_path, index=False)
    return file_path


def test_data_loader_load(sample_data):
    """Test data loading."""
    loader = DataLoader(sample_data)
    df = loader.load_data()
    
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 1000
    assert 'Class' in df.columns


def test_data_loader_validate(sample_data):
    """Test data validation."""
    loader = DataLoader(sample_data)
    df = loader.load_data()
    validation = loader.validate_data(df)
    
    assert 'shape' in validation
    assert 'fraud_percentage' in validation
    assert validation['shape'] == (1000, 5)


def test_data_loader_file_not_found():
    """Test file not found error."""
    loader = DataLoader("nonexistent.csv")
    
    with pytest.raises(FileNotFoundError):
        loader.load_data()
