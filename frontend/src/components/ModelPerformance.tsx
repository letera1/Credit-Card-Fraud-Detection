'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  roc_auc: number
  total_predictions: number
  fraud_rate: number
  avg_confidence: number
}

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 10000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchMetrics = async () => {
    try {
      // Mock data - replace with real API call
      const mockMetrics = {
        accuracy: 0.9876,
        precision: 0.9543,
        recall: 0.9234,
        f1_score: 0.9387,
        roc_auc: 0.9912,
        total_predictions: 14592,
        fraud_rate: 0.017,
        avg_confidence: 0.9234
      }
      setMetrics(mockMetrics)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.95) return 'text-green-500'
    if (score >= 0.85) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 0.95) return 'bg-green-500/10 border-green-500/20'
    if (score >= 0.85) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Model Performance</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring of ML model metrics and performance
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Accuracy */}
        <div className={`bg-card rounded-xl border p-6 ${getScoreBg(metrics.accuracy)}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <svg className={`w-5 h-5 ${getScoreColor(metrics.accuracy)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(metrics.accuracy)}`}>
            {(metrics.accuracy * 100).toFixed(2)}%
          </p>
          <div className="mt-3 w-full bg-background rounded-full h-2">
            <div
              className={`h-2 rounded-full ${metrics.accuracy >= 0.95 ? 'bg-green-500' : metrics.accuracy >= 0.85 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${metrics.accuracy * 100}%` }}
            />
          </div>
        </div>

        {/* Precision */}
        <div className={`bg-card rounded-xl border p-6 ${getScoreBg(metrics.precision)}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Precision</p>
            <svg className={`w-5 h-5 ${getScoreColor(metrics.precision)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(metrics.precision)}`}>
            {(metrics.precision * 100).toFixed(2)}%
          </p>
          <div className="mt-3 w-full bg-background rounded-full h-2">
            <div
              className={`h-2 rounded-full ${metrics.precision >= 0.95 ? 'bg-green-500' : metrics.precision >= 0.85 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${metrics.precision * 100}%` }}
            />
          </div>
        </div>

        {/* Recall */}
        <div className={`bg-card rounded-xl border p-6 ${getScoreBg(metrics.recall)}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Recall</p>
            <svg className={`w-5 h-5 ${getScoreColor(metrics.recall)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(metrics.recall)}`}>
            {(metrics.recall * 100).toFixed(2)}%
          </p>
          <div className="mt-3 w-full bg-background rounded-full h-2">
            <div
              className={`h-2 rounded-full ${metrics.recall >= 0.95 ? 'bg-green-500' : metrics.recall >= 0.85 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${metrics.recall * 100}%` }}
            />
          </div>
        </div>

        {/* ROC-AUC */}
        <div className={`bg-card rounded-xl border p-6 ${getScoreBg(metrics.roc_auc)}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">ROC-AUC</p>
            <svg className={`w-5 h-5 ${getScoreColor(metrics.roc_auc)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(metrics.roc_auc)}`}>
            {(metrics.roc_auc * 100).toFixed(2)}%
          </p>
          <div className="mt-3 w-full bg-background rounded-full h-2">
            <div
              className={`h-2 rounded-full ${metrics.roc_auc >= 0.95 ? 'bg-green-500' : metrics.roc_auc >= 0.85 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${metrics.roc_auc * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <p className="text-sm text-green-500 mb-2">True Negative</p>
              <p className="text-4xl font-bold text-green-500">14,234</p>
              <p className="text-xs text-muted-foreground mt-2">Correctly identified legitimate</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
              <p className="text-sm text-red-500 mb-2">False Positive</p>
              <p className="text-4xl font-bold text-red-500">112</p>
              <p className="text-xs text-muted-foreground mt-2">Legitimate flagged as fraud</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
              <p className="text-sm text-orange-500 mb-2">False Negative</p>
              <p className="text-4xl font-bold text-orange-500">18</p>
              <p className="text-xs text-muted-foreground mt-2">Fraud missed</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
              <p className="text-sm text-blue-500 mb-2">True Positive</p>
              <p className="text-4xl font-bold text-blue-500">228</p>
              <p className="text-xs text-muted-foreground mt-2">Correctly identified fraud</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Performance Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">F1 Score</p>
                <p className="text-2xl font-bold text-foreground">{(metrics.f1_score * 100).toFixed(2)}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold text-foreground">{(metrics.avg_confidence * 100).toFixed(2)}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-2xl font-bold text-foreground">{metrics.total_predictions.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Performance Trends</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>Chart visualization would go here (integrate with Chart.js or Recharts)</p>
        </div>
      </div>
    </div>
  )
}
