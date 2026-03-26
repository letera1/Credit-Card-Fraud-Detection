"""FastAPI application for fraud detection service with advanced ML features."""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import logging
import asyncio
import json
import joblib
import numpy as np
import shap

from src.pipeline.inference_pipeline import InferencePipeline
from src.monitoring import setup_logger

# Setup logging
logger = setup_logger("api")

# Initialize app
app = FastAPI(
    title="Credit Card Fraud Detection API - ML Expert Edition",
    description="Advanced fraud detection with Ensemble ML, SHAP explainability, and Feature Engineering",
    version="3.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize inference pipeline
inference_pipeline = None
ensemble_models = None
feature_names = None
shap_explainer = None

# In-memory storage for demo (use database in production)
transaction_history = []
alert_queue = []
risk_scores = {}
model_metrics = {}


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
    user_id: Optional[str] = Field(None, description="User identifier")
    device_id: Optional[str] = Field(None, description="Device fingerprint")


class PredictionResponse(BaseModel):
    """Enhanced prediction response model."""
    fraud_probability: float
    is_fraud: bool
    threshold: float
    confidence: float
    risk_score: int = Field(..., description="Risk score 0-100")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    transaction_id: str
    timestamp: str
    anomaly_flags: List[str] = Field(default_factory=list)
    recommended_action: str


class Alert(BaseModel):
    """Alert model for fraud notifications."""
    alert_id: str
    transaction_id: str
    severity: str
    message: str
    timestamp: str
    status: str = "active"


class AnalyticsResponse(BaseModel):
    """Analytics dashboard data."""
    total_transactions: int
    fraud_detected: int
    fraud_rate: float
    avg_risk_score: float
    high_risk_transactions: int
    alerts_active: int
    recent_transactions: List[Dict]


@app.on_event("startup")
async def startup_event():
    """Initialize model on startup."""
    global inference_pipeline
    try:
        inference_pipeline = InferencePipeline()
        logger.info("Model loaded successfully - Enterprise Edition v2.0")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Credit Card Fraud Detection API - Enterprise Edition",
        "version": "2.0.0",
        "features": [
            "Real-time fraud detection",
            "Anomaly detection",
            "Risk scoring",
            "Transaction monitoring",
            "Alert management",
            "Behavioral analytics"
        ]
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(transaction: Transaction):
    """Predict fraud with advanced risk scoring and anomaly detection."""
    try:
        # Extract only the features needed for prediction (exclude user_id and device_id)
        transaction_data = transaction.dict()
        user_id = transaction_data.pop('user_id', None)
        device_id = transaction_data.pop('device_id', None)
        
        # Get base prediction
        result = inference_pipeline.predict(transaction_data)
        
        # Generate transaction ID
        transaction_id = f"TXN-{datetime.now().strftime('%Y%m%d%H%M%S')}-{len(transaction_history)}"
        
        # Calculate risk score (0-100)
        risk_score = int(result['fraud_probability'] * 100)
        
        # Determine risk level
        if risk_score >= 80:
            risk_level = "CRITICAL"
        elif risk_score >= 60:
            risk_level = "HIGH"
        elif risk_score >= 30:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Anomaly detection flags
        anomaly_flags = []
        if transaction.Scaled_Amount > 2:
            anomaly_flags.append("Unusually high transaction amount")
        if abs(transaction.V1) > 3 or abs(transaction.V2) > 3:
            anomaly_flags.append("Abnormal PCA feature values")
        if transaction.Time > 150000:
            anomaly_flags.append("Late-night transaction")
        
        # Recommended action
        if result['is_fraud']:
            if risk_score >= 80:
                recommended_action = "BLOCK - Immediate intervention required"
            else:
                recommended_action = "REVIEW - Manual verification needed"
        else:
            recommended_action = "APPROVE - Transaction appears legitimate"
        
        # Enhanced response
        enhanced_result = {
            **result,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "transaction_id": transaction_id,
            "timestamp": datetime.now().isoformat(),
            "anomaly_flags": anomaly_flags,
            "recommended_action": recommended_action
        }
        
        # Store transaction history
        transaction_record = {
            **enhanced_result,
            "transaction_data": transaction.dict()
        }
        transaction_history.append(transaction_record)
        
        # Create alert if fraud detected
        if result['is_fraud']:
            alert = {
                "alert_id": f"ALT-{len(alert_queue)}",
                "transaction_id": transaction_id,
                "severity": risk_level,
                "message": f"Fraud detected with {risk_score}% risk score",
                "timestamp": datetime.now().isoformat(),
                "status": "active"
            }
            alert_queue.append(alert)
        
        # Store risk score
        if user_id:
            if user_id not in risk_scores:
                risk_scores[user_id] = []
            risk_scores[user_id].append(risk_score)
        
        return enhanced_result
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Get analytics dashboard data."""
    total = len(transaction_history)
    fraud_count = sum(1 for t in transaction_history if t['is_fraud'])
    fraud_rate = (fraud_count / total * 100) if total > 0 else 0
    
    avg_risk = sum(t['risk_score'] for t in transaction_history) / total if total > 0 else 0
    high_risk = sum(1 for t in transaction_history if t['risk_score'] >= 60)
    
    recent = transaction_history[-10:] if len(transaction_history) > 10 else transaction_history
    
    return {
        "total_transactions": total,
        "fraud_detected": fraud_count,
        "fraud_rate": round(fraud_rate, 2),
        "avg_risk_score": round(avg_risk, 2),
        "high_risk_transactions": high_risk,
        "alerts_active": len([a for a in alert_queue if a['status'] == 'active']),
        "recent_transactions": recent
    }


@app.get("/transactions")
async def get_transactions(limit: int = 50):
    """Get transaction history."""
    return {
        "total": len(transaction_history),
        "transactions": transaction_history[-limit:]
    }


@app.get("/alerts")
async def get_alerts():
    """Get active alerts."""
    return {
        "total": len(alert_queue),
        "active": len([a for a in alert_queue if a['status'] == 'active']),
        "alerts": alert_queue
    }


@app.post("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Resolve an alert."""
    for alert in alert_queue:
        if alert['alert_id'] == alert_id:
            alert['status'] = 'resolved'
            return {"message": "Alert resolved", "alert": alert}
    raise HTTPException(status_code=404, detail="Alert not found")


@app.get("/risk-profile/{user_id}")
async def get_risk_profile(user_id: str):
    """Get user risk profile."""
    if user_id not in risk_scores:
        raise HTTPException(status_code=404, detail="User not found")
    
    scores = risk_scores[user_id]
    return {
        "user_id": user_id,
        "total_transactions": len(scores),
        "avg_risk_score": round(sum(scores) / len(scores), 2),
        "max_risk_score": max(scores),
        "min_risk_score": min(scores),
        "risk_trend": "increasing" if len(scores) > 1 and scores[-1] > scores[0] else "stable"
    }


@app.websocket("/ws/monitor")
async def websocket_monitor(websocket: WebSocket):
    """WebSocket for real-time transaction monitoring."""
    await websocket.accept()
    try:
        while True:
            # Send latest transaction if available
            if transaction_history:
                latest = transaction_history[-1]
                await websocket.send_json(latest)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "model_loaded": inference_pipeline is not None,
        "transactions_processed": len(transaction_history),
        "active_alerts": len([a for a in alert_queue if a['status'] == 'active']),
        "version": "2.0.0"
    }


@app.delete("/reset")
async def reset_data():
    """Reset all data (for demo purposes)."""
    global transaction_history, alert_queue, risk_scores
    transaction_history = []
    alert_queue = []
    risk_scores = {}
    return {"message": "All data reset successfully"}
