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
      setError(err.response?.data?.detail || 'Failed to get prediction')
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
        <button
          type="button"
          onClick={handleRandomize}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          Generate Random
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Time and Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time (seconds)
            </label>
            <input
              type="number"
              step="any"
              value={formData.Time || ''}
              onChange={(e) => handleInputChange('Time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scaled Amount
            </label>
            <input
              type="number"
              step="any"
              value={formData.Scaled_Amount || ''}
              onChange={(e) => handleInputChange('Scaled_Amount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* PCA Features V1-V28 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PCA Features (V1-V28)
          </label>
          <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => (
              <div key={num}>
                <label className="block text-xs text-gray-600 mb-1">V{num}</label>
                <input
                  type="number"
                  step="any"
                  value={(formData as any)[`V${num}`] || ''}
                  onChange={(e) => handleInputChange(`V${num}`, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Analyzing...
            </span>
          ) : (
            'Analyze Transaction'
          )}
        </button>
      </form>
    </div>
  )
}
