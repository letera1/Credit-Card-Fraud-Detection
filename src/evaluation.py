"""Model evaluation and visualization utilities."""

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.metrics import confusion_matrix, roc_curve, precision_recall_curve


class ModelEvaluator:
    """Evaluate and visualize model performance."""

    def __init__(self, output_dir="outputs/plots/"):
        self.output_dir = output_dir

    def plot_confusion_matrix(self, y_true, y_pred, model_name, save=True):
        """Plot confusion matrix."""
        cm = confusion_matrix(y_true, y_pred)

        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=False)
        plt.title(f"{model_name} - Confusion Matrix")
        plt.xlabel("Predicted")
        plt.ylabel("Actual")

        if save:
            plt.savefig(
                f"{self.output_dir}{model_name}_confusion_matrix.png", dpi=150, bbox_inches="tight"
            )
        plt.close()

    def plot_roc_curve(self, y_true, y_pred_proba, model_name, save=True):
        """Plot ROC curve."""
        fpr, tpr, _ = roc_curve(y_true, y_pred_proba)

        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, linewidth=2, label=f"{model_name}")
        plt.plot([0, 1], [0, 1], "k--", linewidth=2, label="Random")
        plt.xlabel("False Positive Rate")
        plt.ylabel("True Positive Rate")
        plt.title(f"{model_name} - ROC Curve")
        plt.legend()
        plt.grid(alpha=0.3)

        if save:
            plt.savefig(
                f"{self.output_dir}{model_name}_roc_curve.png", dpi=150, bbox_inches="tight"
            )
        plt.close()

    def calculate_business_impact(self, y_true, y_pred, avg_fraud_amount=500, cost_fp=10):
        """Calculate business impact metrics."""
        cm = confusion_matrix(y_true, y_pred)
        tn, fp, fn, tp = cm.ravel()

        fraud_prevented = tp * avg_fraud_amount
        fraud_missed = fn * avg_fraud_amount
        false_positive_cost = fp * cost_fp

        net_benefit = fraud_prevented - fraud_missed - false_positive_cost

        return {
            "fraud_prevented": fraud_prevented,
            "fraud_missed": fraud_missed,
            "false_positive_cost": false_positive_cost,
            "net_benefit": net_benefit,
        }
