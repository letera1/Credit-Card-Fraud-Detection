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
      // Use real API or fallback to mock
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top row: 6 bento boxes */}
            <AnalyticsDashboard />

            {/* Middle Grid: Main Chart & Risk Score */}
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

            {/* Bottom Grid: History & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white tracking-wide">Inference Stream Logs</h3>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
                    LIVE SYNC
                  </span>
                </div>
                <div className="p-0">
                  <TransactionHistory />
                </div>
              </div>

              <div className="space-y-6 flex flex-col">
                <div className="glass-panel rounded-2xl border border-white/5 p-6 flex-1">
                  <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6">System Subnets</h3>
                  
                  <div className="space-y-5">
                    {/* Item */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">XGBoost Ensemble</p>
                          <p className="text-[10px] font-mono text-slate-500">v3.0.0-rc2</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-green-400">99.8%</p>
                        <p className="text-[10px] font-mono text-slate-500">Accuracy</p>
                      </div>
                    </div>

                    {/* Item */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Redis Cache</p>
                          <p className="text-[10px] font-mono text-slate-500">us-east-1</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-blue-400">0.2ms</p>
                        <p className="text-[10px] font-mono text-slate-500">Latency</p>
                      </div>
                    </div>

                    {/* Item */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">PostgreSQL Sink</p>
                          <p className="text-[10px] font-mono text-slate-500">db-main-01</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-slate-300">Syncing</p>
                        <p className="text-[10px] font-mono text-slate-500">Status</p>
                      </div>
                    </div>

                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-white rounded transition-colors border border-white/10">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold font-mono tracking-tight text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Inference Stream Pipeline</h1>
                <p className="text-xs font-mono text-slate-400">Inject transaction vectors into the live ML pipeline for manual evaluation.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-[600px]">
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
                  <div className="glass-panel rounded-2xl border border-white/10 flex-1 flex items-center justify-center p-12">
                     <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/5 border-2 border-dashed border-blue-500/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                          <svg className="w-10 h-10 text-blue-400 rotate-0 animate-none opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <p className="text-sm font-mono font-semibold text-white mb-2 tracking-widest">AWAITING INGESTION</p>
                        <p className="text-xs font-mono text-slate-500 max-w-[250px] mx-auto">
                          Pipeline is active. Enter vector payload or use auto-generated tensors to begin inference.
                        </p>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      // Other views simply wrapped in animation
      case 'batch': return <div className="animate-in fade-in"><BatchProcessing /></div>
      case 'performance': return <div className="animate-in fade-in"><ModelPerformance /></div>
      case 'history': return <div className="animate-in fade-in"><TransactionHistory /></div>
      case 'analytics': return <div className="animate-in fade-in"><AnalyticsDashboard /></div>
      case 'alerts': return <div className="animate-in fade-in"><FraudAlerts /></div>
      case 'model-info': return <div className="animate-in fade-in"><ModelInfo /></div>
      case 'settings': return <div className="animate-in fade-in"><Settings /></div>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden text-foreground selection:bg-purple-500/30">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col h-screen relative scrollbar-hide">
        <Header />
        {/* Glow orb behind main content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <main className="flex-1 p-8 overflow-y-auto scrollbar-hide relative z-0 pb-20">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
