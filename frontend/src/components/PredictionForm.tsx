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
          <button
            type="button"
            onClick={handleRandomize}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-accent text-foreground transition-colors flex items-center space-x-2"
          >
            <span>🎲</span>
            <span>Random</span>
          </button>
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
