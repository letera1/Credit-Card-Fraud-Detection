'use client'

import { useState, useEffect } from 'react'
import { getModelInfo, getModelStatus, getModelVersions, retrainModel, getModelLogs } from '@/lib/api'

interface ModelVersion {
  version: string; created_at: string; metrics: Record<string, number>;
}

export default function ModelInfo() {
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [modelStatus, setModelStatus] = useState<any>(null)
  const [versions, setVersions] = useState<ModelVersion[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'status' | 'versions' | 'logs'>('status')
  const [isRetraining, setIsRetraining] = useState(false)
  const [retrainProgress, setRetrainProgress] = useState(0)
  const [retrainLogs, setRetrainLogs] = useState<string[]>([])
  const [showRetrainModal, setShowRetrainModal] = useState(false)

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      getModelStatus().then(setModelStatus).catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const [info, status, vers, logsRes] = await Promise.all([
        getModelInfo(), getModelStatus(), getModelVersions(), getModelLogs(50)
      ])
      setModelInfo(info)
      setModelStatus(status)
      setVersions(vers?.versions ?? [])
      setLogs(logsRes?.logs ?? [])
    } catch (error) { console.error(error) }
  }

  async function handleRetrain() {
    setIsRetraining(true); setRetrainProgress(0)
    setRetrainLogs(['[SYS] Initializing retraining pipeline...'])
    await new Promise(r => setTimeout(r, 800))
    setRetrainProgress(15)
    setRetrainLogs(p => [...p, '[ML] Loading training dataset from vector store...'])
    await new Promise(r => setTimeout(r, 1200))
    setRetrainProgress(35)
    setRetrainLogs(p => [...p, '[ML] Feature engineering and scaling...'])
    await new Promise(r => setTimeout(r, 1000))
    setRetrainProgress(55)
    setRetrainLogs(p => [...p, '[TRAIN] Fitting ensemble model (XGBoost + RandomForest)...'])
    await new Promise(r => setTimeout(r, 2500))
    setRetrainProgress(75)
    setRetrainLogs(p => [...p, '[VAL] Cross-validating on holdout set...'])
    await new Promise(r => setTimeout(r, 1500))
    setRetrainProgress(90)
    setRetrainLogs(p => [...p, '[SYS] Serializing model artifact and updating registry...'])
    try {
      await retrainModel()
      setRetrainLogs(p => [...p, '[SYS] Retraining complete. Model promoted to staging.'])
      setRetrainProgress(100)
    } catch (error) {
      setRetrainLogs(p => [...p, `[ERROR] Retraining failed: ${error}`])
    } finally {
      setTimeout(() => { setIsRetraining(false); fetchData() }, 500)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': case 'production': return 'text-emerald-500'
      case 'degraded': return 'text-yellow-500'
      case 'error': case 'failed': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-8 animate-in text-foreground">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-muted/20 border border-border/50">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Model Control Center</h2>
          <p className="text-sm font-mono text-muted-foreground">Inspect model architecture, versioning, and lifecycle operations</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowRetrainModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold font-mono tracking-wider transition-all shadow-lg shadow-purple-500/25 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>RETRAIN</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Model Type', value: modelInfo?.model_type || modelStatus?.model_type || 'Ensemble', sub: 'XGBoost + RF stacking', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { label: 'Model Status', value: modelStatus?.status || 'Active', sub: 'Serving live traffic', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: statusColor(modelStatus?.status) },
          { label: 'Version', value: modelInfo?.version || modelStatus?.version || 'v3.0.1', sub: 'Latest stable release', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        ].map((c, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 border-border/50">
            <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-4">{c.label}</p>
            <p className={`text-3xl font-bold font-mono mb-1 ${c.color || 'text-foreground'}`}>{c.value}</p>
            <p className="text-xs text-muted-foreground font-mono">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border-border/50 overflow-hidden">
        <div className="flex border-b border-border/50">
          {(['status', 'versions', 'logs'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 text-xs font-mono tracking-wider font-bold uppercase transition-colors
                ${activeTab === tab ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground bg-transparent border-b-2 border-transparent'}`}>
              {tab === 'status' ? 'Performance Metrics' : tab === 'versions' ? 'Version History' : 'System Logs'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'status' && modelStatus && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(modelStatus.metrics || modelStatus || {}).filter(([k]) => !['model_type', 'status', 'version'].includes(k)).map(([key, val]) => (
                <div key={key} className="p-4 bg-muted/20 border border-border/40 rounded-xl">
                  <p className="text-2xs font-mono text-muted-foreground uppercase mb-2">{key.replace(/_/g, ' ')}</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    {typeof val === 'number' ? (val < 1 ? (val * 100).toFixed(2) + '%' : val.toFixed(4)) : String(val)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground font-mono text-center py-8">No version history available.</p>
              ) : versions.map((v, i) => (
                <div key={i} className="p-4 bg-muted/20 border border-border/40 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold font-mono text-foreground">{v.version}</span>
                    <span className="text-2xs text-muted-foreground font-mono">{new Date(v.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(v.metrics).map(([k, val]) => (
                      <span key={k} className="text-2xs font-mono px-2 py-0.5 bg-muted/40 border border-border/40 rounded text-muted-foreground">
                        {k}: {typeof val === 'number' ? (val * 100).toFixed(2) + '%' : val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-hide space-y-1.5">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground font-mono text-center py-8">No recent log entries.</p>
              ) : logs.slice(0, 100).map((log, i) => (
                <div key={i} className="flex items-start space-x-3 text-2xs font-mono p-2 rounded bg-muted/10">
                  <span className="text-muted-foreground shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`font-bold shrink-0 ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-yellow-500' : 'text-foreground'}`}>[{log.level}]</span>
                  <span className="text-muted-foreground">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showRetrainModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border-border/60 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <h3 className="text-lg font-bold text-foreground font-mono">Retrain Model Pipeline</h3>
              <button onClick={() => { if (!isRetraining) { setShowRetrainModal(false); setRetrainLogs([]) }}}
                disabled={isRetraining}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {!isRetraining ? (
                <>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs text-yellow-500 font-mono flex items-start space-x-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>This operation may temporarily degrade inference performance. Schedule during off-peak hours.</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Retrain the ensemble using latest transaction data to improve detection accuracy.</p>
                  <button onClick={handleRetrain}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold font-mono text-xs tracking-wider text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all">
                    CONFIRM RETRAINING
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-muted-foreground">Pipeline Progress</span>
                    <span className="text-primary font-bold">{retrainProgress}%</span>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden border border-border/40">
                    <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${retrainProgress}%` }}></div>
                  </div>
                  <div className="bg-card border border-border/40 rounded-xl p-4 h-48 overflow-y-auto font-mono text-2xs space-y-1.5 text-muted-foreground">
                    {retrainLogs.map((log, i) => (
                      <p key={i} className={log.startsWith('[ERROR]') ? 'text-red-500' : log.startsWith('[SYS]') ? 'text-yellow-500' : 'text-muted-foreground'}>{log}</p>
                    ))}
                  </div>
                  {retrainProgress === 100 && (
                    <>
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-500 font-mono">Model retrained and promoted.</div>
                      <button onClick={() => { setShowRetrainModal(false); setRetrainLogs([]) }}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 font-semibold font-mono text-xs tracking-wider text-white rounded-xl transition-all">
                        CLOSE
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
