'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import RiskScoreCard from '@/components/RiskScoreCard'
import FraudDistributionChart from '@/components/FraudDistributionChart'
import PredictionForm from '@/components/PredictionForm'
import ResultCard from '@/components/ResultCard'
import TransactionHistory from '@/components/TransactionHistory'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { PredictionResult } from '@/types'
import { getAnalytics } from '@/lib/api'

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Welcome to FraudGuard AI</h1>
                  <p className="text-sm text-muted-foreground">Advanced fraud detection powered by machine learning</p>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <AnalyticsDashboard />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Fraud Trend Chart */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Fraud Detection Trend</h3>
                  <select className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Last 24 Hours</option>
                  </select>
                </div>

                {/* Chart Area */}
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 800 250">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y, idx) => (
                      <line
                        key={idx}
                        x1="0"
                        y1={250 - (y * 2.5)}
                        x2="800"
                        y2={250 - (y * 2.5)}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    ))}

                    {/* Area chart - Fraud cases */}
                    <defs>
                      <linearGradient id="fraudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="legitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Legitimate transactions line */}
                    <path
                      d="M 0 200 Q 100 180, 200 190 T 400 170 T 600 180 T 800 160 L 800 250 L 0 250 Z"
                      fill="url(#legitGradient)"
                    />
                    <path
                      d="M 0 200 Q 100 180, 200 190 T 400 170 T 600 180 T 800 160"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />

                    {/* Fraud transactions line */}
                    <path
                      d="M 0 230 Q 100 220, 200 225 T 400 210 T 600 215 T 800 200 L 800 250 L 0 250 Z"
                      fill="url(#fraudGradient)"
                    />
                    <path
                      d="M 0 230 Q 100 220, 200 225 T 400 210 T 600 215 T 800 200"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Legitimate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-muted-foreground">Fraud</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <RiskScoreCard 
                score={analytics?.avg_risk_score || 0} 
                maxScore={100}
                label="Average Risk Score"
              />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transaction History */}
              <div className="lg:col-span-2">
                <TransactionHistory />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Fraud Distribution */}
                <FraudDistributionChart />

                {/* Quick Stats */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Detection Accuracy</span>
                      <span className="text-sm font-bold text-green-500">99.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Response Time</span>
                      <span className="text-sm font-bold text-blue-500">&lt;50ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Model Version</span>
                      <span className="text-sm font-bold text-purple-500">v3.0.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Features Used</span>
                      <span className="text-sm font-bold text-foreground">45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 'analyze':
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Analyze Transaction</h1>
              <p className="text-sm text-muted-foreground">Enter transaction details to detect potential fraud</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PredictionForm
                onResult={setResult}
                loading={loading}
                setLoading={setLoading}
              />
              {result ? (
                <ResultCard result={result} />
              ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold text-foreground mb-2">
                      Ready to Analyze
                    </p>
                    <p className="text-muted-foreground">
                      Enter transaction details or generate random data
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )

      case 'history':
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Transaction History</h1>
              <p className="text-sm text-muted-foreground">View all analyzed transactions and their fraud detection results</p>
            </div>
            <TransactionHistory />
          </>
        )

      case 'analytics':
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time fraud detection metrics and insights</p>
            </div>
            <AnalyticsDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <RiskScoreCard 
                score={analytics?.avg_risk_score || 0} 
                maxScore={100}
                label="Average Risk Score"
              />
              <FraudDistributionChart />
            </div>
          </>
        )

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Select a view from the sidebar</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
