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
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Transaction Details
        </h2>
        <button
          type="button"
          onClick={handleRandomize}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
        >
          🎲 Generate Random
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Time and Amount */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              ⏱️ Time (seconds)
            </label>
            <input
              type="number"
              step="any"
              value={formData.Time || ''}
              onChange={(e) => handleInputChange('Time', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-300 mb-2">
              💰 Scaled Amount
            </label>
            <input
              type="number"
              step="any"
              value={formData.Scaled_Amount || ''}
              onChange={(e) => handleInputChange('Scaled_Amount', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
              required
            />
          </div>
        </div>

        {/* PCA Features V1-V28 */}
        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-3">
            🔢 PCA Features (V1-V28)
          </label>
          <div className="grid grid-cols-4 gap-3 max-h-72 overflow-y-auto p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 custom-scrollbar">
            {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => (
              <div key={num}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">V{num}</label>
                <input
                  type="number"
                  step="any"
                  value={(formData as any)[`V${num}`] || ''}
                  onChange={(e) => handleInputChange(`V${num}`, e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-xl backdrop-blur-sm animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-500 hover:via-pink-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
              🔍 Analyzing Transaction...
            </span>
          ) : (
            '🚀 Analyze Transaction'
          )}
        </button>
      </form>
    </div>
  )
}
