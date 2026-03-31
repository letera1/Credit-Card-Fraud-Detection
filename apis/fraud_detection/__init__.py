"""ML Expert Edition - Fraud Detection API.

This module provides the FastAPI application with ML expert architecture.
For backward compatibility, it imports from the existing src/ structure.
"""

# Re-export app from src for ML Expert structure
# In production, migrate src/ code to the new apis/ structure
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Import existing app from src.api
from src.api.app import app

# Update app metadata for ML Expert Edition
app.title = "Credit Card Fraud Detection API - ML Expert Edition"
app.version = "3.0.0-ML-Expert"
app.description = """
## ML Expert Edition

Advanced fraud detection with:
- **Ensemble ML** (XGBoost + LightGBM + Random Forest)
- **Advanced Feature Engineering** (45+ features)
- **SHAP Explainability**
- **Real-time Monitoring**
- **Production-Ready Architecture**

### ML Expert Structure
- `apis/` - API services layer
- `core/` - Core configuration
- `features/` - Feature engineering
- `pipelines/` - ML pipelines
- `monitoring/` - Production monitoring
- `explainability/` - Model explainability
"""
