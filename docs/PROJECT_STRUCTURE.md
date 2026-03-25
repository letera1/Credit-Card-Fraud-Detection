# Project Structure Guide

## Overview
This document explains the organization of the Credit Card Fraud Detection project.

## Directory Structure

### `/config`
Configuration files for the project.
- `config.yaml`: Main configuration file containing model parameters, paths, and business rules

### `/data`
Data storage directory.
- Place `creditcard.csv` here (not tracked in git)
- Processed data will be stored in `processed/` subdirectory

### `/docs`
Documentation files.
- `NOTEBOOK_GUIDE.md`: Detailed guide for the Jupyter notebook
- `PROJECT_STRUCTURE.md`: This file

### `/models`
Trained model artifacts.
- `.pkl` files for trained models and scalers
- Not tracked in git due to size

### `/notebooks`
Jupyter notebooks for exploratory analysis and experimentation.
- `credit_card_fraud_detection.ipynb`: Main analysis notebook

### `/outputs`
Generated outputs from model training and evaluation.
- `plots/`: Visualization outputs (confusion matrices, ROC curves, etc.)
- `results/`: CSV files with model comparison results

### `/scripts`
Executable Python scripts for training and prediction.
- `train.py`: Complete training pipeline
- `predict.py`: Prediction script for new transactions

### `/src`
Source code modules (reusable components).
- `data_loader.py`: Data loading and validation
- `preprocessing.py`: Data preprocessing and feature engineering
- `sampling.py`: Class imbalance handling strategies
- `models.py`: Model training and evaluation
- `evaluation.py`: Evaluation metrics and visualization
- `utils.py`: Helper functions

### `/tests`
Unit tests for the project.
- `test_preprocessing.py`: Tests for preprocessing module
- Add more test files as needed

## Workflow

1. **Data Preparation**: Place `creditcard.csv` in `/data`
2. **Configuration**: Adjust parameters in `/config/config.yaml`
3. **Training**: Run `python scripts/train.py`
4. **Evaluation**: Check results in `/outputs/results/`
5. **Prediction**: Use `scripts/predict.py` for new transactions

## Key Features

- Modular design for easy maintenance
- Configuration-driven approach
- Separation of concerns (data, models, evaluation)
- Reproducible results with random seeds
- Professional ML project structure
