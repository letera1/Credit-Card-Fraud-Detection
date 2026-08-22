"""Comprehensive tests for FastAPI endpoints in Credit Card Fraud Detection."""

import pytest
from fastapi.testclient import TestClient
from src.api.app import app

client = TestClient(app)

LEGITIMATE_TRANSACTION = {
    "Time": 45000.0,
    "V1": 0.05, "V2": -0.12, "V3": 0.08, "V4": 0.03,
    "V5": -0.04, "V6": 0.09, "V7": -0.06, "V8": 0.02, "V9": -0.05,
    "V10": 0.07, "V11": -0.03, "V12": 0.04, "V13": -0.08, "V14": 0.02,
    "V15": -0.05, "V16": 0.06, "V17": -0.04, "V18": 0.03, "V19": -0.07,
    "V20": 0.04, "V21": -0.03, "V22": 0.05, "V23": -0.04, "V24": 0.02,
    "V25": -0.05, "V26": 0.06, "V27": -0.03, "V28": 0.04,
    "Scaled_Amount": 0.25,
    "user_id": "USER_TEST_001"
}

FRAUD_TRANSACTION = {
    "Time": 165432.0,
    "V1": -5.23, "V2": -5.67, "V3": 3.45, "V4": 4.12,
    "V5": 3.78, "V6": -3.23, "V7": 2.45, "V8": -1.89, "V9": -2.56,
    "V10": -3.45, "V11": -2.89, "V12": -3.12, "V13": 2.67, "V14": -4.89,
    "V15": 4.23, "V16": -2.45, "V17": 3.12, "V18": 3.67, "V19": 4.45,
    "V20": -1.89, "V21": 2.78, "V22": 2.45, "V23": 3.56, "V24": -2.12,
    "V25": 2.34, "V26": -1.89, "V27": -2.45, "V28": 1.67,
    "Scaled_Amount": 6.75,
    "user_id": "USER_FRAUD_002"
}


def test_root_endpoint():
    """Test root GET / returns metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "features" in data
    assert len(data["features"]) > 0


def test_health_endpoint():
    """Test /health endpoint returns health status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data
    assert "version" in data


def test_predict_legitimate_transaction():
    """Test /predict endpoint with benign transaction."""
    response = client.post("/predict", json=LEGITIMATE_TRANSACTION)
    assert response.status_code == 200
    data = response.json()
    
    assert "fraud_probability" in data
    assert "is_fraud" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert "transaction_id" in data
    assert "shap_explanation" in data
    assert data["is_fraud"] is False
    assert data["risk_level"] == "LOW"
    assert data["risk_score"] < 50


def test_predict_fraud_transaction():
    """Test /predict endpoint with anomalous/fraudulent transaction."""
    response = client.post("/predict", json=FRAUD_TRANSACTION)
    assert response.status_code == 200
    data = response.json()
    
    assert "fraud_probability" in data
    assert "is_fraud" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert data["is_fraud"] is True
    assert data["risk_score"] >= 80
    assert data["risk_level"] == "CRITICAL"
    assert len(data["anomaly_flags"]) > 0
    assert "shap_explanation" in data
    assert data["shap_explanation"] is not None


def test_analytics_endpoint():
    """Test /analytics endpoint."""
    response = client.get("/analytics")
    assert response.status_code == 200
    data = response.json()
    
    assert "total_transactions" in data
    assert "fraud_detected" in data
    assert "fraud_rate" in data
    assert "avg_risk_score" in data
    assert "alerts_active" in data
    assert "recent_transactions" in data


def test_transactions_endpoint():
    """Test /transactions endpoint with limit query param."""
    response = client.get("/transactions?limit=10")
    assert response.status_code == 200
    data = response.json()
    
    assert "total" in data
    assert "transactions" in data
    assert isinstance(data["transactions"], list)


def test_alerts_and_resolve_flow():
    """Test /alerts and /alerts/{alert_id}/resolve endpoint."""
    response = client.get("/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "alerts" in data
    
    if data["alerts"]:
        first_alert = data["alerts"][0]
        alert_id = first_alert["alert_id"]
        resolve_res = client.post(f"/alerts/{alert_id}/resolve")
        assert resolve_res.status_code == 200
        assert resolve_res.json()["alert"]["status"] == "resolved"


def test_risk_profile_endpoint():
    """Test /risk-profile/{user_id} endpoint."""
    # First submit transaction with user_id
    client.post("/predict", json=LEGITIMATE_TRANSACTION)
    
    response = client.get(f"/risk-profile/{LEGITIMATE_TRANSACTION['user_id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == LEGITIMATE_TRANSACTION["user_id"]
    assert "total_transactions" in data
    assert "avg_risk_score" in data


def test_model_info_endpoint():
    """Test /model/info endpoint."""
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert "models" in data


def test_model_feature_importance_endpoint():
    """Test /model/feature-importance and /feature-importance endpoints."""
    response1 = client.get("/model/feature-importance")
    assert response1.status_code == 200
    data1 = response1.json()
    assert "feature_importance" in data1
    
    response2 = client.get("/feature-importance")
    assert response2.status_code == 200
    data2 = response2.json()
    assert "features" in data2


def test_batch_predict_and_status():
    """Test /batch-predict and /batch-status endpoints."""
    batch_payload = {
        "transactions": [LEGITIMATE_TRANSACTION, FRAUD_TRANSACTION]
    }
    response = client.post("/batch-predict", json=batch_payload)
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    
    status_res = client.get(f"/batch-status/{data['job_id']}")
    assert status_res.status_code == 200


def test_audit_logs_endpoints():
    """Test /audit-logs and /audit-log endpoints."""
    audit_entry = {
        "timestamp": "2026-08-22T20:00:00Z",
        "user_id": "ADMIN_01",
        "action": "CONFIG_UPDATE",
        "resource": "MODEL_THRESHOLD",
        "details": {"old_value": 0.5, "new_value": 0.45},
        "ip_address": "127.0.0.1"
    }
    post_res = client.post("/audit-log", json=audit_entry)
    assert post_res.status_code == 200
    
    get_res = client.get("/audit-logs")
    assert get_res.status_code == 200
    assert get_res.json()["total"] > 0


def test_api_metrics_endpoint():
    """Test /api-metrics endpoint."""
    response = client.get("/api-metrics")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "uptime" in data


def test_model_comparison_endpoint():
    """Test /model-comparison endpoint."""
    response = client.get("/model-comparison")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) > 0


def test_data_drift_endpoint():
    """Test /data-drift endpoint."""
    response = client.get("/data-drift")
    assert response.status_code == 200
    data = response.json()
    assert "drift_detected" in data


def test_export_report_endpoint():
    """Test /export-report endpoint."""
    response = client.post("/export-report?format=pdf&time_range=24h")
    assert response.status_code == 200
    data = response.json()
    assert "report_id" in data
    assert "download_url" in data


def test_retrain_endpoint():
    """Test /retrain endpoint."""
    response = client.post("/retrain")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "version" in data
