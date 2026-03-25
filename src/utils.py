"""Utility functions for the project."""

import joblib
import yaml
from pathlib import Path


def load_config(config_path="config/config.yaml"):
    """Load configuration from YAML file."""
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
    return config


def save_model(model, filepath):
    """Save trained model to disk."""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, filepath)
    print(f"Model saved to {filepath}")


def load_model(filepath):
    """Load trained model from disk."""
    model = joblib.load(filepath)
    print(f"Model loaded from {filepath}")
    return model
