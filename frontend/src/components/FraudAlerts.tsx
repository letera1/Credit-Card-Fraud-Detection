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
}

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fraud Alerts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage fraud detection alerts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-accent text-foreground text-sm font-medium transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Alerts</p>
          <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-red-500/20 p-4">
          <p className="text-sm text-red-500 mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-500">
            {alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'active').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-orange-500/20 p-4">
          <p className="text-sm text-orange-500 mb-1">High Priority</p>
          <p className="text-2xl font-bold text-orange-500">
            {alerts.filter(a => a.severity === 'HIGH' && a.status === 'active').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-green-500/20 p-4">
          <p className="text-sm text-green-500 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-500">
            {alerts.filter(a => a.status === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Active Alerts</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-foreground font-medium">No Active Alerts</p>
            <p className="text-sm text-muted-foreground mt-2">All transactions are secure</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map((alert) => (
              <div key={alert.alert_id} className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        alert.status === 'active' 
                          ? 'bg-yellow-500/10 text-yellow-500' 
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-foreground font-medium mb-1">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>{alert.transaction_id}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  {alert.status === 'active' && (
                    <button
                      onClick={() => resolveAlert(alert.alert_id)}
                      className="ml-4 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 text-sm font-medium transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
