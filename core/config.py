"""Core configuration management for ML Expert Edition."""

import os
from pathlib import Path
from typing import Optional
import yaml


class Settings:
    """Application settings with environment variable support."""
    
    def __init__(self):
        # Project root
        self.PROJECT_ROOT = Path(__file__).parent.parent
        
        # API Settings
        self.API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
        self.API_PORT: int = int(os.getenv("API_PORT", "8000"))
        self.DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
        
        # Model Settings
        self.MODEL_PATH: Path = self.PROJECT_ROOT / "artifacts" / "models" / "best_fraud_model.pkl"
        self.MODEL_THRESHOLD: float = float(os.getenv("MODEL_THRESHOLD", "0.5"))
        self.MODEL_VERSION: str = "3.0.0"
        
        # Feature Engineering
        self.FEATURE_CONFIG: Path = self.PROJECT_ROOT / "configs" / "features.yaml"
        
        # Data Settings
        self.DATA_PATH: Path = self.PROJECT_ROOT / "data" / "raw"
        self.PROCESSED_DATA_PATH: Path = self.PROJECT_ROOT / "data" / "processed"
        
        # Logging
        self.LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
        self.LOG_PATH: Path = self.PROJECT_ROOT / "logs"
        
        # Monitoring
        self.ENABLE_DRIFT_DETECTION: bool = True
        self.DRIFT_THRESHOLD: float = 0.1
        
        # Database (for production)
        self.DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
        
        # Security
        self.API_KEY: Optional[str] = os.getenv("API_KEY")
        self.CORS_ORIGINS: list = os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
        
        # Docker environment detection
        self.IS_DOCKER: bool = os.path.exists("/.dockerenv")
        
    @property
    def model_path_str(self) -> str:
        """Get model path as string."""
        return str(self.MODEL_PATH)
    
    def load_config(self, config_name: str = "default") -> dict:
        """Load configuration from YAML file."""
        config_path = self.PROJECT_ROOT / "configs" / f"{config_name}.yaml"
        
        if config_path.exists():
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        return {}


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get settings instance (for dependency injection)."""
    return settings
