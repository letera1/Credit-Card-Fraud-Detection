"""FastAPI application for the FraudShield fraud detection service."""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
import asyncio
import json
import os
import joblib

from src.pipeline.inference_pipeline import InferencePipeline
from src.monitoring import setup_logger
from src.features.feature_engineer import FeatureEngineer
from src.api.advanced_endpoints import router as advanced_router

# Setup logging
logger = setup_logger("api")

# Initialize inference pipeline & models state
inference_pipeline = None
best_model = None
ensemble_models = None
feature_names = None
shap_explainer = None
feature_engineer = FeatureEngineer()

# In-memory runtime state: resets on restart and is not shared between worker processes
transaction_history: List[Dict[str, Any]] = []
alert_queue: List[Dict[str, Any]] = []
risk_scores: Dict[str, List[int]] = {}
model_metrics: Dict[str, Any] = {}

DECISION_THRESHOLD = 0.5
TRAINING_REPORT_PATH = "reports/model_report.json"


def _dump_model(model_obj: BaseModel) -> Dict[str, Any]:
    """Helper for Pydantic v1/v2 compatibility."""
    if hasattr(model_obj, "model_dump"):
        return model_obj.model_dump()
    return model_obj.dict()


def _load_training_report() -> Dict[str, Any]:
    """Load the evaluation report written by train_advanced_model.py."""
    try:
        with open(TRAINING_REPORT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError) as e:
        logger.warning(f"Training report unavailable: {e}")
        return {}


_shap_init_failed = False


def _get_shap_explainer():
    """Return the SHAP explainer, creating it on first use if startup did not."""
    global shap_explainer, _shap_init_failed
    if shap_explainer is None and not _shap_init_failed:
        try:
            from src.explainability import ModelExplainer
            shap_explainer = ModelExplainer()
            logger.info("SHAP ModelExplainer loaded successfully")
        except Exception as e:
            _shap_init_failed = True
            logger.warning(f"SHAP Explainer init: {e}")
    return shap_explainer


def _init_models_and_metrics():
    """Load model artifacts and initialize metrics."""
    global inference_pipeline, best_model, ensemble_models, feature_names, shap_explainer, model_metrics
    
    try:
        inference_pipeline = InferencePipeline()
        best_model = inference_pipeline.model
        logger.info("Inference pipeline loaded successfully")
    except Exception as e:
        logger.warning(f"InferencePipeline init: {e}")
        try:
            if os.path.exists("models/best_fraud_model.pkl"):
                best_model = joblib.load("models/best_fraud_model.pkl")
                logger.info("Loaded models/best_fraud_model.pkl directly")
        except Exception as ex:
            logger.error(f"Failed to load model: {ex}")

    try:
        if os.path.exists("models/ensemble_models.pkl"):
            ensemble_models = joblib.load("models/ensemble_models.pkl")
    except Exception as e:
        logger.warning(f"Ensemble models loading: {e}")

    try:
        if os.path.exists("models/feature_names.pkl"):
            feature_names = joblib.load("models/feature_names.pkl")
    except Exception as e:
        logger.warning(f"Feature names loading: {e}")

    _get_shap_explainer()

    model_metrics = _load_training_report()


@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    """Modern lifespan handler for app initialization."""
    _init_models_and_metrics()
    yield


API_DESCRIPTION = """
Real-time credit card fraud scoring with an XGBoost model, SHAP explanations, risk scoring and alerting.

Runtime data (transactions, alerts, risk profiles) is held in memory and resets on restart.
Endpoints tagged **Preview** return static sample data and are not used by the dashboard.
"""

OPENAPI_TAGS = [
    {"name": "Scoring", "description": "Score transactions for fraud risk."},
    {"name": "Monitoring", "description": "Transaction history, aggregates and risk profiles."},
    {"name": "Alerts", "description": "Alerts raised for fraudulent or high-risk transactions."},
    {"name": "Model", "description": "Serving model metadata, evaluation metrics and feature importance."},
    {"name": "Service", "description": "Service metadata and health."},
    {"name": "Operations", "description": "Administrative operations."},
    {"name": "Preview", "description": "Placeholder endpoints that return static sample data."},
]

app = FastAPI(
    title="FraudShield API",
    description=API_DESCRIPTION,
    version="3.0.0",
    lifespan=lifespan,
    openapi_tags=OPENAPI_TAGS,
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,
        "displayRequestDuration": True,
        "docExpansion": "list",
        "filter": True,
    },
)

# CORS configuration
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in cors_origins else cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register advanced endpoints router
app.include_router(advanced_router)


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
    shap_explanation: Optional[Dict[str, Any]] = Field(None, description="SHAP feature importance")
    model_version: str = "3.0.0"


class Alert(BaseModel):
    """Alert model for fraud notifications."""
    alert_id: str
    transaction_id: str
    severity: str
    message: str
    timestamp: str
    status: str = "active"
    risk_score: int = 0
    alert_type: str = "high_amount"
    amount: float = 0.0
    merchant: str = "Unknown"
    location: str = "Unknown"
    solution: str = ""
    recommended_action: str = ""
    anomaly_flags: List[str] = Field(default_factory=list)
    confidence: float = 0.0


class AnalyticsResponse(BaseModel):
    """Analytics dashboard data."""
    total_transactions: int
    fraud_detected: int
    fraud_rate: float
    avg_risk_score: float
    high_risk_transactions: int
    alerts_active: int
    recent_transactions: List[Dict[str, Any]]


@app.get("/", tags=["Service"])
async def root():
    """Service metadata."""
    return {
        "status": "healthy",
        "service": "FraudShield API",
        "version": "3.0.0",
        "features": [
            "XGBoost fraud scoring on 45 engineered features",
            "SHAP explanation for every prediction",
            "Risk scoring, anomaly flags and alerting",
            "Transaction history and analytics",
        ],
        "model_performance": model_metrics.get("models", {}).get("xgboost", {}),
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Scoring"])
async def predict(transaction: Transaction):
    """Predict fraud with real-time risk scoring, feature engineering, and SHAP explainability."""
    global best_model, shap_explainer, transaction_history, alert_queue, risk_scores
    try:
        transaction_data = _dump_model(transaction)
        user_id = transaction_data.pop('user_id', None)
        device_id = transaction_data.pop('device_id', None)
        
        # Apply 45+ feature engineering
        df = feature_engineer.engineer_features(transaction_data)
        
        # Get active model
        if best_model is None:
            if os.path.exists('models/best_fraud_model.pkl'):
                best_model = joblib.load('models/best_fraud_model.pkl')
            else:
                raise RuntimeError("Model artifact models/best_fraud_model.pkl not found")
        
        # Predict probability
        fraud_proba = float(best_model.predict_proba(df)[0][1])
        threshold = DECISION_THRESHOLD
        is_fraud = fraud_proba > threshold
        confidence = float(max(fraud_proba, 1 - fraud_proba))
        
        # Risk scoring
        risk_score = int(fraud_proba * 100)
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
        if transaction.Scaled_Amount > 2.0:
            anomaly_flags.append("Unusually high transaction amount")
        if abs(transaction.V1) > 2.5 or abs(transaction.V2) > 2.5:
            anomaly_flags.append("Abnormal PCA feature values")
        if transaction.Time > 140000:
            anomaly_flags.append("Late-night transaction")
        
        # Recommended action
        if is_fraud:
            if risk_score >= 80:
                recommended_action = "BLOCK - Immediate intervention required"
            else:
                recommended_action = "REVIEW - Manual verification needed"
        else:
            recommended_action = "APPROVE - Transaction appears legitimate"
        
        transaction_id = f"TXN-{datetime.now().strftime('%Y%m%d%H%M%S')}-{len(transaction_history) + 1}"
        
        # SHAP Explainability calculation
        shap_explanation = None
        explainer = _get_shap_explainer()
        if explainer is not None:
            try:
                exp_res = explainer.explain_prediction(df.values, top_n=5)
                top_feats = exp_res.get("top_features", [])
                shap_explanation = {
                    "base_value": exp_res.get("base_value", 0.0),
                    "feature_names": [f["feature"] for f in top_feats],
                    "shap_values": [f["shap_value"] for f in top_feats],
                    "top_features": top_feats,
                    "total_features": exp_res.get("total_features", len(top_feats))
                }
            except Exception as ex:
                logger.warning(f"SHAP explanation computation error: {ex}")

        enhanced_result = {
            "fraud_probability": round(fraud_proba, 4),
            "is_fraud": is_fraud,
            "threshold": threshold,
            "confidence": round(confidence, 4),
            "risk_score": risk_score,
            "risk_level": risk_level,
            "transaction_id": transaction_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "anomaly_flags": anomaly_flags,
            "recommended_action": recommended_action,
            "shap_explanation": shap_explanation,
            "model_version": "3.0.0"
        }
        
        # Save to history
        transaction_record = {
            **enhanced_result,
            "transaction_data": _dump_model(transaction)
        }
        transaction_history.append(transaction_record)
        
        # Trigger alert if fraud or high risk
        if is_fraud or risk_score >= 60:
            if "Late-night transaction" in anomaly_flags:
                alert_type = "location_anomaly"
            elif "Abnormal PCA feature values" in anomaly_flags:
                alert_type = "velocity"
            elif "Unusually high transaction amount" in anomaly_flags:
                alert_type = "high_amount"
            else:
                alert_type = "new_merchant"

            solution = (
                "Immediate block recommended. Contact cardholder to verify identity. Freeze card until manual review is complete."
                if risk_score >= 80 else
                "Hold transaction for manual review. Send verification SMS/email to cardholder. Monitor subsequent transactions."
            )

            alert = {
                "alert_id": f"ALT-{len(alert_queue) + 1}",
                "transaction_id": transaction_id,
                "severity": risk_level,
                "message": f"Fraud detected with {risk_score}% risk score",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": "active",
                "risk_score": risk_score,
                "alert_type": alert_type,
                "amount": round(float(transaction.Scaled_Amount) * 500, 2),
                "merchant": f"Merchant-{abs(hash(transaction_id)) % 9000 + 1000}",
                "location": anomaly_flags[0] if anomaly_flags else "Verified Location",
                "solution": solution,
                "recommended_action": recommended_action,
                "anomaly_flags": anomaly_flags,
                "confidence": round(confidence * 100, 1),
            }
            alert_queue.append(alert)
        
        if user_id:
            if user_id not in risk_scores:
                risk_scores[user_id] = []
            risk_scores[user_id].append(risk_score)
        
        return enhanced_result
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analytics", response_model=AnalyticsResponse, tags=["Monitoring"])
async def get_analytics():
    """Get analytics dashboard overview data."""
    total = len(transaction_history)
    fraud_count = sum(1 for t in transaction_history if t.get('is_fraud', False))
    fraud_rate = (fraud_count / total * 100) if total > 0 else 0.0
    avg_risk = sum(t.get('risk_score', 0) for t in transaction_history) / total if total > 0 else 0.0
    high_risk = sum(1 for t in transaction_history if t.get('risk_score', 0) >= 60)
    recent = transaction_history[-10:] if len(transaction_history) > 10 else transaction_history
    
    return {
        "total_transactions": total,
        "fraud_detected": fraud_count,
        "fraud_rate": round(fraud_rate, 2),
        "avg_risk_score": round(avg_risk, 2),
        "high_risk_transactions": high_risk,
        "alerts_active": len([a for a in alert_queue if a.get('status') == 'active']),
        "recent_transactions": recent
    }


@app.get("/transactions", tags=["Monitoring"])
async def get_transactions(limit: int = 50):
    """Get transaction history with pagination limit."""
    safe_limit = max(1, min(limit, 500))
    return {
        "total": len(transaction_history),
        "transactions": list(reversed(transaction_history[-safe_limit:]))
    }


@app.get("/alerts", tags=["Alerts"])
async def get_alerts():
    """Get active and historical alerts."""
    return {
        "total": len(alert_queue),
        "active": len([a for a in alert_queue if a.get('status') == 'active']),
        "alerts": list(reversed(alert_queue))
    }


@app.post("/alerts/{alert_id}/resolve", tags=["Alerts"])
async def resolve_alert(alert_id: str):
    """Resolve an existing fraud alert."""
    for alert in alert_queue:
        if alert.get('alert_id') == alert_id:
            alert['status'] = 'resolved'
            return {"message": "Alert resolved", "alert": alert}
    raise HTTPException(status_code=404, detail="Alert not found")


@app.get("/risk-profile/{user_id}", tags=["Monitoring"])
async def get_risk_profile(user_id: str):
    """Get user risk profile summary."""
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
    """WebSocket for real-time transaction streaming."""
    await websocket.accept()
    try:
        while True:
            if transaction_history:
                latest = transaction_history[-1]
                await websocket.send_json(latest)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")


@app.get("/health", tags=["Service"])
async def health():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": best_model is not None or inference_pipeline is not None,
        "ensemble_loaded": ensemble_models is not None,
        "shap_available": shap_explainer is not None,
        "transactions_processed": len(transaction_history),
        "active_alerts": len([a for a in alert_queue if a.get('status') == 'active']),
        "version": "3.0.0",
        "features": {
            "total_features": len(feature_names) if feature_names else None,
            "feature_engineering": True,
            "ensemble_models": list(ensemble_models.keys()) if ensemble_models else []
        }
    }


@app.get("/model/info", tags=["Model"])
async def model_info():
    """Serving model metadata and the evaluation report from the last training run."""
    return {
        "version": "3.0.0",
        "serving_model": type(best_model).__name__ if best_model is not None else None,
        "decision_threshold": DECISION_THRESHOLD,
        "feature_names": list(feature_names) if feature_names else [],
        "ensemble_members": list(ensemble_models.keys()) if ensemble_models else [],
        "models": model_metrics.get("models", {}),
        "dataset": model_metrics.get("dataset", {}),
        "feature_engineering": model_metrics.get("feature_engineering", {}),
        "training_date": model_metrics.get("timestamp"),
    }


@app.get("/model/feature-importance", tags=["Model"])
async def model_feature_importance():
    """Get global feature importance from the model."""
    try:
        explainer = _get_shap_explainer()
        importance = explainer.get_feature_importance() if explainer is not None else []
        if importance:
            return {
                "feature_importance": importance,
                "total_features": len(importance)
            }
    except Exception as e:
        logger.warning(f"Feature importance query: {e}")

    return {"feature_importance": [], "total_features": 0}


@app.post("/retrain", tags=["Preview"])
async def retrain_model():
    """Placeholder: retraining is not automated and no model is changed."""
    return {
        "status": "success",
        "message": "Retraining is not automated. Run `python train_advanced_model.py`, then restart the API.",
        "version": "3.0.0",
        "metrics": model_metrics.get("models", {}).get("xgboost", {}),
    }


@app.delete("/reset", tags=["Operations"])
async def reset_data():
    """Clear all in-memory transactions, alerts and risk profiles."""
    global transaction_history, alert_queue, risk_scores
    transaction_history = []
    alert_queue = []
    risk_scores = {}
    return {"message": "All transaction data reset successfully", "version": "3.0.0"}
