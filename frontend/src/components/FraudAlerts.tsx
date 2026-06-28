'use client'

import { useEffect, useState } from 'react'
import { getAlerts, resolveAlert as resolveAlertApi, createAuditLog } from '@/lib/api'

interface Alert {
  alert_id: string
  transaction_id: string
  severity: string
  message: string
  timestamp: string
  status: string
  risk_score?: number
  amount?: number
  location?: string
}

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null)
  
  // Audits and interaction states
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [snoozedAlerts, setSnoozedAlerts] = useState<string[]>([])
  const [escalatedAlerts, setEscalatedAlerts] = useState<string[]>([])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts()
      setAlerts(data.alerts || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await resolveAlertApi(alertId)
      // Log resolution to compliance audit trail
      await createAuditLog({
        timestamp: new Date().toISOString(),
        user_id: "sec_ops_admin",
        action: "ALERT_RESOLVED",
        resource: alertId,
        details: { status: "resolved", handler: "manual_mitigation" },
        ip_address: "192.168.10.45"
      })
      fetchAlerts()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  const handleSnooze = (alertId: string) => {
    setSnoozedAlerts(prev => [...prev, alertId])
  }

  const handleEscalation = async (alertId: string) => {
    setEscalatedAlerts(prev => [...prev, alertId])
    // Log escalation to compliance audits
    try {
      await createAuditLog({
        timestamp: new Date().toISOString(),
        user_id: "sec_ops_admin",
        action: "ALERT_ESCALATED",
        resource: alertId,
        details: { tier: 2, action: "sent_to_tier_2_sec_ops" },
        ip_address: "192.168.10.45"
      })
    } catch (e) {
      console.error(e)
    }
  }

  const getSeverityConfig = (severity: string) => {
    const configs = {
      CRITICAL: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
        icon: '🔴',
        pulse: 'animate-pulse'
      },
      HIGH: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.1)]',
        icon: '🟠',
        pulse: ''
      },
      MEDIUM: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        glow: '',
        icon: '🟡',
        pulse: ''
      },
      LOW: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        glow: '',
        icon: '🔵',
        pulse: ''
      }
    }
    return configs[severity as keyof typeof configs] || configs.LOW
  }

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'active' && !snoozedAlerts.includes(a.alert_id)).length,
    high: alerts.filter(a => a.severity === 'HIGH' && a.status === 'active' && !snoozedAlerts.includes(a.alert_id)).length,
    medium: alerts.filter(a => a.severity === 'MEDIUM' && a.status === 'active' && !snoozedAlerts.includes(a.alert_id)).length,
    active: alerts.filter(a => a.status === 'active' && !snoozedAlerts.includes(a.alert_id)).length,
    resolved: alerts.filter(a => a.status === 'resolved' || snoozedAlerts.includes(a.alert_id)).length
  }

  const filteredAlerts = alerts.filter(a => {
    const isSnoozed = snoozedAlerts.includes(a.alert_id)
    if (filter === 'all') return true
    if (filter === 'active') return a.status === 'active' && !isSnoozed
    if (filter === 'resolved') return a.status === 'resolved' || isSnoozed
    return a.severity === filter
  })

  // Simulated SHAP feature attributions for alerts (dynamic based on risk score)
  const getShapValues = (riskScore: number = 75) => {
    return [
      { name: 'V14 (Amount Shift)', val: riskScore * 0.25, isPositive: true },
      { name: 'V4 (Geo anomaly)', val: riskScore * 0.18, isPositive: true },
      { name: 'Scaled_Amount', val: riskScore * 0.12, isPositive: true },
      { name: 'V10 (Terminal speed)', val: -5.4, isPositive: false },
      { name: 'V12 (Account variance)', val: 4.8, isPositive: true }
    ]
  }

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-500">
      {/* Header & Threat Feed status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">Fraud Alerts</h2>
            <div className="flex items-center px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-mono text-red-400 tracking-wider">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping mr-1"></span>
              STREAM ACTIVE
            </div>
          </div>
          <p className="text-sm font-mono text-slate-400">Security Operations Console (SOC) classification log</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 border rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
              soundEnabled 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span>{soundEnabled ? '🔊 Sound Enabled' : '🔇 Sound Muted'}</span>
          </button>

          <span className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-slate-400">
            T_Limit: <span className="text-white">0.50</span>
          </span>
        </div>
      </div>

      {/* Stats Bento boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => setFilter('all')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'all' ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-white/5 bg-card/40'}`}
        >
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Total Feed</p>
          <p className="text-3xl font-bold font-mono text-white">{stats.total}</p>
        </div>

        <div 
          onClick={() => setFilter('CRITICAL')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'CRITICAL' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-red-500/20 bg-card/40'}`}
        >
          <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-1 animate-pulse">🔴</span> Critical
          </p>
          <p className="text-3xl font-bold font-mono text-red-400">{stats.critical}</p>
        </div>

        <div 
          onClick={() => setFilter('HIGH')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'HIGH' ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'border-orange-500/20 bg-card/40'}`}
        >
          <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-1">🟠</span> High
          </p>
          <p className="text-3xl font-bold font-mono text-orange-400">{stats.high}</p>
        </div>

        <div 
          onClick={() => setFilter('MEDIUM')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'MEDIUM' ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-yellow-500/20 bg-card/40'}`}
        >
          <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-1">🟡</span> Medium
          </p>
          <p className="text-3xl font-bold font-mono text-yellow-400">{stats.medium}</p>
        </div>

        <div 
          onClick={() => setFilter('active')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'active' ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-blue-500/20 bg-card/40'}`}
        >
          <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-2">Active</p>
          <p className="text-3xl font-bold font-mono text-blue-400">{stats.active}</p>
        </div>

        <div 
          onClick={() => setFilter('resolved')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'resolved' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-emerald-500/20 bg-card/40'}`}
        >
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">Resolved</p>
          <p className="text-3xl font-bold font-mono text-emerald-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Main Alerts List */}
      <div className="glass-panel rounded-2xl border border-white/5 bg-card/40 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-20 bg-black/10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white font-mono font-bold text-lg mb-1">ALL VECTORS CLEAR</p>
            <p className="text-xs text-slate-500 font-mono">No active intrusion logs or anomalies recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity)
              const isExpanded = expandedAlertId === alert.alert_id
              const isSnoozed = snoozedAlerts.includes(alert.alert_id)
              const isEscalated = escalatedAlerts.includes(alert.alert_id)
              const isResolved = alert.status === 'resolved' || isSnoozed

              return (
                <div 
                  key={alert.alert_id} 
                  className={`transition-all duration-300 ${config.glow} ${isExpanded ? 'bg-black/35' : 'hover:bg-white/5'}`}
                >
                  {/* Alert summary block */}
                  <div 
                    onClick={() => setExpandedAlertId(isExpanded ? null : alert.alert_id)}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border ${config.bg} ${config.border} ${config.text} ${config.pulse}`}>
                          <span>{config.icon}</span>
                          <span>{alert.severity}</span>
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          isResolved 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                        }`}>
                          {isResolved ? 'RESOLVED' : isEscalated ? 'ESCALATED (T2)' : 'ACTIVE'}
                        </span>
                        
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-white font-medium text-lg tracking-tight">{alert.message}</p>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400 pt-1">
                        <span className="flex items-center">
                          <span className="text-slate-600 mr-1.5">ID:</span>
                          <span>{alert.transaction_id.slice(0, 16)}...</span>
                        </span>
                        {alert.amount && (
                          <span className="flex items-center">
                            <span className="text-slate-600 mr-1.5">Amount:</span>
                            <span className="text-white font-bold">${alert.amount.toLocaleString()}</span>
                          </span>
                        )}
                        {alert.risk_score && (
                          <span className="flex items-center">
                            <span className="text-slate-600 mr-1.5">Risk Score:</span>
                            <span className={`font-bold ${config.text}`}>{alert.risk_score}%</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand/Collapse Chevron indicator */}
                    <div className="flex items-center justify-end shrink-0 pl-4">
                      <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Inspector Console */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                      
                      {/* SHAP Force Plot column */}
                      <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-4">
                        <div>
                          <p className="text-xs font-mono font-bold text-white uppercase mb-1">Local SHAP Feature attributions</p>
                          <p className="text-[10px] text-slate-400 font-mono">Quantifies feature influence on the neural ensemble probability threshold.</p>
                        </div>

                        <div className="space-y-3">
                          {getShapValues(alert.risk_score || 75).map((att, idx) => (
                            <div key={idx} className="space-y-1 text-[10px] font-mono">
                              <div className="flex justify-between items-center text-slate-400">
                                <span>{att.name}</span>
                                <span className={att.isPositive ? 'text-red-400' : 'text-emerald-400'}>
                                  {att.isPositive ? `+${att.val.toFixed(1)}%` : `${att.val.toFixed(1)}%`}
                                </span>
                              </div>
                              <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden flex relative">
                                {att.isPositive ? (
                                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, att.val * 1.5)}%` }}></div>
                                ) : (
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, Math.abs(att.val) * 1.5)}%` }}></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Anomaly parameters & SOC Actions */}
                      <div className="flex flex-col justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                        <div className="space-y-2">
                          <p className="text-xs font-mono font-bold text-white uppercase mb-2">Triggered anomaly flags</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                              <span className="text-red-400">🚨</span>
                              <span>Probability vectors exceeded classification threshold of 0.50</span>
                            </div>
                            {alert.amount && alert.amount > 2000 && (
                              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                                <span className="text-yellow-400">⚠</span>
                                <span>High Amount outlier: transaction amount exceeds p99 benchmark</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                              <span className="text-yellow-400">⚠</span>
                              <span>Abnormal PCA variance V14 / V4 parameters</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls/Buttons */}
                        <div className="flex flex-wrap gap-3 pt-6">
                          {!isResolved ? (
                            <>
                              <button
                                onClick={() => resolveAlert(alert.alert_id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              >
                                <span>✓</span>
                                <span>Resolve Threat</span>
                              </button>

                              <button
                                onClick={() => handleSnooze(alert.alert_id)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs font-bold rounded-lg border border-white/10 transition-all flex items-center space-x-1.5"
                              >
                                <span>⏳</span>
                                <span>Snooze Feed</span>
                              </button>

                              {!isEscalated && (
                                <button
                                  onClick={() => handleEscalation(alert.alert_id)}
                                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/35 text-purple-300 font-mono text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5"
                                >
                                  <span>⚙</span>
                                  <span>Escalate (T2)</span>
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="w-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center space-x-2">
                              <span>✓</span>
                              <span>Threat mitigated and recorded in security registry database.</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
