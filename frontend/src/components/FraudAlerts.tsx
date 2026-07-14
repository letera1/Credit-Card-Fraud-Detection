'use client'

import { useState, useEffect } from 'react'
import { getAlerts, resolveAlert } from '@/lib/api'

interface Alert {
  alert_id: string
  transaction_id: string
  amount: number
  merchant: string
  timestamp: string
  risk_score: number
  status: string
  alert_type: string
  location: string
  severity: string
  message: string
  solution: string
  recommended_action: string
  anomaly_flags: string[]
  confidence: number
}

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAlertType, setFilterAlertType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAlerts() {
    try {
      const res = await getAlerts()
      setAlerts(res?.alerts ?? [])
    } catch (error) { console.error(error) }
    finally { setIsLoading(false) }
  }

  async function handleAcknowledge(alertId: string) {
    setAcknowledgingId(alertId)
    try {
      await resolveAlert(alertId)
      setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, status: 'resolved' } : a))
    } catch (error) { console.error(error) }
    finally { setAcknowledgingId(null) }
  }

  const filteredAlerts = alerts.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    if (filterAlertType !== 'all' && a.alert_type !== filterAlertType) return false
    if (searchQuery && !a.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) && !a.merchant?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-500'
    if (score >= 70) return 'text-orange-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-emerald-500'
  }

  const getRiskBg = (score: number) => {
    if (score >= 90) return 'bg-red-500/10 border-red-500/20'
    if (score >= 70) return 'bg-orange-500/10 border-orange-500/20'
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-emerald-500/10 border-emerald-500/20'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-2 py-0.5 text-2xs font-mono bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">Active</span>
      case 'critical': return <span className="px-2 py-0.5 text-2xs font-mono bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">Critical</span>
      case 'acknowledged': return <span className="px-2 py-0.5 text-2xs font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full">Acknowledged</span>
      case 'resolved': return <span className="px-2 py-0.5 text-2xs font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">Resolved</span>
      default: return <span className="px-2 py-0.5 text-2xs font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full">{status}</span>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <span className="px-2 py-0.5 text-2xs font-mono bg-red-500/15 text-red-400 border border-red-500/25 rounded">CRITICAL</span>
      case 'HIGH': return <span className="px-2 py-0.5 text-2xs font-mono bg-orange-500/15 text-orange-400 border border-orange-500/25 rounded">HIGH</span>
      case 'MEDIUM': return <span className="px-2 py-0.5 text-2xs font-mono bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 rounded">MEDIUM</span>
      default: return <span className="px-2 py-0.5 text-2xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded">LOW</span>
    }
  }

  const alertTypeLabel = (type: string) => {
    switch (type) {
      case 'high_amount': return 'High Amount'
      case 'velocity': return 'Velocity Anomaly'
      case 'new_merchant': return 'New Merchant'
      case 'location_anomaly': return 'Location Anomaly'
      default: return type?.replace(/_/g, ' ') || 'Unknown'
    }
  }

  const activeCount = alerts.filter(a => a.status === 'active').length
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'resolved').length
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length

  if (isLoading && alerts.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-muted-foreground font-mono">Loading fraud alerts...</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in text-foreground">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-muted/20 border border-border/50">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Fraud Alerts</h2>
          <p className="text-sm font-mono text-muted-foreground">Real-time threat detection and incident response panel</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-2xl font-bold font-mono text-red-400">{activeCount}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">Active</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <p className="text-2xl font-bold font-mono text-orange-400">{criticalCount}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">Critical</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-2xl font-bold font-mono text-emerald-400">{resolvedCount}</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase">Resolved</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl glass-panel border-border/50">
        <div className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search by Transaction ID or Merchant..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors font-mono" />
          </div>
        </div>
        <div className="flex gap-3">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary/50 cursor-pointer">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={filterAlertType} onChange={(e) => setFilterAlertType(e.target.value)}
            className="px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary/50 cursor-pointer">
            <option value="all">All Types</option>
            <option value="high_amount">High Amount</option>
            <option value="velocity">Velocity</option>
            <option value="new_merchant">New Merchant</option>
            <option value="location_anomaly">Location Anomaly</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border-border/50">
            <svg className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-muted-foreground font-mono">No alerts match current filters.</p>
          </div>
        ) : filteredAlerts.map((alert) => (
          <div key={alert.alert_id}
            className="glass-panel rounded-2xl p-5 border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedAlert(alert)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${alert.status === 'resolved' ? 'bg-emerald-500' : alert.risk_score >= 70 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="font-mono font-bold text-sm text-foreground">{alert.transaction_id}</p>
                    {getStatusBadge(alert.status)}
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {new Date(alert.timestamp).toLocaleString()} &middot; {alert.merchant || 'Unknown Merchant'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-2xs font-mono px-2 py-0.5 bg-muted/30 border border-border/40 rounded text-muted-foreground">{alertTypeLabel(alert.alert_type)}</span>
                    {alert.location && <span className="text-2xs font-mono text-muted-foreground">&middot; {alert.location}</span>}
                    {alert.confidence > 0 && <span className="text-2xs font-mono text-muted-foreground">&middot; {alert.confidence}% confidence</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className={`text-lg font-bold font-mono ${getRiskColor(alert.risk_score)}`}>{alert.risk_score}</p>
                  <p className="text-2xs text-muted-foreground font-mono">Risk Score</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-mono text-foreground">${(alert.amount ?? 0).toLocaleString()}</p>
                  <p className="text-2xs text-muted-foreground font-mono">Amount</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleAcknowledge(alert.alert_id) }}
                  disabled={alert.status === 'resolved' || acknowledgingId === alert.alert_id}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all
                    ${alert.status !== 'resolved'
                      ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer'
                      : 'bg-muted/20 border-border/30 text-muted-foreground cursor-not-allowed'}
                  `}>
                  {acknowledgingId === alert.alert_id ? (
                    <span className="flex items-center space-x-1.5"><span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span><span>Processing</span></span>
                  ) : alert.status !== 'resolved' ? 'Resolve' : 'Resolved'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setSelectedAlert(null)}>
          <div className="glass-panel w-full max-w-2xl rounded-2xl border-border/60 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div>
                <h3 className="text-lg font-bold text-foreground font-mono">Alert Details</h3>
                <p className="text-xs font-mono text-muted-foreground mt-1">{selectedAlert.alert_id}</p>
              </div>
              <div className="flex items-center gap-3">
                {getSeverityBadge(selectedAlert.severity)}
                {getStatusBadge(selectedAlert.status)}
                <button onClick={() => setSelectedAlert(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 font-mono text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Transaction ID</p>
                  <p className="font-bold text-foreground">{selectedAlert.transaction_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Alert Type</p>
                  <p className="font-bold text-foreground">{alertTypeLabel(selectedAlert.alert_type)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Score</p>
                  <p className={`font-bold text-lg ${getRiskColor(selectedAlert.risk_score)}`}>{selectedAlert.risk_score}/100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</p>
                  <p className="font-bold text-foreground">{selectedAlert.confidence}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Amount</p>
                  <p className="font-bold text-foreground">${(selectedAlert.amount ?? 0).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Merchant</p>
                  <p className="font-bold text-foreground">{selectedAlert.merchant || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Location</p>
                  <p className="font-bold text-foreground">{selectedAlert.location || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Timestamp</p>
                  <p className="font-bold text-foreground">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {selectedAlert.anomaly_flags && selectedAlert.anomaly_flags.length > 0 && (
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <p className="text-[10px] text-orange-400 uppercase tracking-wider font-bold mb-2">Anomaly Flags</p>
                  <ul className="space-y-1">
                    {selectedAlert.anomaly_flags.map((flag, i) => (
                      <li key={i} className="text-xs text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-2">Recommended Action</p>
                <p className="text-xs text-foreground">{selectedAlert.recommended_action || 'No recommendation available.'}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <p className="text-[10px] text-purple-400 uppercase tracking-wider font-bold mb-2">Solution & Next Steps</p>
                <p className="text-xs text-foreground leading-relaxed">{selectedAlert.solution || 'No solution available for this alert.'}</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-2">Message</p>
                <p className="text-xs text-foreground">{selectedAlert.message}</p>
              </div>

              <button onClick={() => { if (selectedAlert.status !== 'resolved') handleAcknowledge(selectedAlert.alert_id); setSelectedAlert(null) }}
                disabled={selectedAlert.status === 'resolved'}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 disabled:from-muted disabled:to-muted disabled:text-muted-foreground font-semibold font-mono text-xs tracking-wider text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all">
                {selectedAlert.status !== 'resolved' ? 'RESOLVE ALERT & ACKNOWLEDGE' : 'Alert Already Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
