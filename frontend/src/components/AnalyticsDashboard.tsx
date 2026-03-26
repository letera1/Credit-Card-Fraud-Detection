'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Analytics {
  total_transactions: number
  fraud_detected: number
  fraud_rate: number
  avg_risk_score: number
  high_risk_transactions: number
  alerts_active: number
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 5000) // Refresh every 5s
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/analytics')
      setAnalytics(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
      {/* Total Transactions */}
      <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-3xl font-bold text-foreground">{analytics.total_transactions}</p>
        <p className="text-xs text-muted-foreground mt-1">All time</p>
      </div>

      {/* Fraud Detected */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 hover:border-red-500/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Fraud Detected</p>
          <span className="text-2xl">🚨</span>
        </div>
        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{analytics.fraud_detected}</p>
        <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
          {analytics.fraud_rate.toFixed(1)}% fraud rate
        </p>
      </div>

      {/* Avg Risk Score */}
      <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-3xl font-bold text-foreground">{analytics.avg_risk_score.toFixed(1)}</p>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
            style={{ width: `${analytics.avg_risk_score}%` }}
          />
        </div>
      </div>

      {/* High Risk */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6 hover:border-orange-500/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">High Risk</p>
          <span className="text-2xl">⚡</span>
        </div>
        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          {analytics.high_risk_transactions}
        </p>
        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">Risk ≥ 60%</p>
      </div>

      {/* Active Alerts */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 hover:border-purple-500/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Alerts</p>
          <span className="text-2xl">🔔</span>
        </div>
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          {analytics.alerts_active}
        </p>
        <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Needs review</p>
      </div>

      {/* System Status */}
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 hover:border-green-500/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">System Status</p>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">ONLINE</p>
        <div className="flex items-center space-x-1 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-green-600/70 dark:text-green-400/70">Real-time monitoring</p>
        </div>
      </div>
    </div>
  )
}
