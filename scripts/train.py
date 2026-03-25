"""Training script for fraud detection models."""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from src.pipeline import TrainingPipeline
from src.monitoring import setup_logger


def main():
    """Main training pipeline."""
    # Setup logging
    logger = setup_logger("training")

    try:
        # Initialize and run pipeline
        pipeline = TrainingPipeline()
        results = pipeline.run()

        logger.info(f"Training completed successfully!")
        logger.info(f"Best model: {results['name']}")
        logger.info(f"ROC-AUC: {results['metrics']['ROC-AUC']:.4f}")

    except Exception as e:
        logger.error(f"Training failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
