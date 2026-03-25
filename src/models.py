"""Model training and evaluation utilities."""

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score


class ModelTrainer:
    """Train and evaluate fraud detection models."""

    def __init__(self, random_state=42):
        self.random_state = random_state

    def get_random_forest(self, **kwargs):
        """Initialize Random Forest classifier."""
        default_params = {
            "n_estimators": 100,
            "max_depth": 10,
            "min_samples_split": 5,
            "min_samples_leaf": 2,
            "class_weight": "balanced",
            "random_state": self.random_state,
            "n_jobs": -1,
        }
        default_params.update(kwargs)
        return RandomForestClassifier(**default_params)

    def get_xgboost(self, scale_pos_weight=1, **kwargs):
        """Initialize XGBoost classifier."""
        default_params = {
            "n_estimators": 100,
            "max_depth": 6,
            "learning_rate": 0.1,
            "scale_pos_weight": scale_pos_weight,
            "random_state": self.random_state,
            "n_jobs": -1,
            "use_label_encoder": False,
            "eval_metric": "logloss",
        }
        default_params.update(kwargs)
        return XGBClassifier(**default_params)

    def train_and_evaluate(self, model, X_train, y_train, X_test, y_test, model_name):
        """Train model and return evaluation metrics."""
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]

        metrics = {
            "Model": model_name,
            "Precision": precision_score(y_test, y_pred),
            "Recall": recall_score(y_test, y_pred),
            "F1-Score": f1_score(y_test, y_pred),
            "ROC-AUC": roc_auc_score(y_test, y_pred_proba),
        }

        return model, metrics
