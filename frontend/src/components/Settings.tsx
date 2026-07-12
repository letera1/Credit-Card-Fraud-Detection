'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface ModelConfig {
  threshold: number; enabled_models: string[]; alert_channels: string[]; batch_size: number; auto_retrain: boolean
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [config, setConfig] = useState<ModelConfig>({
    threshold: 0.5, enabled_models: ['xgboost', 'random_forest'], alert_channels: ['dashboard'],
    batch_size: 1000, auto_retrain: false
  })
  const [activeTab, setActiveTab] = useState<'general' | 'model' | 'alerts' | 'advanced'>('general')
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [showDangerModal, setShowDangerModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('modelConfig')
    if (stored) { try { setConfig(JSON.parse(stored)) } catch {} }
  }, [])

  const updateConfig = (key: keyof ModelConfig, value: any) => {
    const updated = { ...config, [key]: value }
    setConfig(updated)
    localStorage.setItem('modelConfig', JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTestConnection = async () => {
    setTestResult('testing')
    try {
      const res = await fetch('http://localhost:8000/health')
      if (res.ok) setTestResult('success')
      else setTestResult('failed')
    } catch { setTestResult('failed') }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'model', label: 'Model', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'alerts', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'advanced', label: 'Advanced', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  ] as const

  return (
    <div className="space-y-8 animate-in text-foreground">
      <div className="p-6 rounded-2xl bg-muted/20 border border-border/50">
        <h2 className="text-3xl font-bold gradient-text mb-2">System Settings</h2>
        <p className="text-sm font-mono text-muted-foreground">Configure model parameters, alert channels, and security preferences</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border
              ${activeTab === tab.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-transparent text-muted-foreground border-border/30 hover:text-foreground hover:border-border/60'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} /></svg>
            <span>{tab.label}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center space-x-2">
          {saved && <span className="text-emerald-500 text-2xs font-mono animate-slide-down flex items-center space-x-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span>Saved</span></span>}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border-border/50 p-6">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/40 rounded-xl">
              <div>
                <p className="text-sm font-bold text-foreground">Theme Preference</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{theme === 'dark' ? 'Dark mode reduces eye strain in low-light environments' : 'Light mode for daytime visibility'}</p>
              </div>
              <button onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary/30' : 'bg-muted/60 border border-border/50'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-card border border-border/50 shadow-md flex items-center justify-center transition-all ${theme === 'dark' ? 'left-8' : 'left-1'}`}>
                  {theme === 'dark' ? (
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/40 rounded-xl">
              <div>
                <p className="text-sm font-bold text-foreground">Auto-Retrain Model</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">Periodically retrain ensemble on new transaction data</p>
              </div>
              <button onClick={() => updateConfig('auto_retrain', !config.auto_retrain)}
                className={`relative w-14 h-7 rounded-full transition-colors ${config.auto_retrain ? 'bg-primary/30' : 'bg-muted/60 border border-border/50'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-card border border-border/50 shadow-md flex items-center justify-center transition-all ${config.auto_retrain ? 'left-8' : 'left-1'}`}>
                  {config.auto_retrain && <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Batch Processing Size</h4>
              <div className="flex items-center space-x-4">
                <input type="range" min={100} max={10000} step={100} value={config.batch_size} onChange={(e) => updateConfig('batch_size', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-muted/60 rounded-full appearance-none cursor-pointer accent-primary" />
                <span className="text-sm font-mono font-bold text-foreground min-w-[60px] text-right">{config.batch_size.toLocaleString()}</span>
              </div>
              <p className="text-2xs text-muted-foreground font-mono mt-2">Larger batches improve throughput but increase memory usage</p>
            </div>

            <div className="pt-4 border-t border-border/30">
              <h4 className="text-sm font-bold text-foreground mb-3">Connection Health</h4>
              <button onClick={handleTestConnection}
                className="px-4 py-2.5 bg-muted/30 border border-border/50 hover:border-primary/30 rounded-xl text-xs font-mono text-foreground transition-all flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Test API Connection</span>
              </button>
              {testResult && (
                <span className={`ml-3 text-xs font-mono ${testResult === 'testing' ? 'text-yellow-500' : testResult === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {testResult === 'testing' ? 'Testing...' : testResult === 'success' ? 'Connected' : 'Failed'}
                </span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'model' && (
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Decision Threshold</h4>
              <div className="flex items-center space-x-4">
                <input type="range" min={0.1} max={0.95} step={0.05} value={config.threshold} onChange={(e) => updateConfig('threshold', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-muted/60 rounded-full appearance-none cursor-pointer accent-primary" />
                <span className="text-sm font-mono font-bold text-foreground min-w-[48px] text-right">{config.threshold.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xs text-muted-foreground font-mono mt-1">
                <span>Low (more alerts)</span>
                <span>High (fewer alerts)</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Enabled Models</h4>
              <div className="space-y-3">
                {[
                  { id: 'xgboost', label: 'XGBoost', desc: 'Gradient-boosted decision trees' },
                  { id: 'random_forest', label: 'Random Forest', desc: 'Bagged ensemble of decision trees' },
                  { id: 'neural_net', label: 'Neural Network', desc: 'Deep feed-forward architecture' },
                  { id: 'isolation_forest', label: 'Isolation Forest', desc: 'Unsupervised anomaly detection' },
                ].map(m => (
                  <label key={m.id} className="flex items-center justify-between p-3 bg-muted/20 border border-border/40 rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground font-mono">{m.desc}</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={config.enabled_models.includes(m.id)} onChange={() => {
                        const updated = config.enabled_models.includes(m.id)
                          ? config.enabled_models.filter(e => e !== m.id)
                          : [...config.enabled_models, m.id]
                        updateConfig('enabled_models', updated)
                      }}
                        className="sr-only peer" />
                      <div className="w-10 h-5 bg-muted/60 rounded-full peer-checked:bg-primary/40 transition-colors border border-border/40"></div>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card border border-border/50 shadow-sm transition-all peer-checked:translate-x-5 peer-checked:border-primary`}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-foreground mb-4">Alert Channels</h4>
            {[
              { id: 'dashboard', label: 'Dashboard', desc: 'In-app real-time alert panel' },
              { id: 'email', label: 'Email', desc: 'SMTP notification on critical alerts' },
              { id: 'webhook', label: 'Webhook', desc: 'HTTP POST to external endpoint' },
              { id: 'sms', label: 'SMS', desc: 'Text message via Twilio gateway' },
              { id: 'slack', label: 'Slack', desc: 'Post to Slack channel via webhook' },
            ].map(ch => (
              <label key={ch.id} className="flex items-center justify-between p-3 bg-muted/20 border border-border/40 rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                <div>
                  <p className="text-sm font-bold text-foreground">{ch.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{ch.desc}</p>
                </div>
                <div className="relative">
                  <input type="checkbox" checked={config.alert_channels.includes(ch.id)} onChange={() => {
                    const updated = config.alert_channels.includes(ch.id)
                      ? config.alert_channels.filter(e => e !== ch.id)
                      : [...config.alert_channels, ch.id]
                    updateConfig('alert_channels', updated)
                  }}
                    className="sr-only peer" />
                  <div className="w-10 h-5 bg-muted/60 rounded-full peer-checked:bg-primary/40 transition-colors border border-border/40"></div>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card border border-border/50 shadow-sm transition-all peer-checked:translate-x-5 peer-checked:border-primary`}></div>
                </div>
              </label>
            ))}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm font-bold text-red-500">Danger zone</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono mb-4">Reset all settings to factory defaults. This action cannot be undone.</p>
              <button onClick={() => setShowDangerModal(true)}
                className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-mono font-bold transition-all">
                RESET TO DEFAULT
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Local Storage Data</h4>
              <p className="text-xs text-muted-foreground font-mono mb-3">Stored configuration keys in localStorage</p>
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl font-mono text-2xs text-muted-foreground space-y-1">
                <p>modelConfig — {JSON.stringify(config).length} bytes</p>
                <p>theme — {typeof window !== 'undefined' ? localStorage.getItem('theme') || 'not set' : 'ssr'}</p>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload() }}
                className="mt-3 px-4 py-2 bg-muted/30 border border-border/50 hover:border-red-500/30 hover:text-red-500 rounded-xl text-xs font-mono text-foreground transition-all">
                Clear All Local Storage
              </button>
            </div>
          </div>
        )}
      </div>

      {showDangerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border-red-500/30 overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Reset to Default</h3>
                  <p className="text-xs text-muted-foreground font-mono">This will wipe all configuration settings</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">All custom thresholds, enabled models, alert channels, and preferences will be restored to factory defaults.</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDangerModal(false)}
                  className="flex-1 py-3 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl text-xs font-mono font-bold text-foreground transition-all">
                  CANCEL
                </button>
                <button onClick={() => {
                  const defaults = { threshold: 0.5, enabled_models: ['xgboost', 'random_forest'], alert_channels: ['dashboard'], batch_size: 1000, auto_retrain: false }
                  setConfig(defaults)
                  localStorage.setItem('modelConfig', JSON.stringify(defaults))
                  setShowDangerModal(false)
                }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold shadow-lg shadow-red-500/25 transition-all">
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
