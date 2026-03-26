'use client'

import { PredictionResult } from '@/types'
import { formatPercentage } from '@/lib/utils'

interface Props {
  result: PredictionResult
}

export default function ResultCard({ result }: Props) {
  const isFraud = result.is_fraud
  const probability = result.fraud_probability

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Prediction Result</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-powered fraud analysis</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Result */}
        <div
          className={`rounded-xl p-6 border-2 transition-all ${
            isFraud
              ? 'bg-red-500/10 border-red-500/50 dark:bg-red-500/5'
              : 'bg-green-500/10 border-green-500/50 dark:bg-green-500/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
              <p
                className={`text-3xl font-bold ${
                  isFraud ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}
              >
                {isFraud ? '🚨 FRAUD' : '✅ LEGITIMATE'}
              </p>
            </div>
            <div
              className={`p-4 rounded-full ${
                isFraud ? 'bg-red-500/20' : 'bg-green-500/20'
              }`}
            >
              {isFraud ? (
                <svg
                  className="h-12 w-12 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-12 w-12 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          {/* Fraud Probability */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Fraud Probability</span>
              <span className="text-lg font-bold text-foreground">
                {formatPercentage(probability)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${
                  probability > 0.5 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${probability * 100}%` }}
              />
            </div>
          </div>

          {/* Confidence */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Confidence</span>
              <span className="text-lg font-bold text-foreground">
                {formatPercentage(result.confidence)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-blue-500 transition-all duration-700"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Threshold */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <span className="text-sm font-medium text-foreground">Decision Threshold</span>
            <span className="text-lg font-bold text-foreground">
              {formatPercentage(result.threshold)}
            </span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>Recommendation</span>
          </h3>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {isFraud ? (
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Block the transaction immediately</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Contact the cardholder for verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Review recent account activity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Flag for fraud investigation</span>
                </li>
              </ul>
            ) : (
              <p>
                This transaction appears legitimate. The fraud probability is below the
                threshold. You may proceed with normal processing.
              </p>
            )}
          </div>
        </div>

        {/* SHAP Explanation */}
        {(result as any).shap_explanation && (
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center space-x-2">
              <span>🔍</span>
              <span>Model Explanation (SHAP)</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Top features influencing this prediction:
            </p>
            <div className="space-y-2">
              {(result as any).shap_explanation.top_features.map((feature: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-background">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{feature.feature}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.impact} fraud probability
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    feature.shap_value > 0 
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'bg-green-500/10 text-green-600 dark:text-green-400'
                  }`}>
                    {feature.shap_value > 0 ? '+' : ''}{feature.shap_value.toFixed(3)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
