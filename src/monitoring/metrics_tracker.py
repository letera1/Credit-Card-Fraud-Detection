"""Track and persist model metrics."""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any
import pandas as pd


class MetricsTracker:
    """Track model performance metrics over time."""

    def __init__(self, metrics_dir: str = "outputs/metrics"):
        self.metrics_dir = Path(metrics_dir)
        self.metrics_dir.mkdir(parents=True, exist_ok=True)
        self.metrics_file = self.metrics_dir / "metrics_history.json"
        self.metrics_history = self._load_history()

    def _load_history(self) -> list:
        """Load metrics history from file."""
        if self.metrics_file.exists():
            with open(self.metrics_file, "r") as f:
                return json.load(f)
        return []

    def log_metrics(
        self, model_name: str, metrics: Dict[str, float], metadata: Dict[str, Any] = None
    ) -> None:
        """Log metrics for a model run."""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "model_name": model_name,
            "metrics": metrics,
            "metadata": metadata or {},
        }

        self.metrics_history.append(entry)
        self._save_history()

    def _save_history(self) -> None:
        """Save metrics history to file."""
        with open(self.metrics_file, "w") as f:
            json.dump(self.metrics_history, f, indent=2)

    def get_metrics_df(self) -> pd.DataFrame:
        """Get metrics as DataFrame."""
        if not self.metrics_history:
            return pd.DataFrame()

        records = []
        for entry in self.metrics_history:
            record = {
                "timestamp": entry["timestamp"],
                "model_name": entry["model_name"],
                **entry["metrics"],
            }
            records.append(record)

        return pd.DataFrame(records)

    def get_best_model(self, metric: str = "ROC-AUC") -> Dict[str, Any]:
        """Get best performing model based on metric."""
        if not self.metrics_history:
            return None

        best_entry = max(self.metrics_history, key=lambda x: x["metrics"].get(metric, 0))

        return best_entry
