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
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
        🎯 Prediction Result
      </h2>

      {/* Main Result */}
      <div
        className={`rounded-2xl p-8 mb-8 backdrop-blur-sm border-2 transition-all duration-500 ${
          isFraud
            ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20'
            : 'bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Status</p>
            <p
              className={`text-4xl font-black ${
                isFraud ? 'text-red-400' : 'text-green-400'
              } drop-shadow-lg`}
            >
              {isFraud ? '🚨 FRAUD DETECTED' : '✅ LEGITIMATE'}
            </p>
          </div>
          <div
            className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-110 ${
              isFraud ? 'bg-red-500/20 shadow-lg shadow-red-500/30' : 'bg-green-500/20 shadow-lg shadow-green-500/30'
            }`}
          >
            {isFraud ? (
              <svg
                className="h-16 w-16 text-red-400"
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
                className="h-16 w-16 text-green-400"
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
      <div className="space-y-6">
        {/* Fraud Probability */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-purple-300">📊 Fraud Probability</span>
            <span className="text-lg font-black text-white">
              {formatPercentage(probability)}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-4 rounded-full transition-all duration-700 shadow-lg ${
                probability > 0.5 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/50' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/50'
              }`}
              style={{ width: `${probability * 100}%` }}
            />
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-purple-300">💪 Confidence</span>
            <span className="text-lg font-black text-white">
              {formatPercentage(result.confidence)}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 shadow-lg shadow-purple-500/50"
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Threshold */}
        <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
          <span className="text-sm font-semibold text-purple-300">⚖️ Decision Threshold</span>
          <span className="text-lg font-black text-white">
            {formatPercentage(result.threshold)}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
          💡 Recommendation
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {isFraud ? (
            <>
              This transaction shows high fraud indicators. Recommended actions:
              <ul className="list-none mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">🛑</span>
                  <span>Block the transaction immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">📞</span>
                  <span>Contact the cardholder for verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">🔍</span>
                  <span>Review recent account activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">🚩</span>
                  <span>Flag for fraud investigation</span>
                </li>
              </ul>
            </>
          ) : (
            <span className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                This transaction appears legitimate. The fraud probability is below the
                threshold. You may proceed with normal processing.
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
