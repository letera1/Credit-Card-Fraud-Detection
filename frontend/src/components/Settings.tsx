'use client'

import { useState } from 'react'

export default function Settings() {
  const [threshold, setThreshold] = useState(0.5)
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure fraud detection system preferences
        </p>
      </div>

      {/* Detection Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Detection Settings</h3>
        
        <div className="space-y-6">
          {/* Fraud Threshold */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Fraud Detection Threshold
              </label>
              <span className="text-sm font-bold text-primary">{threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Transactions with fraud probability above this threshold will be flagged as fraudulent
            </p>
          </div>

          {/* Risk Levels */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Risk Level Thresholds
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Low Risk</span>
                  <span className="text-sm font-medium text-green-500">&lt; 30</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '30%' }} />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Medium Risk</span>
                  <span className="text-sm font-medium text-yellow-500">30 - 60</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-yellow-500" style={{ width: '60%' }} />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">High Risk</span>
                  <span className="text-sm font-medium text-orange-500">60 - 80</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: '80%' }} />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Critical Risk</span>
                  <span className="text-sm font-medium text-red-500">&gt; 80</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Enable Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                Receive alerts for fraud detection events
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Critical Alerts Only</p>
              <p className="text-xs text-muted-foreground mt-1">
                Only notify for critical risk transactions
              </p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Display Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-Refresh Dashboard</p>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically update analytics and transactions
              </p>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {autoRefresh && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Refresh Interval (seconds)
                </label>
                <span className="text-sm font-bold text-primary">{refreshInterval}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">API Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              API Endpoint
            </label>
            <input
              type="text"
              value="http://localhost:8000"
              readOnly
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              API Status
            </label>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-500">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button className="px-6 py-2 rounded-lg bg-secondary hover:bg-accent text-foreground text-sm font-medium transition-colors">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}
