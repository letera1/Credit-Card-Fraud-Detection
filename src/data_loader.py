"""Data loading and validation utilities."""

import pandas as pd
import numpy as np
from pathlib import Path


class DataLoader:
    """Handle data loading and basic validation."""

    def __init__(self, data_path: str):
        self.data_path = Path(data_path)

    def load_data(self) -> pd.DataFrame:
        """Load credit card fraud dataset."""
        if not self.data_path.exists():
            raise FileNotFoundError(f"Data file not found: {self.data_path}")

        df = pd.read_csv(self.data_path)
        print(f"Loaded data: {df.shape[0]:,} rows × {df.shape[1]} columns")
        return df

    def validate_data(self, df: pd.DataFrame) -> dict:
        """Validate dataset and return summary statistics."""
        validation_report = {
            "shape": df.shape,
            "missing_values": df.isnull().sum().sum(),
            "class_distribution": df["Class"].value_counts().to_dict(),
            "fraud_percentage": (df["Class"].sum() / len(df)) * 100,
        }
        return validation_report
