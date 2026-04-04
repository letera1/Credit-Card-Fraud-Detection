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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Configuration</h2>
          <p className="text-sm text-slate-400">Fine-tune your fraud detection system parameters</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={resetSettings}
            className="px-4 py-2 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 rounded-lg text-sm text-slate-400 hover:text-slate-300 transition-all flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>
          <button 
            onClick={saveSettings}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Save Notification */}
      {saved && (
        <div className="glass-panel rounded-xl p-4 flex items-center space-x-3 border-green-500/30 bg-green-500/10 animate-in fade-in slide-in-from-top-2">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Settings Saved Successfully!</p>
            <p className="text-xs text-green-400/70">Your configuration has been updated</p>
          </div>
        </div>
      )}

      {/* Detection Settings */}
      <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Detection Parameters</h3>
          </div>
          
          <div className="space-y-6">
            {/* Fraud Threshold */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-sm font-medium text-white block mb-1">
                    Fraud Detection Threshold
                  </label>
                  <p className="text-xs text-slate-400">
                    Probability cutoff for fraud classification
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-purple-400">{settings.threshold.toFixed(2)}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.threshold}
                onChange={(e) => updateSetting('threshold', parseFloat(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>0.00 (Lenient)</span>
                <span>1.00 (Strict)</span>
              </div>
            </div>

            {/* Risk Levels */}
            <div>
              <label className="text-sm font-medium text-white mb-4 block flex items-center space-x-2">
                <span>Risk Level Thresholds</span>
                <span className="text-xs text-slate-500 font-normal">(Read-only)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 hover:scale-105 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🟢</span>
                      <span className="text-sm font-medium text-green-400">Low Risk</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">&lt; 30</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: '30%' }} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 hover:scale-105 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🟡</span>
                      <span className="text-sm font-medium text-yellow-400">Medium Risk</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">30 - 60</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div className="h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:scale-105 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🟠</span>
                      <span className="text-sm font-medium text-orange-400">High Risk</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">60 - 80</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div className="h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: '80%' }} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:scale-105 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🔴</span>
                      <span className="text-sm font-medium text-red-400">Critical Risk</span>
                    </div>
                    <span className="text-sm font-bold text-red-400">&gt; 80</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div className="h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Alert Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group/item">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Enable Notifications</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Receive real-time alerts for fraud detection events
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ${
                  settings.notifications ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.notifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/30 transition-all group/item">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Critical Alerts Only</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Only notify for critical risk transactions (80%+)
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('criticalOnly', !settings.criticalOnly)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ${
                  settings.criticalOnly ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-700'
                } ${!settings.notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!settings.notifications}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.criticalOnly ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
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

      {/* Display Settings */}
      <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Display & Refresh</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all group/item">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Auto-Refresh Dashboard</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Automatically update analytics and transactions
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all ${
                  settings.autoRefresh ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.autoRefresh ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.autoRefresh && (
              <div className="p-5 rounded-xl bg-black/40 border border-white/5 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-white">
                    Refresh Interval
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-cyan-400">{settings.refreshInterval}</span>
                    <span className="text-sm text-slate-400">seconds</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={settings.refreshInterval}
                  onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>1s (Fast)</span>
                  <span>30s (Slow)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">API Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-black/40 border border-white/5">
              <label className="text-sm font-medium text-white mb-3 block">
                Backend Endpoint
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.apiEndpoint}
                  onChange={(e) => updateSetting('apiEndpoint', e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-green-500/50 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all"
                  placeholder="http://localhost:8000"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-400">API Status</p>
                    <p className="text-xs text-green-400/70">Connection established</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-green-400">14ms</p>
                  <p className="text-xs text-green-400/70">latency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
