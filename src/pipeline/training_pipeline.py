"""End-to-end training pipeline."""

import logging
from pathlib import Path
from typing import Dict, Any, Tuple
import pandas as pd

from src.config import ConfigManager
from src.data_loader import DataLoader
from src.preprocessing import Preprocessor
from src.sampling import SamplingStrategy
from src.models import ModelTrainer
from src.evaluation import ModelEvaluator
from src.monitoring import MetricsTracker
from src.utils import save_model

logger = logging.getLogger(__name__)


class TrainingPipeline:
    """Orchestrate the complete training pipeline."""

    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = ConfigManager(config_path)
        self.metrics_tracker = MetricsTracker(
            self.config.get("outputs.metrics_dir", "outputs/metrics")
        )
        self.results = []

    def run(self) -> Dict[str, Any]:
        """Execute the complete training pipeline."""
        logger.info("=" * 60)
        logger.info("STARTING TRAINING PIPELINE")
        logger.info("=" * 60)

        # Load data
        df = self._load_data()

        # Preprocess
        X_train, X_test, y_train, y_test = self._preprocess_data(df)

        # Apply sampling strategies
        sampling_strategies = self._apply_sampling(X_train, y_train)

        # Train models
        trained_models = self._train_models(sampling_strategies, X_test, y_test)

        # Evaluate and select best model
        best_model_info = self._evaluate_and_select_best(trained_models, X_test, y_test)

        # Save artifacts
        self._save_artifacts(best_model_info)

        logger.info("=" * 60)
        logger.info("TRAINING PIPELINE COMPLETED")
        logger.info("=" * 60)

        return best_model_info

    def _load_data(self) -> pd.DataFrame:
        """Load and validate data."""
        logger.info("Loading data...")
        loader = DataLoader(self.config.get("data.raw_data_path"))
        df = loader.load_data()
        validation = loader.validate_data(df)
        logger.info(f"Fraud percentage: {validation['fraud_percentage']:.2f}%")
        return df

    def _preprocess_data(self, df: pd.DataFrame) -> Tuple:
        """Preprocess data."""
        logger.info("Preprocessing data...")
        preprocessor = Preprocessor(
            test_size=self.config.get("data.test_size"),
            random_state=self.config.get("data.random_state"),
        )
        X_train, X_test, y_train, y_test = preprocessor.split_data(df)
        X_train_scaled, X_test_scaled = preprocessor.scale_features(X_train, X_test)
        return X_train_scaled, X_test_scaled, y_train, y_test

    def _apply_sampling(self, X_train, y_train) -> Dict:
        """Apply sampling strategies."""
        logger.info("Applying sampling strategies...")
        sampler = SamplingStrategy(random_state=self.config.get("data.random_state"))
        return sampler.get_all_strategies(X_train, y_train)

    def _train_models(self, sampling_strategies: Dict, X_test, y_test) -> Dict:
        """Train models with different strategies."""
        logger.info("Training models...")
        trainer = ModelTrainer(random_state=self.config.get("data.random_state"))
        trained_models = {}

        for strategy_name, (X_sample, y_sample) in sampling_strategies.items():
            logger.info(f"Training with {strategy_name}...")

            # Random Forest
            rf_model = trainer.get_random_forest(**self.config.get("models.random_forest", {}))
            rf_trained, rf_metrics = trainer.train_and_evaluate(
                rf_model, X_sample, y_sample, X_test, y_test, f"RF_{strategy_name}"
            )
            trained_models[f"RF_{strategy_name}"] = {"model": rf_trained, "metrics": rf_metrics}
            self.metrics_tracker.log_metrics(
                f"RF_{strategy_name}", rf_metrics, {"sampling": strategy_name}
            )

            # XGBoost
            scale_pos_weight = len(y_sample) / y_sample.sum() if y_sample.sum() > 0 else 1
            xgb_model = trainer.get_xgboost(
                scale_pos_weight=scale_pos_weight, **self.config.get("models.xgboost", {})
            )
            xgb_trained, xgb_metrics = trainer.train_and_evaluate(
                xgb_model, X_sample, y_sample, X_test, y_test, f"XGB_{strategy_name}"
            )
            trained_models[f"XGB_{strategy_name}"] = {"model": xgb_trained, "metrics": xgb_metrics}
            self.metrics_tracker.log_metrics(
                f"XGB_{strategy_name}", xgb_metrics, {"sampling": strategy_name}
            )

        return trained_models

    def _evaluate_and_select_best(self, trained_models: Dict, X_test, y_test) -> Dict:
        """Evaluate models and select the best one."""
        logger.info("Evaluating models...")

        results_df = pd.DataFrame([info["metrics"] for info in trained_models.values()])
        results_df = results_df.sort_values("ROC-AUC", ascending=False)

        # Save comparison
        results_path = Path(self.config.get("outputs.results_dir"))
        results_path.mkdir(parents=True, exist_ok=True)
        results_df.to_csv(results_path / "model_comparison.csv", index=False)

        # Get best model
        best_model_name = results_df.iloc[0]["Model"]
        best_model_info = trained_models[best_model_name]

        logger.info(f"Best model: {best_model_name}")
        logger.info(f"ROC-AUC: {best_model_info['metrics']['ROC-AUC']:.4f}")

        return {
            "name": best_model_name,
            "model": best_model_info["model"],
            "metrics": best_model_info["metrics"],
            "all_results": results_df,
        }

    def _save_artifacts(self, best_model_info: Dict) -> None:
        """Save model artifacts."""
        logger.info("Saving artifacts...")
        models_dir = Path(self.config.get("outputs.models_dir"))

        save_model(best_model_info["model"], models_dir / "best_fraud_model.pkl")

        logger.info("Artifacts saved successfully")
