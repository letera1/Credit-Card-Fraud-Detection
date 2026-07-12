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
import FraudAlerts from '@/components/FraudAlerts'
import ModelInfo from '@/components/ModelInfo'
import Settings from '@/components/Settings'
import BatchProcessing from '@/components/BatchProcessing'
import ModelPerformance from '@/components/ModelPerformance'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import { PredictionResult } from '@/types'
import { getAnalytics } from '@/lib/api'

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('overview')
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics().catch(() => ({ avg_risk_score: 12.4 }))
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <AnalyticsDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              <div className="lg:col-span-2 xl:col-span-3">
                <FraudDistributionChart />
              </div>
              <div className="lg:col-span-1 xl:col-span-1">
                <RiskScoreCard
                  score={analytics?.avg_risk_score || 12.4}
                  maxScore={100}
                  label="Global Risk Index"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel rounded-2xl border-border/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-foreground tracking-wide">Inference Stream Logs</h3>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />
                    LIVE SYNC
                  </span>
                </div>
                <div className="p-0">
                  <TransactionHistory />
                </div>
              </div>
              <div className="space-y-6 flex flex-col">
                <div className="glass-panel rounded-2xl border-border/50 p-6 flex-1">
                  <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-6">System Subnets</h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">XGBoost Ensemble</p>
                          <p className="text-[10px] font-mono text-muted-foreground">v3.0.0</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-green-500">99.8%</p>
                        <p className="text-[10px] font-mono text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Redis Cache</p>
                          <p className="text-[10px] font-mono text-muted-foreground">us-east-1</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-blue-400">0.2ms</p>
                        <p className="text-[10px] font-mono text-muted-foreground">Latency</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">PostgreSQL Sink</p>
                          <p className="text-[10px] font-mono text-muted-foreground">db-main-01</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-green-500">Connected</p>
                        <p className="text-[10px] font-mono text-muted-foreground">Status</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <button className="w-full py-2.5 bg-muted/30 hover:bg-muted/50 text-xs font-mono text-foreground rounded-lg transition-all border border-border/50 hover:border-primary/30">
                      VIEW FULL TOPOLOGY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'analyze':
        return (
          <div className="animate-in slide-in-from-bottom-4 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Inference Stream Pipeline</h1>
                <p className="text-sm text-muted-foreground">Submit transaction data for real-time fraud evaluation.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
              <div className="h-full">
                <PredictionForm
                  onResult={setResult}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
              <div className="h-full flex flex-col">
                {result ? (
                  <ResultCard result={result} />
                ) : (
                  <div className="glass-panel rounded-2xl border-border/50 flex-1 flex items-center justify-center p-12">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center animate-spin-slow">
                        <svg className="w-10 h-10 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <p className="text-sm font-mono font-semibold text-foreground mb-2 tracking-widest">AWAITING INGESTION</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Submit transaction data via the form on the left to see the AI-powered analysis and fraud detection results.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'batch': return <div className="animate-in"><BatchProcessing /></div>
      case 'performance': return <div className="animate-in"><ModelPerformance /></div>
      case 'history': return <div className="animate-in"><TransactionHistory /></div>
      case 'analytics': return <div className="animate-in"><AdvancedAnalytics /></div>
      case 'alerts': return <div className="animate-in"><FraudAlerts /></div>
      case 'model-info': return <div className="animate-in"><ModelInfo /></div>
      case 'settings': return <div className="animate-in"><Settings /></div>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden text-foreground selection:bg-purple-500/30">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <Header />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <main className="flex-1 overflow-y-auto scrollbar-hide z-0">
          <div className="px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
