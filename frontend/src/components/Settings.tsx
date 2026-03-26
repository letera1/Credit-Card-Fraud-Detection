'use client'

import { useState, useEffect } from 'react'

interface SettingsState {
  threshold: number
  notifications: boolean
  criticalOnly: boolean
  autoRefresh: boolean
  refreshInterval: number
  apiEndpoint: string
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    threshold: 0.5,
    notifications: true,
    criticalOnly: false,
    autoRefresh: true,
    refreshInterval: 5,
    apiEndpoint: 'http://localhost:8000'
  })
  const [saved, setSaved] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('fraudguard-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const saveSettings = () => {
    localStorage.setItem('fraudguard-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const resetSettings = () => {
    const defaultSettings: SettingsState = {
      threshold: 0.5,
      notifications: true,
      criticalOnly: false,
      autoRefresh: true,
      refreshInterval: 5,
      apiEndpoint: 'http://localhost:8000'
    }
    setSettings(defaultSettings)
    localStorage.setItem('fraudguard-settings', JSON.stringify(defaultSettings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure fraud detection system preferences
        </p>
      </div>

      {/* Save Notification */}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center space-x-3">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Settings saved successfully!
          </span>
        </div>
      )}

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
              <span className="text-sm font-bold text-primary">{settings.threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.threshold}
              onChange={(e) => updateSetting('threshold', parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
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
              onClick={() => updateSetting('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
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
              onClick={() => updateSetting('criticalOnly', !settings.criticalOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.criticalOnly ? 'bg-primary' : 'bg-secondary'
              }`}
              disabled={!settings.notifications}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.criticalOnly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
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
              onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoRefresh ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.autoRefresh && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Refresh Interval (seconds)
                </label>
                <span className="text-sm font-bold text-primary">{settings.refreshInterval}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={settings.refreshInterval}
                onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
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
              value={settings.apiEndpoint}
              onChange={(e) => updateSetting('apiEndpoint', e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
        <button 
          onClick={resetSettings}
          className="px-6 py-2 rounded-lg bg-secondary hover:bg-accent text-foreground text-sm font-medium transition-colors"
        >
          Reset to Defaults
        </button>
        <button 
          onClick={saveSettings}
          className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}
