'use client'

import { useState } from 'react'
import { predictFraud } from '@/lib/api'
import { generateRandomTransaction } from '@/lib/utils'
import { PredictionResult, TransactionData } from '@/types'

interface Props {
  onResult: (result: PredictionResult) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function PredictionForm({ onResult, loading, setLoading }: Props) {
  const [formData, setFormData] = useState<Partial<TransactionData>>({
    Time: 0,
    Scaled_Amount: 0,
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await predictFraud(formData as TransactionData)
      onResult(result)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to get prediction')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRandomize = () => {
    const randomData = generateRandomTransaction()
    setFormData(randomData)
  }

  const loadTestData = (preset: 'high-fraud' | 'medium-risk' | 'legitimate') => {
    const testPresets = {
      'high-fraud': {
        Time: 84000,
        V1: -4.2, V2: 3.8, V3: -3.5, V4: 4.1, V5: -3.9,
        V6: 4.5, V7: -3.2, V8: 3.6, V9: -4.8, V10: 3.4,
        V11: -3.7, V12: 4.2, V13: -3.1, V14: 4.6, V15: -3.8,
        V16: 3.3, V17: -4.1, V18: 3.9, V19: -3.4, V20: 4.0,
        V21: -4.3, V22: 3.5, V23: -3.9, V24: 4.2, V25: -3.6,
        V26: 4.4, V27: -3.8, V28: 3.7,
        Scaled_Amount: 2.5
      },
      'medium-risk': {
        Time: 120000,
        V1: -3.1, V2: 2.8, V3: -2.7, V4: 3.0, V5: -2.9,
        V6: 3.2, V7: -2.6, V8: 2.7, V9: -3.3, V10: 2.8,
        V11: -2.8, V12: 3.1, V13: -2.5, V14: 3.2, V15: -2.9,
        V16: 2.6, V17: -3.0, V18: 2.9, V19: -2.7, V20: 3.0,
        V21: -3.1, V22: 2.7, V23: -2.9, V24: 3.0, V25: -2.8,
        V26: 3.2, V27: -2.9, V28: 2.8,
        Scaled_Amount: 1.8
      },
      'legitimate': {
        Time: 45000,
        V1: 0.3, V2: -0.2, V3: 0.4, V4: -0.3, V5: 0.2,
        V6: -0.4, V7: 0.3, V8: -0.2, V9: 0.3, V10: -0.3,
        V11: 0.2, V12: -0.3, V13: 0.4, V14: -0.2, V15: 0.3,
        V16: -0.3, V17: 0.2, V18: -0.2, V19: 0.3, V20: -0.3,
        V21: 0.2, V22: -0.3, V23: 0.3, V24: -0.2, V25: 0.3,
        V26: -0.3, V27: 0.2, V28: -0.2,
        Scaled_Amount: 0.3
      }
    }
    setFormData(testPresets[preset])
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }))
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Transaction Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter transaction data for analysis</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleRandomize}
              className="px-3 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-accent text-foreground transition-colors flex items-center space-x-2"
            >
              <span>🎲</span>
              <span>Random</span>
            </button>
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Load Test Data</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  type="button"
                  onClick={() => loadTestData('high-fraud')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors rounded-t-lg flex items-center space-x-2"
                >
                  <span className="text-red-500">🔴</span>
                  <span className="text-foreground">High Fraud Risk</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadTestData('medium-risk')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center space-x-2"
                >
                  <span className="text-yellow-500">🟡</span>
                  <span className="text-foreground">Medium Risk</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadTestData('legitimate')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors rounded-b-lg flex items-center space-x-2"
                >
                  <span className="text-green-500">🟢</span>
                  <span className="text-foreground">Legitimate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Time and Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time (seconds)
            </label>
            <input
              type="number"
              step="any"
              value={formData.Time || ''}
              onChange={(e) => handleInputChange('Time', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Scaled Amount
            </label>
            <input
              type="number"
              step="any"
              value={formData.Scaled_Amount || ''}
              onChange={(e) => handleInputChange('Scaled_Amount', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
            />
          </div>
        </div>

        {/* PCA Features V1-V28 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            PCA Features (V1-V28)
          </label>
          <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 rounded-lg border border-border bg-muted/30 scrollbar-hide">
            {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => (
              <div key={num}>
                <label className="block text-xs text-muted-foreground mb-1.5">V{num}</label>
                <input
                  type="number"
                  step="any"
                  value={(formData as any)[`V${num}`] || ''}
                  onChange={(e) => handleInputChange(`V${num}`, e.target.value)}
                  className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Analyze Transaction</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
