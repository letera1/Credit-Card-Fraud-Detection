'use client'

import { useEffect, useState } from 'react'

interface Analytics {
  total_transactions: number
  fraud_detected: number
  fraud_rate: number
  avg_risk_score: number
  high_risk_transactions: number
  alerts_active: number
}

// Simple Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', decimals = 0 }: { value: number, suffix?: string, decimals?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1500 // 1.5s
    const increment = value / (duration / 16) // 60fps
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value])

  return <span>{count.toFixed(decimals)}{suffix}</span>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Mocked data for UI demonstration assuming API might be unreachable in dev
      const mockData = {
        total_transactions: 14592,
        fraud_detected: 248,
        fraud_rate: 1.7,
        avg_risk_score: 12.4,
        high_risk_transactions: 312,
        alerts_active: 5
      }
      setAnalytics(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse h-32">
            <div className="h-3 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-white/5 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {/* Total Inference Count */}
      <div className="glass-panel rounded-2xl p-5 hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
        </div>
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Total Inferences</p>
        <p className="text-3xl font-bold font-mono text-white tracking-tight mt-2">
          <AnimatedCounter value={analytics.total_transactions} />
        </p>
        <div className="mt-3 flex items-center text-[10px] text-green-400 font-mono">
          <span className="mr-1">↑</span> 12% vs last hour
        </div>
      </div>

      {/* Fraud Detected */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-red-500/30 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1 flex justify-between">
            Fraud Detected
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </p>
          <p className="text-3xl font-bold font-mono text-red-400 tracking-tight mt-2">
            <AnimatedCounter value={analytics.fraud_detected} />
          </p>
          <div className="mt-3 flex items-center text-[10px] text-red-400/70 font-mono">
            Score &gt; 80 threshold
          </div>
        </div>
      </div>

      {/* Fraud Rate */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:border-orange-500/30 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest mb-1">Global Fraud Rate</p>
          <p className="text-3xl font-bold font-mono text-white tracking-tight mt-2">
            <AnimatedCounter value={analytics.fraud_rate} suffix="%" decimals={1} />
          </p>
          {/* Mini line chart SVG */}
          <svg className="w-full h-8 mt-2 opacity-50 stroke-orange-500 fill-none" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M0,15 L20,10 L40,12 L60,5 L80,8 L100,2" />
          </svg>
        </div>
      </div>

      {/* Avg Risk Score */}
      <div className="glass-panel rounded-2xl p-5 hover:border-purple-500/30 transition-all relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1">Mean Risk Score</p>
          <p className="text-3xl font-bold font-mono text-white tracking-tight mt-2">
            <AnimatedCounter value={analytics.avg_risk_score} decimals={1} />
          </p>
          <div className="w-full bg-black/50 rounded-full h-1 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-red-500 transition-all duration-1000 ease-out"
              style={{ width: `${analytics.avg_risk_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* High Risk Flags */}
      <div className="glass-panel rounded-2xl p-5 hover:border-yellow-500/30 transition-all">
        <p className="text-[10px] font-mono text-yellow-500/80 uppercase tracking-widest mb-1">High Risk Flags</p>
        <p className="text-3xl font-bold font-mono text-yellow-400 tracking-tight mt-2">
          <AnimatedCounter value={analytics.high_risk_transactions} />
        </p>
        <p className="text-[10px] font-mono text-slate-500 mt-3 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Requires Manual Review
        </p>
      </div>

      {/* System Status */}
      <div className="glass-panel rounded-2xl p-5 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
        <p className="text-[10px] font-mono text-green-400 uppercase tracking-widest mb-1 flex justify-between items-center">
          System Health
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </p>
        <p className="text-2xl font-bold font-mono text-white tracking-tight mt-2 self-center">
          OPTIMAL
        </p>
        <p className="text-[10px] font-mono text-green-400/60 mt-3 inline-flex items-center px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10">
          Ensemble Active
        </p>
      </div>
    </div>
  )
}
