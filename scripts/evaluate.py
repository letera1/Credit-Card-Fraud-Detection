"""Model evaluation script."""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import argparse
import pandas as pd
from src.utils import load_model
from src.evaluation import ModelEvaluator
from src.monitoring import setup_logger


def main():
    """Evaluate trained model on test data."""
    parser = argparse.ArgumentParser(description='Model Evaluation')
    parser.add_argument('--model', type=str, required=True, help='Path to model file')
    parser.add_argument('--test-data', type=str, required=True, help='Path to test data CSV')
    parser.add_argument('--output-dir', type=str, default='outputs/evaluation', 
                       help='Output directory for evaluation results')
    args = parser.parse_args()
    
    # Setup logging
    logger = setup_logger('evaluation')
    
    try:
        # Load model
        logger.info(f"Loading model from {args.model}")
        model = load_model(args.model)
        
        # Load test data
        logger.info(f"Loading test data from {args.test_data}")
        test_data = pd.read_csv(args.test_data)
        
        # Separate features and target
        X_test = test_data.drop('Class', axis=1)
        y_test = test_data['Class']
        
        # Make predictions
        logger.info("Making predictions...")
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        
        # Evaluate
        logger.info("Evaluating model...")
        evaluator = ModelEvaluator(output_dir=args.output_dir)
        
        # Generate plots
        evaluator.plot_confusion_matrix(y_test, y_pred, 'model')
        evaluator.plot_roc_curve(y_test, y_pred_proba, 'model')
        
        # Calculate business impact
        business_metrics = evaluator.calculate_business_impact(y_test, y_pred)
        
        logger.info("Evaluation Results:")
        logger.info(f"  Net Benefit: ${business_metrics['net_benefit']:,.2f}")
        logger.info(f"  Fraud Prevented: ${business_metrics['fraud_prevented']:,.2f}")
        logger.info(f"  Fraud Missed: ${business_metrics['fraud_missed']:,.2f}")
        
        logger.info(f"Results saved to {args.output_dir}")
        
    except Exception as e:
        logger.error(f"Evaluation failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
