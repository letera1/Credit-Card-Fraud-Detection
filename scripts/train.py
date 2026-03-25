"""Training script for fraud detection models."""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from src.data_loader import DataLoader
from src.preprocessing import Preprocessor
from src.sampling import SamplingStrategy
from src.models import ModelTrainer
from src.utils import load_config, save_model
import pandas as pd


def main():
    """Main training pipeline."""
    # Load configuration
    config = load_config()
    
    # Load data
    print("=" * 60)
    print("LOADING DATA")
    print("=" * 60)
    loader = DataLoader(config['data']['raw_data_path'])
    df = loader.load_data()
    validation = loader.validate_data(df)
    print(f"Fraud percentage: {validation['fraud_percentage']:.2f}%")
    
    # Preprocessing
    print("\n" + "=" * 60)
    print("PREPROCESSING")
    print("=" * 60)
    preprocessor = Preprocessor(
        test_size=config['data']['test_size'],
        random_state=config['data']['random_state']
    )
    X_train, X_test, y_train, y_test = preprocessor.split_data(df)
    X_train_scaled, X_test_scaled = preprocessor.scale_features(X_train, X_test)
    
    # Apply sampling strategies
    print("\n" + "=" * 60)
    print("APPLYING SAMPLING STRATEGIES")
    print("=" * 60)
    sampler = SamplingStrategy(random_state=config['data']['random_state'])
    sampling_strategies = sampler.get_all_strategies(X_train_scaled, y_train)
    
    # Train models
    print("\n" + "=" * 60)
    print("TRAINING MODELS")
    print("=" * 60)
    trainer = ModelTrainer(random_state=config['data']['random_state'])
    results = []
    
    for strategy_name, (X_sample, y_sample) in sampling_strategies.items():
        print(f"\n--- {strategy_name.upper()} ---")
        
        # Random Forest
        rf_model = trainer.get_random_forest(**config['models']['random_forest'])
        rf_trained, rf_metrics = trainer.train_and_evaluate(
            rf_model, X_sample, y_sample, X_test_scaled, y_test,
            f'RF_{strategy_name}'
        )
        results.append(rf_metrics)
        print(f"RF ROC-AUC: {rf_metrics['ROC-AUC']:.4f}")
        
        # XGBoost
        scale_pos_weight = len(y_sample) / y_sample.sum() if y_sample.sum() > 0 else 1
        xgb_model = trainer.get_xgboost(
            scale_pos_weight=scale_pos_weight,
            **config['models']['xgboost']
        )
        xgb_trained, xgb_metrics = trainer.train_and_evaluate(
            xgb_model, X_sample, y_sample, X_test_scaled, y_test,
            f'XGB_{strategy_name}'
        )
        results.append(xgb_metrics)
        print(f"XGB ROC-AUC: {xgb_metrics['ROC-AUC']:.4f}")
    
    # Save results
    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values('ROC-AUC', ascending=False)
    
    print("\n" + "=" * 60)
    print("RESULTS SUMMARY")
    print("=" * 60)
    print(results_df.to_string(index=False))
    
    # Save best model
    best_model_name = results_df.iloc[0]['Model']
    print(f"\nBest model: {best_model_name}")
    
    # Save results to CSV
    Path(config['outputs']['results_dir']).mkdir(parents=True, exist_ok=True)
    results_df.to_csv(f"{config['outputs']['results_dir']}model_comparison.csv", index=False)
    print(f"\nResults saved to {config['outputs']['results_dir']}model_comparison.csv")


if __name__ == "__main__":
    main()
