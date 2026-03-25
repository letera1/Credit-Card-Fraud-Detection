"""Prediction script for fraud detection."""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

import argparse
import pandas as pd
from src.pipeline import InferencePipeline
from src.monitoring import setup_logger


def main():
    """Run predictions."""
    parser = argparse.ArgumentParser(description='Fraud Detection Prediction')
    parser.add_argument('--input', type=str, help='Input CSV file with transactions')
    parser.add_argument('--output', type=str, help='Output CSV file for results')
    parser.add_argument('--model', type=str, help='Path to model file')
    args = parser.parse_args()
    
    # Setup logging
    logger = setup_logger('prediction')
    
    try:
        # Initialize pipeline
        pipeline = InferencePipeline(model_path=args.model)
        
        if args.input:
            # Batch prediction
            logger.info(f"Loading transactions from {args.input}")
            transactions = pd.read_csv(args.input)
            results = pipeline.predict_batch(transactions)
            
            if args.output:
                results.to_csv(args.output, index=False)
                logger.info(f"Results saved to {args.output}")
            else:
                print(results)
        else:
            # Example single prediction
            logger.info("Running example prediction...")
            example_transaction = {
                'Time': 0,
                'V1': -1.3598071336738,
                'V2': -0.0727811733098497,
                'V3': 1.0,
                'V4': 0.5,
                'V5': -0.5,
                'V6': 0.2,
                'V7': -0.3,
                'V8': 0.1,
                'V9': -0.2,
                'V10': 0.4,
                'V11': -0.1,
                'V12': 0.3,
                'V13': -0.4,
                'V14': 0.2,
                'V15': -0.1,
                'V16': 0.5,
                'V17': -0.3,
                'V18': 0.2,
                'V19': -0.1,
                'V20': 0.1,
                'V21': -0.2,
                'V22': 0.3,
                'V23': -0.1,
                'V24': 0.2,
                'V25': -0.3,
                'V26': 0.1,
                'V27': -0.2,
                'V28': 0.1,
                'Scaled_Amount': 0.5
            }
            
            result = pipeline.predict(example_transaction)
            print(f"\nFraud Probability: {result['fraud_probability']:.2%}")
            print(f"Prediction: {'FRAUD' if result['is_fraud'] else 'LEGITIMATE'}")
            print(f"Confidence: {result['confidence']:.2%}")
            
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
