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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction Result</h2>

      {/* Main Result */}
      <div
        className={`rounded-lg p-6 mb-6 ${
          isFraud
            ? 'bg-danger-50 border-2 border-danger-200'
            : 'bg-success-50 border-2 border-success-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
            <p
              className={`text-3xl font-bold ${
                isFraud ? 'text-danger-700' : 'text-success-700'
              }`}
            >
              {isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE'}
            </p>
          </div>
          <div
            className={`p-4 rounded-full ${
              isFraud ? 'bg-danger-100' : 'bg-success-100'
            }`}
          >
            {isFraud ? (
              <svg
                className="h-12 w-12 text-danger-600"
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
                className="h-12 w-12 text-success-600"
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Fraud Probability</span>
            <span className="text-sm font-bold text-gray-900">
              {formatPercentage(probability)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                probability > 0.5 ? 'bg-danger-500' : 'bg-success-500'
              }`}
              style={{ width: `${probability * 100}%` }}
            />
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Confidence</span>
            <span className="text-sm font-bold text-gray-900">
              {formatPercentage(result.confidence)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Threshold */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Decision Threshold</span>
          <span className="text-sm font-bold text-gray-900">
            {formatPercentage(result.threshold)}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Recommendation</h3>
        <p className="text-sm text-gray-600">
          {isFraud ? (
            <>
              This transaction shows high fraud indicators. Recommended actions:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Block the transaction immediately</li>
                <li>Contact the cardholder for verification</li>
                <li>Review recent account activity</li>
                <li>Flag for fraud investigation</li>
              </ul>
            </>
          ) : (
            <>
              This transaction appears legitimate. The fraud probability is below the
              threshold. You may proceed with normal processing.
            </>
          )}
        </p>
      </div>
    </div>
  )
}
