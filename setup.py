"""Setup script for the project."""

from setuptools import setup, find_packages

setup(
    name="credit-card-fraud-detection",
    version="1.0.0",
    description="Production-ready ML pipeline for credit card fraud detection",
    author="Your Name",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.21.0",
        "pandas>=1.3.0",
        "scikit-learn>=0.24.0",
        "imbalanced-learn>=0.8.0",
        "xgboost>=1.4.0",
        "matplotlib>=3.4.0",
        "seaborn>=0.11.0",
        "pyyaml>=5.4.0",
        "joblib>=1.1.0",
    ],
    python_requires=">=3.8",
)
