"""FastAPI application for fraud detection service."""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List
import logging

from src.pipeline.inference_pipeline import InferencePipeline
from src.monitoring import setup_logger

# Setup logging
logger = setup_logger("api")

# Initialize app
app = FastAPI(
    title="Credit Card Fraud Detection API",
    description="Real-time fraud detection service",
    version="1.0.0",
)

# Initialize inference pipeline
inference_pipeline = None


class Transaction(BaseModel):
    """Transaction data model."""

    Time: float = Field(..., description="Seconds elapsed since first transaction")
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Scaled_Amount: float = Field(..., description="Scaled transaction amount")


class PredictionResponse(BaseModel):
    """Prediction response model."""

    fraud_probability: float
    is_fraud: bool
    threshold: float
    confidence: float


@app.on_event("startup")
async def startup_event():
    """Initialize model on startup."""
    global inference_pipeline
    try:
        inference_pipeline = InferencePipeline()
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Credit Card Fraud Detection API", "version": "1.0.0"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(transaction: Transaction):
    """Predict fraud for a single transaction."""
    try:
        result = inference_pipeline.predict(transaction.dict())
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    """Detailed health check."""
    return {"status": "healthy", "model_loaded": inference_pipeline is not None}
