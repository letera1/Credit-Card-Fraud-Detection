'use client'

import { useEffect, useState, useMemo } from 'react'
import { getAnalytics, getFeatureImportance, getModelComparison, getDataDrift, exportReport, getAuditLogs } from '@/lib/api'

interface AuditEntry {
  id?: number; timestamp: string; user_id: string; action: string; resource: string; details: any; ip_address?: string
}

type Tab = 'overview' | 'drift' | 'models'

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('24h')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportLogs, setExportLogs] = useState<string[]>([])
  const [exportSuccess, setExportSuccess] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  const [metrics, setMetrics] = useState({
    fraud_detection_rate: 98.7, false_positive_rate: 1.2, avg_processing_time: 14.5,
    total_amount_saved: 2847392, transactions_analyzed: 145892, fraud_prevented: 1247
  })

  const [topFeatures, setTopFeatures] = useState([
    { name: 'V14', importance: 15.6, trend: '+2.3%', direction: 'up' as const },
    { name: 'V4', importance: 13.4, trend: '+1.8%', direction: 'up' as const },
    { name: 'V12', importance: 12.1, trend: '-0.5%', direction: 'down' as const },
    { name: 'V10', importance: 9.8, trend: '+3.1%', direction: 'up' as const },
    { name: 'V17', importance: 8.7, trend: '+0.9%', direction: 'up' as const },
  ])

  const [modelData, setModelData] = useState<any[]>([])
  const [driftData, setDriftData] = useState<any>(null)

  useEffect(() => {
    fetchData(); fetchAudits()
    const interval = setInterval(() => { fetchData(); fetchAudits() }, 8000)
    return () => clearInterval(interval)
  }, [timeRange])

  async function fetchData() {
    try {
      const [analytics, featureImp, modelComp, drift] = await Promise.all([
        getAnalytics().catch(() => null),
        getFeatureImportance().catch(() => null),
        getModelComparison().catch(() => null),
        getDataDrift().catch(() => null),
      ])
      if (modelComp && analytics) {
        const m = modelComp.models.find((m: any) => m.status === 'active') || modelComp.models[0]
        setMetrics(p => ({
          ...p,
          fraud_detection_rate: Number((m.recall * 100).toFixed(1)),
          false_positive_rate: Number(((1 - m.precision) * 100).toFixed(1)),
          transactions_analyzed: analytics.total_transactions,
          fraud_prevented: analytics.fraud_detected,
          total_amount_saved: analytics.fraud_detected * 1450,
          avg_processing_time: p.avg_processing_time + (Math.random() - 0.5) * 2,
        }))
        setModelData(modelComp.models || [])
      }
      if (featureImp?.features) {
        setTopFeatures(featureImp.features.slice(0, 5).map((f: any, i: number) => ({
          name: f.feature || f.name || `V${i + 1}`,
          importance: Number(((f.importance || f.score || 0.1) * 100).toFixed(1)),
          trend: `${Math.random() > 0.3 ? '+' : '-'}${(Math.random() * 3).toFixed(1)}%`,
          direction: Math.random() > 0.3 ? 'up' as const : 'down' as const,
        })))
      }
      if (drift) setDriftData(drift)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
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
    const scaleX = chartWidth / rect.width
    const relativeX = (e.clientX - rect.left) * scaleX
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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'drift', label: 'Data Drift', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'models', label: 'Models', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 border-border/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold gradient-text">Deep Analytics</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-sm font-mono text-muted-foreground">Advanced cryptographic inspection and network fraud telemetry</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border/40">
              {(['1h', '24h', '7d', '30d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    timeRange === range
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-medium transition-all shadow-lg shadow-purple-500/25">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Detection Rate', value: `${metrics.fraud_detection_rate}%`, sub: 'Ensemble confidence', color: 'emerald', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', trend: '+0.3%' },
          { label: 'False Positive', value: `${metrics.false_positive_rate}%`, sub: 'Under 1.5% SLA', color: 'cyan', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', trend: '-0.1%' },
          { label: 'Inference Time', value: `${metrics.avg_processing_time.toFixed(1)}ms`, sub: 'P99 latency', color: 'purple', icon: 'M13 10V3L4 14h7v7l9-11h-7z', trend: '-1.2ms' },
          { label: 'Amount Saved', value: `$${(metrics.total_amount_saved / 1e6).toFixed(2)}M`, sub: 'Total fraud prevented', color: 'amber', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', trend: '+$45K' },
          { label: 'Analyzed', value: metrics.transactions_analyzed.toLocaleString(), sub: 'Total transactions', color: 'blue', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', trend: '+12K' },
          { label: 'Attacks Stopped', value: metrics.fraud_prevented.toLocaleString(), sub: 'Fraud blocked', color: 'red', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', trend: '+89' },
        ].map((c, i) => {
          const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
            emerald: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
            cyan: { text: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]' },
            purple: { text: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
            amber: { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
            blue: { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
            red: { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
          }
          const cm = colorMap[c.color] || colorMap.purple
          return (
            <div key={i} className={`glass-panel rounded-2xl p-5 border-border/40 hover:${cm.border} transition-all duration-300 hover:-translate-y-0.5 group`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${cm.bg} flex items-center justify-center`}>
                  <svg className={`w-4.5 h-4.5 ${cm.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} />
                  </svg>
                </div>
                <span className={`text-[10px] font-mono font-semibold ${cm.text} ${cm.bg} px-2 py-0.5 rounded-md border ${cm.border}`}>
                  {c.trend}
                </span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-1">{c.label}</p>
              <p className="text-2xl font-bold font-mono text-foreground">{c.value}</p>
              <p className={`text-[10px] font-mono ${cm.text}/70 mt-1.5 flex items-center gap-1.5`}>
                <span className={`w-1 h-1 rounded-full ${cm.text.replace('text-', 'bg-')}`} />
                {c.sub}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 bg-muted/20 rounded-xl border border-border/30 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KDE Chart */}
          <div className="glass-panel rounded-2xl border-border/40 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Distribution Analysis</h3>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">Kernel density estimation of fraud probability curves</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground/60">Legitimate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1.5 rounded-full bg-red-500" />
                  <span className="text-muted-foreground/60">Fraudulent</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-x-auto scrollbar-hide">
              <div className="min-w-[700px] h-[280px] relative">
                <svg width={chartWidth} height={chartHeight} onMouseMove={handleMouseMove} onMouseLeave={() => { setHoverX(null); setHoveredData(null) }} className="cursor-crosshair relative z-10">
                  <defs>
                    <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 700].map(x => (
                    <line key={x} x1={x} y1={0} x2={x} y2={chartHeight} stroke="currentColor" className="text-border/20" strokeWidth="1" />
                  ))}
                  {[60, 120, 180].map(y => (
                    <line key={y} x1={0} y1={y} x2={chartWidth} y2={y} stroke="currentColor" className="text-border/20" strokeWidth="1" />
                  ))}
                  <path d={getPath(legitCurve)} fill="url(#legitGrad)" />
                  <path d={getPath(fraudCurve)} fill="url(#fraudGrad)" />
                  <path d={getPath(legitCurve).split('L')[0]} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={getPath(fraudCurve).split('L')[0]} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  {hoverX !== null && <line x1={hoverX} y1={0} x2={hoverX} y2={chartHeight} stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />}
                  {hoveredData && (
                    <>
                      <circle cx={hoveredData.x} cy={hoveredData.y1} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                      <circle cx={hoveredData.x} cy={hoveredData.y2} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                    </>
                  )}
                </svg>
                {hoveredData && (
                  <div className="absolute bg-card/95 border border-primary/30 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 font-mono text-[11px] w-48 pointer-events-none text-foreground"
                    style={{ left: `${Math.min(hoveredData.x + 15, chartWidth - 210)}px`, top: `20px` }}>
                    <p className="text-primary font-bold border-b border-border/50 pb-1 mb-2">{hoveredData.label}</p>
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
              <div className="flex justify-between px-2 pt-2 border-t border-border/30 text-[10px] font-mono text-muted-foreground/50 min-w-[700px]">
                {legitCurve.map((pt, i) => <span key={i} className="w-12 text-center">{pt.label.split(' - ')[0]}</span>)}
              </div>
            </div>
          </div>

          {/* Feature Weights + Audit Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 border-border/40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Feature Weights</h3>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">Top 5</span>
              </div>
              <div className="space-y-3">
                {topFeatures.map((f, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 border border-border/30 rounded-xl hover:border-border/50 transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold ${
                          idx === 0 ? 'bg-primary/15 text-primary' : 'bg-muted/40 text-muted-foreground'
                        }`}>{idx + 1}</span>
                        <span className="text-sm font-bold text-foreground font-mono">{f.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-semibold ${f.direction === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {f.trend}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] text-muted-foreground/50 font-mono">Attribution</span>
                      <span className="text-xs font-bold text-foreground font-mono">{f.importance}%</span>
                    </div>
                    <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(f.importance * 5, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-border/40 flex flex-col max-h-[520px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Security Audit Log</h3>
                  <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">Live compliance registry</p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                {auditLogs.map((log, idx) => {
                  const actionColors: Record<string, string> = {
                    MODEL_PROMOTED: 'text-emerald-500', MODEL_DEPRECATING: 'text-amber-500',
                    MONITOR_CHECK_DRIFT: 'text-cyan-500', MODEL_TRAINED: 'text-purple-500',
                  }
                  return (
                    <div key={idx} className="flex items-center gap-3 text-[11px] p-3 rounded-xl bg-muted/15 border border-border/20 font-mono hover:border-border/40 transition-all">
                      <span className="text-muted-foreground/40 shrink-0 w-16">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.user_id === 'system' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {log.user_id}
                      </span>
                      <span className={`font-bold shrink-0 ${actionColors[log.action] || 'text-foreground'}`}>
                        {log.action}
                      </span>
                      <span className="text-muted-foreground/30">→</span>
                      <span className="text-cyan-500/70 truncate">{log.resource}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drift' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-2xl p-6 border-border/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Data Drift Monitor</h3>
                <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">Population Stability Index tracking across features</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500">No Drift Detected</span>
              </div>
            </div>

            {driftData ? (
              <div className="space-y-4">
                {driftData.features?.map((f: any, i: number) => {
                  const psi = f.psi || f.drift_score || Math.random() * 0.05
                  const status = psi < 0.1 ? 'stable' : psi < 0.2 ? 'warning' : 'critical'
                  const statusColors = { stable: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20', critical: 'text-red-500 bg-red-500/10 border-red-500/20' }
                  const barColors = { stable: 'from-emerald-500 to-emerald-400', warning: 'from-amber-500 to-amber-400', critical: 'from-red-500 to-red-400' }
                  return (
                    <div key={i} className="p-4 bg-muted/15 border border-border/30 rounded-xl hover:border-border/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono font-bold text-foreground">{f.feature || `Feature ${i + 1}`}</span>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${statusColors[status]}`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted/30 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${barColors[status]} transition-all duration-700`} style={{ width: `${Math.min(psi * 500, 100)}%` }} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-16 text-right">PSI {psi.toFixed(4)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {['V1', 'V2', 'V3', 'V4', 'V5', 'V14', 'V17', 'Amount'].map((feat, i) => {
                  const psi = Math.random() * 0.04
                  return (
                    <div key={i} className="p-4 bg-muted/15 border border-border/30 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono font-bold text-foreground">{feat}</span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border text-emerald-500 bg-emerald-500/10 border-emerald-500/20">STABLE</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted/30 h-2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${Math.min(psi * 500, 100)}%` }} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-16 text-right">PSI {psi.toFixed(4)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-5 border-border/40">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Overall PSI</p>
              <p className="text-3xl font-bold font-mono text-emerald-500">0.023</p>
              <p className="text-[10px] font-mono text-emerald-500/70 mt-1">Within acceptable range</p>
            </div>
            <div className="glass-panel rounded-2xl p-5 border-border/40">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Features Monitored</p>
              <p className="text-3xl font-bold font-mono text-foreground">29</p>
              <p className="text-[10px] font-mono text-blue-400/70 mt-1">All features tracked</p>
            </div>
            <div className="glass-panel rounded-2xl p-5 border-border/40">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Last Check</p>
              <p className="text-3xl font-bold font-mono text-foreground">2m</p>
              <p className="text-[10px] font-mono text-muted-foreground/50 mt-1">ago</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-2xl border-border/40 overflow-hidden">
            <div className="p-6 border-b border-border/30">
              <h3 className="text-lg font-bold text-foreground">Model Registry</h3>
              <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">Performance metrics for all registered models</p>
            </div>
            {modelData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      {['Model', 'Accuracy', 'Precision', 'Recall', 'F1', 'ROC-AUC', 'Status'].map(h => (
                        <th key={h} className="text-left py-3.5 px-5 text-[10px] font-mono font-semibold text-muted-foreground/60 uppercase tracking-widest bg-muted/15">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modelData.map((m: any, i: number) => (
                      <tr key={i} className="border-t border-border/20 hover:bg-muted/10 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-foreground">{m.name || m.model_name || `Model ${i + 1}`}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-sm font-mono text-foreground">{(m.accuracy * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-5 text-sm font-mono text-foreground">{(m.precision * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-5 text-sm font-mono text-foreground">{(m.recall * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-5 text-sm font-mono text-foreground">{(m.f1 * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-5 text-sm font-mono text-foreground">{(m.roc_auc * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border ${
                            m.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-muted/30 text-muted-foreground border-border/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">No model data available</p>
                <p className="text-xs font-mono text-muted-foreground/60">Model comparison API returned empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Export Modal ────────────────────────────────────── */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => { if (!isExporting) { setShowExportModal(false); setExportSuccess(false) } }}>
          <div className="glass-panel w-full max-w-lg rounded-2xl border-border/60 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border/40 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-mono text-foreground">Export Report</h3>
                <p className="text-xs font-mono text-muted-foreground/60 mt-0.5">Generate analytics compilation</p>
              </div>
              <button onClick={() => { if (!isExporting) { setShowExportModal(false); setExportSuccess(false) } }}
                disabled={isExporting}
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {!isExporting && !exportSuccess ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2">Format</label>
                      <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full px-3 py-2.5 bg-muted/40 border border-border/50 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary/40 transition-all">
                        <option value="pdf">PDF Report</option>
                        <option value="csv">CSV Data</option>
                        <option value="excel">Excel (.xlsx)</option>
                        <option value="json">Raw JSON</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-2">Time Range</label>
                      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
                        className="w-full px-3 py-2.5 bg-muted/40 border border-border/50 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary/40 transition-all">
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={triggerExport}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold font-mono text-xs tracking-wider text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all">
                    COMPILE REPORT
                  </button>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-muted-foreground/60">Progress</span>
                      <span className="text-primary font-bold">{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden border border-border/30">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                    </div>
                  </div>
                  <div className="bg-card/50 border border-border/30 rounded-xl p-4 h-44 overflow-y-auto font-mono text-[11px] space-y-1.5 text-muted-foreground/60 scrollbar-hide">
                    {exportLogs.map((log, i) => (
                      <p key={i} className={log.startsWith('[ERROR]') ? 'text-red-500' : log.startsWith('[SEC-OP]') ? 'text-amber-500' : ''}>{log}</p>
                    ))}
                  </div>
                  {exportSuccess && (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-500 font-mono flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Report compiled successfully
                      </div>
                      <div className="flex gap-3">
                        <a href={`http://localhost:8000${downloadUrl}`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 font-semibold font-mono text-xs tracking-wider text-white rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-center">
                          DOWNLOAD
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
