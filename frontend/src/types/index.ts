export interface TransactionData {
  Time: number
  V1: number
  V2: number
  V3: number
  V4: number
  V5: number
  V6: number
  V7: number
  V8: number
  V9: number
  V10: number
  V11: number
  V12: number
  V13: number
  V14: number
  V15: number
  V16: number
  V17: number
  V18: number
  V19: number
  V20: number
  V21: number
  V22: number
  V23: number
  V24: number
  V25: number
  V26: number
  V27: number
  V28: number
  Scaled_Amount: number
}

export interface PredictionResult {
  fraud_probability: number
  is_fraud: boolean
  threshold: number
  confidence: number
}

export interface ApiError {
  detail: string
}
