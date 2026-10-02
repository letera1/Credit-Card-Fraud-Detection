export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type Decision = 'APPROVE' | 'REVIEW' | 'BLOCK'

export const FEATURE_KEYS = [
  'Time',
  ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`),
  'Scaled_Amount',
] as const

export type TransactionInput = Record<(typeof FEATURE_KEYS)[number], number>

export interface ShapFeature {
  feature: string
  value: number
  shap_value: number
  impact: 'increases' | 'decreases'
}

export interface ShapExplanation {
  base_value: number
  feature_names: string[]
  shap_values: number[]
  top_features: ShapFeature[]
  total_features: number
}

export interface PredictionResult {
  fraud_probability: number
  is_fraud: boolean
  threshold: number
  confidence: number
  risk_score: number
  risk_level: RiskLevel
  transaction_id: string
  timestamp: string
  anomaly_flags: string[]
  recommended_action: string
  shap_explanation: ShapExplanation | null
  model_version: string
}

export interface TransactionRecord extends PredictionResult {
  transaction_data?: Partial<TransactionInput> & { user_id?: string | null; device_id?: string | null }
}

export interface Analytics {
  total_transactions: number
  fraud_detected: number
  fraud_rate: number
  avg_risk_score: number
  high_risk_transactions: number
  alerts_active: number
  recent_transactions: TransactionRecord[]
}

export interface TransactionsResponse {
  total: number
  transactions: TransactionRecord[]
}

export interface Alert {
  alert_id: string
  transaction_id: string
  severity: RiskLevel
  message: string
  timestamp: string
  status: 'active' | 'resolved'
  risk_score: number
  recommended_action: string
  solution: string
  anomaly_flags: string[]
  confidence: number
}

export interface AlertsResponse {
  total: number
  active: number
  alerts: Alert[]
}

export interface Health {
  status: string
  model_loaded: boolean
  ensemble_loaded: boolean
  shap_available: boolean
  transactions_processed: number
  active_alerts: number
  version: string
  features: { total_features: number | null; feature_engineering: boolean; ensemble_models: string[] }
}

export interface ModelMetrics {
  roc_auc: number
  precision: number
  recall: number
  f1: number
}

export interface ModelInfo {
  version: string
  serving_model: string | null
  decision_threshold: number
  feature_names: string[]
  ensemble_members: string[]
  models: Record<string, ModelMetrics>
  dataset: Partial<{
    total_samples: number
    fraud_rate: number
    features: number
    train_samples: number
    test_samples: number
  }>
  feature_engineering: Record<string, string[]>
  training_date: string | null
}

export interface FeatureImportance {
  feature: string
  importance: number
  rank: number
}
