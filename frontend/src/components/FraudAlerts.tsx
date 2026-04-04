'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

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
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/alerts')
      setAlerts(response.data.alerts || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      setLoading(false)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await axios.post(`http://localhost:8000/alerts/${alertId}/resolve`)
      fetchAlerts()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  const getSeverityConfig = (severity: string) => {
    const configs = {
      CRITICAL: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        icon: '🔴',
        pulse: 'animate-pulse'
      },
      HIGH: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
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
    critical: alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'HIGH' && a.status === 'active').length,
    medium: alerts.filter(a => a.severity === 'MEDIUM' && a.status === 'active').length,
    active: alerts.filter(a => a.status === 'active').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  }

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true
    if (filter === 'active') return a.status === 'active'
    if (filter === 'resolved') return a.status === 'resolved'
    return a.severity === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Fraud Alerts</h2>
          <p className="text-sm text-slate-400">Real-time fraud detection alerts and notifications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-purple-400 transition-colors flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-400 transition-colors flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => setFilter('all')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'all' ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/5'}`}
        >
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Total</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div 
          onClick={() => setFilter('CRITICAL')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'CRITICAL' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-red-500/20'}`}
        >
          <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2 animate-pulse">🔴</span> Critical
          </p>
          <p className="text-3xl font-bold text-red-400">{stats.critical}</p>
        </div>

        <div 
          onClick={() => setFilter('HIGH')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'HIGH' ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-orange-500/20'}`}
        >
          <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">🟠</span> High
          </p>
          <p className="text-3xl font-bold text-orange-400">{stats.high}</p>
        </div>

        <div 
          onClick={() => setFilter('MEDIUM')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'MEDIUM' ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-yellow-500/20'}`}
        >
          <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">🟡</span> Medium
          </p>
          <p className="text-3xl font-bold text-yellow-400">{stats.medium}</p>
        </div>

        <div 
          onClick={() => setFilter('active')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'active' ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-blue-500/20'}`}
        >
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Active</p>
          <p className="text-3xl font-bold text-blue-400">{stats.active}</p>
        </div>

        <div 
          onClick={() => setFilter('resolved')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'resolved' ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-green-500/20'}`}
        >
          <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-2">Resolved</p>
          <p className="text-3xl font-bold text-green-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="glass-panel rounded-xl border border-white/5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white font-medium text-lg mb-2">All Clear!</p>
            <p className="text-sm text-slate-400">No active alerts at this time</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity)
              return (
                <div key={alert.alert_id} className={`p-6 hover:bg-white/5 transition-all group ${config.glow}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono border ${config.bg} ${config.border} ${config.text} ${config.pulse}`}>
                          <span>{config.icon}</span>
                          <span>{alert.severity}</span>
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          alert.status === 'active' 
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' 
                            : 'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {alert.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-white font-medium mb-3 text-lg">{alert.message}</p>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="font-mono">{alert.transaction_id}</span>
                        </div>
                        {alert.risk_score && (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">Risk:</span>
                            <span className={`font-bold ${config.text}`}>{alert.risk_score}%</span>
                          </div>
                        )}
                        {alert.amount && (
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">Amount:</span>
                            <span className="font-bold text-white">${alert.amount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {alert.status === 'active' && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => resolveAlert(alert.alert_id)}
                          className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium transition-all hover:scale-105 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Resolve</span>
                        </button>
                        <button className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition-all hover:scale-105">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
