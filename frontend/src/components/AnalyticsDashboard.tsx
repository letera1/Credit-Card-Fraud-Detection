'use client'

import { useEffect, useState } from 'react'
import { getAnalytics } from '@/lib/api'

interface Analytics {
  total_transactions: number
  fraud_detected: number
  fraud_rate: number
  avg_risk_score: number
  high_risk_transactions: number
  alerts_active: number
}

const AnimatedCounter = ({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (started) return
    setStarted(true)
    const duration = 1000
    const increment = value / (duration / 16)
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newVal = Math.min(elapsed / duration * value, value)
      setCount(newVal)
      if (newVal >= value) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [value, started])

  return <span>{count.toFixed(decimals)}{suffix}</span>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse h-28">
            <div className="h-3 bg-muted/60 rounded w-1/2 mb-4" />
            <div className="h-8 bg-muted/40 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Inferences',
      value: analytics.total_transactions,
      growth: '+12%',
      color: 'purple',
      icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
    },
    {
      title: 'Fraud Detected',
      value: analytics.fraud_detected,
      subtitle: 'Score > 80 threshold',
      color: 'red',
      pulse: true,
      valueColor: 'red',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    {
      title: 'Global Fraud Rate',
      value: analytics.fraud_rate,
      suffix: '%',
      decimals: 1,
      chart: true,
      color: 'orange',
      valueColor: 'foreground',
    },
    {
      title: 'Mean Risk Score',
      value: analytics.avg_risk_score,
      decimals: 1,
      progressBar: true,
      danger: analytics.avg_risk_score >= 80,
      color: 'purple',
      valueColor: 'foreground',
    },
    {
      title: 'High Risk Flags',
      value: analytics.high_risk_transactions,
      color: 'yellow',
      subtitle: 'Requires Manual Review',
      valueColor: 'yellow',
    },
    {
      title: 'System Health',
      subtitle: 'Ensemble Active',
      health: true,
      color: 'green',
    },
  ];

  const colorMap = {
    purple: { text: 'text-purple-500', text2: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', gradient: 'from-purple-500 to-red-500' },
    red: { text: 'text-red-400', text2: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', gradient: 'from-red-500 to-red-600' },
    orange: { text: 'text-orange-400', text2: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', gradient: 'from-orange-500 to-orange-600' },
    yellow: { text: 'text-yellow-400', text2: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', gradient: 'from-yellow-400 to-yellow-600' },
    green: { text: 'text-green-400', text2: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    blue: { text: 'text-blue-400', text2: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card, idx) => {
        const colors = colorMap[card.color as keyof typeof colorMap];
        const valueColor = colorMap[card.valueColor || card.color as keyof typeof colorMap];
        const showDanger = card.danger && analytics?.avg_risk_score >= 80;
        return (
          <div
            key={idx}
            className={`glass-panel rounded-2xl p-5 relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${card.pulse ? `hover:border-red-500/50 ${showDanger ? 'border-red-500/30' : ''}` : 'hover:border-primary/20 border-border/50'}`}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-14 h-14 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d={card.icon || ''} />
              </svg>
            </div>
            <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              {card.title}
            </p>
            {card.health ? (
              <div className="mt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/25">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-sm font-bold text-green-400">OPTIMAL</span>
                </span>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold tracking-tight text-foreground mt-2 font-mono">
                  <AnimatedCounter
                    value={card.value || 0}
                    suffix={card.suffix || ''}
                    decimals={card.decimals || 0}
                  />
                  {!card.suffix && !card.decimals && card.title !== 'Total Inferences' && card.title !== 'fraud_detected' && card.title !== 'high_risk' && card.title !== 'high_risk_flags' && card.title !== 'High Risk Flags' && card.title !== 'Fraud Detected' && card.title !== 'Total Inferences' && null}
                </p>
                {card.growth && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-mono text-green-500">
                    <span className="text-green-500">&uarr;</span> {card.growth} vs last hour
                  </div>
                )}
                {card.subtitle && (
                  <p className="mt-3 text-xs font-mono text-muted-foreground">{card.subtitle}</p>
                )}
                {card.chart && (
                  <svg className="w-full h-8 mt-2 opacity-30" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path strokeWidth="2" stroke={colors.text === 'text-purple-500' ? '#a855f7' : colors.text === 'text-red-400' ? '#f87171' : '#d97706'} strokeLinecap="round" strokeLinejoin="round" fill="none" d="M0,15 L20,10 L40,12 L60,5 L80,8 L100,2" />
                  </svg>
                )}
                {card.progressBar && (
                  <div className="w-full bg-black/20 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 rounded-full"
                      style={{
                        width: `${Math.min(analytics?.avg_risk_score || 0, 100)}%`,
                        background: analytics?.avg_risk_score >= 80 ? '#ef4444' : analytics?.avg_risk_score >= 50 ? '#eab308' : '#22c55e'
                      }}
                    />
                  </div>
                )}
                {card.pulse && (
                  <div className="absolute top-4 right-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute opacity-75" />
                    <span className="w-2 h-2 rounded-full bg-red-500 relative" />
                  </div>
                )}
                {!card.growth && !card.subtitle && !card.chart && !card.progressBar && !card.pulse && !card.health && (
                  <div className="mt-2 h-6" />
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  )
}
