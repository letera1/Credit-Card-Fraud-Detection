import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
import os

# Create models directory
os.makedirs('models', exist_ok=True)

# Create a simple demo model
print("Creating demo fraud detection model...")
model = RandomForestClassifier(n_estimators=10, random_state=42)

# Create dummy training data (30 features: Time, V1-V28, Scaled_Amount)
X_dummy = np.random.randn(100, 30)
y_dummy = np.random.randint(0, 2, 100)

# Train the model
model.fit(X_dummy, y_dummy)

# Save the model
joblib.dump(model, 'models/best_fraud_model.pkl')
print("✓ Demo model created: models/best_fraud_model.pkl")
print("✓ Ready to start the application!")
