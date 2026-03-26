"""Feature engineering module for fraud detection."""
import numpy as np
import pandas as pd
from typing import Dict, Union


class FeatureEngineer:
    """Advanced feature engineering for credit card fraud detection."""
    
    def __init__(self):
        """Initialize feature engineer."""
        self.v_cols = [f'V{i}' for i in range(1, 29)]
    
    def engineer_features(self, data: Union[Dict, pd.DataFrame]) -> pd.DataFrame:
        """
        Apply advanced feature engineering to transaction data.
        
        Args:
            data: Transaction data as dict or DataFrame
            
        Returns:
            DataFrame with engineered features in correct order
        """
        # Convert to DataFrame if dict
        if isinstance(data, dict):
            df = pd.DataFrame([data])
        else:
            df = data.copy()
        
        # Time-based features
        df['Hour'] = (df['Time'] / 3600) % 24
        df['Day'] = (df['Time'] / 86400).astype(int)
        df['Is_Night'] = ((df['Hour'] >= 22) | (df['Hour'] <= 6)).astype(int)
        df['Is_Weekend'] = (df['Day'] % 7 >= 5).astype(int)
        
        # Amount-based features (use Scaled_Amount as Amount)
        df['Amount'] = df['Scaled_Amount']  # Temporary for calculations
        df['Log_Amount'] = np.log1p(df['Amount'])
        df['Amount_Squared'] = df['Amount'] ** 2
        df['Amount_Sqrt'] = np.sqrt(df['Amount'])
        
        # Statistical features from V columns
        df['V_Mean'] = df[self.v_cols].mean(axis=1)
        df['V_Std'] = df[self.v_cols].std(axis=1)
        df['V_Max'] = df[self.v_cols].max(axis=1)
        df['V_Min'] = df[self.v_cols].min(axis=1)
        df['V_Range'] = df['V_Max'] - df['V_Min']
        
        # Interaction features
        df['V1_V2_Interaction'] = df['V1'] * df['V2']
        df['V1_Amount_Interaction'] = df['V1'] * df['Log_Amount']
        
        # Anomaly score
        df['V_Anomaly_Score'] = np.abs(df[self.v_cols]).sum(axis=1)
        
        # Drop temporary Amount column
        df = df.drop('Amount', axis=1)
        
        # Reorder columns to match training order
        expected_order = [
            'Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
            'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19',
            'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28',
            'Hour', 'Day', 'Is_Night', 'Is_Weekend',
            'Log_Amount', 'Amount_Squared', 'Amount_Sqrt',
            'V_Mean', 'V_Std', 'V_Max', 'V_Min', 'V_Range',
            'V1_V2_Interaction', 'V1_Amount_Interaction', 'V_Anomaly_Score',
            'Scaled_Amount'
        ]
        
        return df[expected_order]
    
    def get_feature_names(self) -> list:
        """Get list of all feature names after engineering."""
        base_features = ['Time'] + self.v_cols + ['Scaled_Amount']
        engineered_features = [
            'Hour', 'Day', 'Is_Night', 'Is_Weekend',
            'Log_Amount', 'Amount_Squared', 'Amount_Sqrt',
            'V_Mean', 'V_Std', 'V_Max', 'V_Min', 'V_Range',
            'V1_V2_Interaction', 'V1_Amount_Interaction',
            'V_Anomaly_Score'
        ]
        return base_features + engineered_features
