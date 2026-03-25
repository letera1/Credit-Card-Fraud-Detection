"""Feature engineering and transformation."""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Handle feature engineering and transformations."""

    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_names = None

    def create_time_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create time-based features."""
        df = df.copy()

        # Convert seconds to hours
        df["Hour"] = (df["Time"] / 3600) % 24

        # Time of day categories
        df["Time_of_Day"] = pd.cut(
            df["Hour"],
            bins=[0, 6, 12, 18, 24],
            labels=["Night", "Morning", "Afternoon", "Evening"],
            include_lowest=True,
        )

        # Cyclical encoding for hour
        df["Hour_sin"] = np.sin(2 * np.pi * df["Hour"] / 24)
        df["Hour_cos"] = np.cos(2 * np.pi * df["Hour"] / 24)

        logger.info("Time-based features created")
        return df

    def create_amount_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create amount-based features."""
        df = df.copy()

        # Log transformation
        df["Amount_log"] = np.log1p(df["Amount"])

        # Amount bins
        df["Amount_bin"] = pd.qcut(df["Amount"], q=10, labels=False, duplicates="drop")

        logger.info("Amount-based features created")
        return df

    def scale_features(self, X_train: pd.DataFrame, X_test: pd.DataFrame = None) -> tuple:
        """Scale numerical features."""
        # Identify columns to scale
        cols_to_scale = ["Amount"] if "Amount" in X_train.columns else []

        if not cols_to_scale:
            return X_train, X_test

        X_train_scaled = X_train.copy()
        X_train_scaled["Scaled_Amount"] = self.scaler.fit_transform(X_train[cols_to_scale])
        X_train_scaled = X_train_scaled.drop(cols_to_scale, axis=1)

        if X_test is not None:
            X_test_scaled = X_test.copy()
            X_test_scaled["Scaled_Amount"] = self.scaler.transform(X_test[cols_to_scale])
            X_test_scaled = X_test_scaled.drop(cols_to_scale, axis=1)
            return X_train_scaled, X_test_scaled

        return X_train_scaled, None

    def get_feature_importance(self, model, feature_names: list) -> pd.DataFrame:
        """Extract feature importance from trained model."""
        if hasattr(model, "feature_importances_"):
            importance_df = pd.DataFrame(
                {"feature": feature_names, "importance": model.feature_importances_}
            ).sort_values("importance", ascending=False)

            return importance_df

        logger.warning("Model does not support feature importance")
        return None
