"""Sampling strategies for handling class imbalance."""

from imblearn.under_sampling import RandomUnderSampler
from imblearn.over_sampling import RandomOverSampler, SMOTE


class SamplingStrategy:
    """Apply various sampling techniques to handle class imbalance."""
    
    def __init__(self, random_state=42):
        self.random_state = random_state
        
    def apply_undersampling(self, X, y):
        """Apply random undersampling."""
        rus = RandomUnderSampler(random_state=self.random_state)
        X_resampled, y_resampled = rus.fit_resample(X, y)
        print(f"Undersampling: {len(y)} → {len(y_resampled)} samples")
        return X_resampled, y_resampled
    
    def apply_oversampling(self, X, y):
        """Apply random oversampling."""
        ros = RandomOverSampler(random_state=self.random_state)
        X_resampled, y_resampled = ros.fit_resample(X, y)
        print(f"Oversampling: {len(y)} → {len(y_resampled)} samples")
        return X_resampled, y_resampled
    
    def apply_smote(self, X, y, k_neighbors=5):
        """Apply SMOTE (Synthetic Minority Over-sampling Technique)."""
        smote = SMOTE(random_state=self.random_state, k_neighbors=k_neighbors)
        X_resampled, y_resampled = smote.fit_resample(X, y)
        print(f"SMOTE: {len(y)} → {len(y_resampled)} samples")
        return X_resampled, y_resampled
    
    def get_all_strategies(self, X, y):
        """Return all sampling strategies."""
        return {
            'original': (X, y),
            'undersampling': self.apply_undersampling(X, y),
            'oversampling': self.apply_oversampling(X, y),
            'smote': self.apply_smote(X, y)
        }
