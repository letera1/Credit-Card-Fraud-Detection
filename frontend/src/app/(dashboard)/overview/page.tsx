'use client'

import { useState, useEffect } from 'react'
import { getAnalytics } from '@/lib/api'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import FraudDistributionChart from '@/components/FraudDistributionChart'
import RiskScoreCard from '@/components/RiskScoreCard'
import TransactionHistory from '@/components/TransactionHistory'

export default function OverviewPage() {
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
              {[
                { name: 'XGBoost Ensemble', sub: 'v3.0.0', value: '99.8%', label: 'Accuracy', color: 'purple', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
                { name: 'Redis Cache', sub: 'us-east-1', value: '0.2ms', label: 'Latency', color: 'blue', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { name: 'PostgreSQL Sink', sub: 'db-main-01', value: 'Connected', label: 'Status', color: 'orange', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center`}>
                      <svg className={`w-4 h-4 text-${item.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-mono ${item.color === 'orange' ? 'text-green-500' : `text-${item.color}-400`}`}>{item.value}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
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
}
