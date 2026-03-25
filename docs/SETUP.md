# Setup Guide

## Prerequisites

- Python 3.8 or higher
- pip package manager
- 4GB+ RAM recommended
- ~500MB disk space for dataset

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Credit-Card-Fraud-Detection
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

Or install in development mode:
```bash
pip install -e .
```

### 4. Download Dataset
1. Visit [Kaggle Credit Card Fraud Detection](https://www.kaggle.com/mlg-ulb/creditcardfraud)
2. Download `creditcard.csv`
3. Place it in the `data/` directory

### 5. Verify Installation
```bash
python -c "import pandas, sklearn, xgboost; print('All dependencies installed successfully!')"
```

## Configuration

Edit `config/config.yaml` to customize:
- Data paths
- Model hyperparameters
- Business metrics (fraud amounts, costs)
- Output directories

## Running the Project

### Training
```bash
python scripts/train.py
```

### Jupyter Notebook
```bash
jupyter notebook notebooks/credit_card_fraud_detection.ipynb
```

### Prediction
```bash
python scripts/predict.py
```

## Troubleshooting

### Issue: Module not found
**Solution**: Make sure you're in the project root and have activated the virtual environment.

### Issue: Out of memory
**Solution**: Reduce batch size or use undersampling strategy in config.

### Issue: Dataset not found
**Solution**: Ensure `creditcard.csv` is in the `data/` directory.

## Next Steps

- Read `docs/PROJECT_STRUCTURE.md` to understand the codebase
- Check `docs/NOTEBOOK_GUIDE.md` for notebook details
- Explore `config/config.yaml` for customization options
