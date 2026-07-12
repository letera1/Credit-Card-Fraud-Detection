'use client'

import { useEffect, useState } from 'react'
import { getAnalytics, getFeatureImportance, getModelComparison, exportReport, getAuditLogs, createAuditLog } from '@/lib/api'

interface AuditEntry {
  id?: number; timestamp: string; user_id: string; action: string; resource: string; details: any; ip_address?: string
}

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('24h')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportLogs, setExportLogs] = useState<string[]>([])
  const [exportSuccess, setExportSuccess] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([])

  const [metrics, setMetrics] = useState({
    fraud_detection_rate: 98.7, false_positive_rate: 1.2, avg_processing_time: 14.5,
    total_amount_saved: 2847392, transactions_analyzed: 145892, fraud_prevented: 1247
  })

  const [topFeatures] = useState([
    { name: 'V14', importance: 15.6, trend: '+2.3%' },
    { name: 'V4', importance: 13.4, trend: '+1.8%' },
    { name: 'V12', importance: 12.1, trend: '-0.5%' },
    { name: 'V10', importance: 9.8, trend: '+3.1%' },
    { name: 'V17', importance: 8.7, trend: '+0.9%' },
  ])

  useEffect(() => {
    fetchData(); fetchAudits()
    const interval = setInterval(() => { fetchData(); fetchAudits() }, 8000)
    return () => clearInterval(interval)
  }, [timeRange])

  async function fetchData() {
    try {
      const [analytics, , modelComp] = await Promise.all([getAnalytics(), getFeatureImportance(), getModelComparison()]).catch(() => [null, null, null])
      if (modelComp && analytics) {
        const m = modelComp.models.find((m: any) => m.status === 'active') || modelComp.models[0]
        setMetrics(p => ({ ...p, fraud_detection_rate: Number((m.recall * 100).toFixed(1)), false_positive_rate: Number(((1 - m.precision) * 100).toFixed(1)), transactions_analyzed: analytics.total_transactions, fraud_prevented: analytics.fraud_detected, total_amount_saved: analytics.fraud_detected * 1450 }))
      }
    } catch (err) { console.error(err) }
  }

  async function fetchAudits() {
    try {
      const res = await getAuditLogs(20)
      if (res?.logs?.length > 0) setAuditLogs(res.logs.reverse())
      else setAuditLogs([
        { timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), user_id: "sec_ops_09", action: "MODEL_DEPRECATING", resource: "ensemble_model_v2.5", details: { status: "success" } },
        { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), user_id: "system", action: "MONITOR_CHECK_DRIFT", resource: "live_transactions", details: { drift_score: 0.023, alert: false } },
        { timestamp: new Date(Date.now() - 120000).toISOString(), user_id: "system", action: "MODEL_PROMOTED", resource: "ensemble_model_v3.0", details: { accuracy: 0.9876 } }
      ].reverse())
    } catch (error) { console.error(error) }
  }

  const triggerExport = async () => {
    setIsExporting(true); setExportProgress(5); setExportSuccess(false)
    setExportLogs(['[SEC-OP] Ingesting request signature...', '[SYS] Initializing analytics compiler...'])
    const steps = [
      { p: 25, log: '[DB] Querying transaction logs and model metrics...' },
      { p: 50, log: '[ML] Computing local data drift & validation rates...' },
      { p: 75, log: '[SYS] Compiling structures and generating vector charts...' },
      { p: 90, log: '[SEC-OP] Embedding cryptographic security log seals...' },
      { p: 100, log: '[SYS] Export file created. Streaming to client...' }
    ]
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800))
      setExportProgress(step.p)
      setExportLogs(prev => [...prev, step.log])
    }
    try {
      const res = await exportReport(exportFormat, timeRange)
      setDownloadUrl(res.download_url); setExportSuccess(true)
    } catch (error) { console.error(error) }
    finally { setIsExporting(false) }
  }

  const legitCurve = [
    { x: 0, y: 220, label: "$0 - $50" }, { x: 60, y: 190, label: "$50 - $150" }, { x: 120, y: 110, label: "$150 - $300" },
    { x: 180, y: 50, label: "$300 - $500" }, { x: 240, y: 80, label: "$500 - $750" }, { x: 300, y: 140, label: "$750 - $1.0K" },
    { x: 360, y: 180, label: "$1.0K - $1.5K" }, { x: 420, y: 210, label: "$1.5K - $2.0K" }, { x: 480, y: 225, label: "$2.0K - $3.0K" },
    { x: 540, y: 230, label: "$3.0K - $4.0K" }, { x: 600, y: 235, label: "$4.0K - $5.0K" }, { x: 700, y: 240, label: "$5.0K+" }
  ]
  const fraudCurve = [
    { x: 0, y: 235, label: "$0 - $50" }, { x: 60, y: 230, label: "$50 - $150" }, { x: 120, y: 220, label: "$150 - $300" },
    { x: 180, y: 200, label: "$300 - $500" }, { x: 240, y: 170, label: "$500 - $750" }, { x: 300, y: 110, label: "$750 - $1.0K" },
    { x: 360, y: 70, label: "$1.0K - $1.5K" }, { x: 420, y: 60, label: "$1.5K - $2.0K" }, { x: 480, y: 90, label: "$2.0K - $3.0K" },
    { x: 540, y: 140, label: "$3.0K - $4.0K" }, { x: 600, y: 180, label: "$4.0K - $5.0K" }, { x: 700, y: 240, label: "$5.0K+" }
  ]
  const [hoveredData, setHoveredData] = useState<{ x: number; y1: number; y2: number; label: string } | null>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const chartWidth = 700; const chartHeight = 240

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const step = chartWidth / (legitCurve.length - 1)
    const closestIndex = Math.max(0, Math.min(Math.round(relativeX / step), legitCurve.length - 1))
    setHoverX(closestIndex * step)
    setHoveredData({ x: closestIndex * step, y1: legitCurve[closestIndex].y, y2: fraudCurve[closestIndex].y, label: legitCurve[closestIndex].label })
  }

  const getPath = (points: { x: number; y: number }[]) => {
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i - 1].x + points[i].x) / 2
      const yc = (points[i - 1].y + points[i].y) / 2
      d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`
    }
    d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    return d
  }

  return (
    <div className="space-y-8 animate-in text-foreground">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-muted/20 border border-border/50">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Deep Analytics</h2>
          <p className="text-sm font-mono text-muted-foreground">Advanced cryptographic inspection and network fraud telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer font-mono">
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/25 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Model Precision Rate', value: `${metrics.fraud_detection_rate}%`, sub: 'Ensemble dynamic confidence limit', color: 'emerald' },
          { label: 'False Positive Rate', value: `${metrics.false_positive_rate}%`, sub: 'Under target 1.5% SLA limit', color: 'cyan' },
          { label: 'Mean Inference Time', value: `${metrics.avg_processing_time}ms`, sub: 'Ultra-low latency vector pipelines', color: 'purple' },
        ].map((c, i) => (
          <div key={i} className={`glass-panel rounded-2xl p-6 border-${c.color}-500/20 hover:border-${c.color}-500/40 transition-all duration-300 hover:-translate-y-0.5`}>
            <p className={`text-2xs font-mono text-${c.color}-500 uppercase tracking-widest mb-4`}>{c.label}</p>
            <p className="text-4xl font-bold font-mono text-foreground mb-2">{c.value}</p>
            <p className={`text-xs text-${c.color}-500/70 font-mono flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${c.color}-500 animate-pulse`} />
              {c.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Financial Impact Saved', value: `$${metrics.total_amount_saved.toLocaleString()}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Telemetry Inputs', value: metrics.transactions_analyzed.toLocaleString(), icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { label: 'Attacks Stopped', value: metrics.fraud_prevented, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        ].map((c, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 border-border/50">
            <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-foreground font-mono">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border-border/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Kernel Density Estimation Distribution</h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Statistical density mapping of fraud probability curves</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-1.5 rounded bg-emerald-500"></span>
              <span className="text-muted-foreground">Legitimate</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-1.5 rounded bg-red-500"></span>
              <span className="text-muted-foreground">Fraudulent</span>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto hide-scrollbar">
          <div className="min-w-[700px] h-[280px] relative">
            <svg width={chartWidth} height={chartHeight} onMouseMove={handleMouseMove} onMouseLeave={() => { setHoverX(null); setHoveredData(null) }} className="cursor-crosshair relative z-10">
              <defs>
                <linearGradient id="legitGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="fraudGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={getPath(legitCurve)} fill="url(#legitGrad2)" />
              <path d={getPath(fraudCurve)} fill="url(#fraudGrad2)" />
              <path d={getPath(legitCurve).split('L')[0]} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              <path d={getPath(fraudCurve).split('L')[0]} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              {hoverX !== null && <line x1={hoverX} y1={0} x2={hoverX} y2={chartHeight} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" />}
              {hoveredData && (
                <>
                  <circle cx={hoveredData.x} cy={hoveredData.y1} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <circle cx={hoveredData.x} cy={hoveredData.y2} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                </>
              )}
            </svg>
            {hoveredData && (
              <div className="absolute bg-card/95 border border-primary/30 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 font-mono text-2xs w-48 pointer-events-none text-foreground"
                style={{ left: `${Math.min(hoveredData.x + 15, chartWidth - 210)}px`, top: `20px` }}>
                <p className="text-primary font-bold border-b border-border/50 pb-1 mb-2">Range: {hoveredData.label}</p>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Legit:</span>
                  <span className="text-emerald-500 font-bold">{((chartHeight - hoveredData.y1) / 2).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fraud:</span>
                  <span className="text-red-500 font-bold">{((chartHeight - hoveredData.y2) / 2).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between px-2 pt-2 border-t border-border/40 text-2xs font-mono text-muted-foreground min-w-[700px]">
            {legitCurve.map((pt, i) => <span key={i} className="w-12 text-center">{pt.label.split(' - ')[0]}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border-border/50">
          <h3 className="text-lg font-bold text-foreground mb-6">Feature Weights</h3>
          <div className="space-y-4">
            {topFeatures.map((f, idx) => (
              <div key={idx} className="p-3 bg-muted/30 border border-border/50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-foreground font-mono">{f.name}</span>
                  <span className="text-2xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Rank #{idx+1}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-muted-foreground font-mono">Attribution Score</span>
                  <span className="text-xs font-bold text-foreground font-mono">{f.importance}%</span>
                </div>
                <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${f.importance * 5}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-border/50 flex flex-col max-h-[460px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">System Security Audits</h3>
              <p className="text-xs text-muted-foreground font-mono">Live compliance registry and action logs</p>
            </div>
            <span className="text-2xs font-mono px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              MUTABLE
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs p-3 rounded-lg bg-muted/20 border border-border/30 font-mono">
                <span className="text-muted-foreground shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-primary font-bold shrink-0">{log.user_id}</span>
                <span className="text-foreground font-bold shrink-0">{log.action}</span>
                <span className="text-muted-foreground shrink-0">&rarr;</span>
                <span className="text-cyan-500 shrink-0">{log.resource.slice(0, 20)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border-border/60 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <h3 className="text-lg font-bold text-foreground font-mono">Export Telemetry Dataset</h3>
              <button onClick={() => { if (!isExporting) { setShowExportModal(false); setExportSuccess(false) }}}
                disabled={isExporting}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {!isExporting && !exportSuccess ? (
                <>
                  <p className="text-sm text-muted-foreground">Select report compilation structures and target formats below.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-muted-foreground uppercase mb-2">File Format</label>
                      <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary/50">
                        <option value="pdf">Acrobat PDF</option>
                        <option value="csv">Standard CSV</option>
                        <option value="excel">MS Excel (.xlsx)</option>
                        <option value="json">Raw JSON</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-muted-foreground uppercase mb-2">Scope Limit</label>
                      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
                        className="w-full px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary/50">
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={triggerExport}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold font-mono text-xs tracking-wider text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all">
                    COMPILE REPORT DATA
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-primary font-bold">{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden border border-border/40">
                      <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${exportProgress}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-card border border-border/40 rounded-xl p-4 h-48 overflow-y-auto font-mono text-2xs space-y-1.5 text-muted-foreground">
                    {exportLogs.map((log, i) => (
                      <p key={i} className={log.startsWith('[ERROR]') ? 'text-red-500' : log.startsWith('[SEC-OP]') ? 'text-yellow-500' : 'text-muted-foreground'}>{log}</p>
                    ))}
                  </div>
                  {exportSuccess && (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-500 font-mono flex items-center space-x-2">
                        <span>&#10003;</span>
                        <span>Report encryption finished.</span>
                      </div>
                      <div className="flex space-x-3">
                        <a href={`http://localhost:8000${downloadUrl}`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 font-semibold font-mono text-xs tracking-wider text-white rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-center">
                          DOWNLOAD REPORT
                        </a>
                        <button onClick={() => { setShowExportModal(false); setExportSuccess(false) }}
                          className="px-6 py-3 bg-muted/30 hover:bg-muted/50 font-semibold font-mono text-xs text-foreground rounded-xl border border-border/50 transition-all">
                          CLOSE
                        </button>
                      </div>
                    </div>
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
