"""Data preprocessing utilities."""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


class Preprocessor:
    """Handle data preprocessing and feature engineering."""

    def __init__(self, test_size=0.2, random_state=42):
        self.test_size = test_size
        self.random_state = random_state
        self.scaler = StandardScaler()

    def split_data(self, df: pd.DataFrame):
        """Split data into train and test sets with stratification."""
        X = df.drop("Class", axis=1)
        y = df["Class"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.test_size, random_state=self.random_state, stratify=y
        )

        print(f"Training set: {X_train.shape[0]:,} samples ({y_train.mean()*100:.2f}% fraud)")
        print(f"Test set: {X_test.shape[0]:,} samples ({y_test.mean()*100:.2f}% fraud)")

        return X_train, X_test, y_train, y_test

    def scale_features(self, X_train: pd.DataFrame, X_test: pd.DataFrame):
        """Scale the Amount feature."""
        X_train_scaled = X_train.copy()
        X_test_scaled = X_test.copy()

        X_train_scaled["Scaled_Amount"] = self.scaler.fit_transform(X_train[["Amount"]])
        X_test_scaled["Scaled_Amount"] = self.scaler.transform(X_test[["Amount"]])

        X_train_scaled = X_train_scaled.drop("Amount", axis=1)
        X_test_scaled = X_test_scaled.drop("Amount", axis=1)

        return X_train_scaled, X_test_scaled
