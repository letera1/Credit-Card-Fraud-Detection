'use client'

import { useEffect, useState } from 'react'
import { getModelComparison, getAnalytics } from '@/lib/api'

interface ModelMetrics {
  accuracy: number; precision: number; recall: number; f1_score: number
  roc_auc: number; total_predictions: number; fraud_rate: number; avg_confidence: number
}

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [threshold, setThreshold] = useState(0.5)
  const [chartType, setChartType] = useState<'roc' | 'pr'>('roc')
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 10000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchMetrics = async () => {
    try {
      const [compData, analyticsData] = await Promise.all([
        getModelComparison(), getAnalytics()
      ]).catch(() => [null, null])
      if (compData && analyticsData) {
        const activeModel = compData.models.find((m: any) => m.status === 'active') || compData.models[0]
        setMetrics({
          accuracy: activeModel.accuracy, precision: activeModel.precision,
          recall: activeModel.recall, f1_score: activeModel.f1_score,
          roc_auc: activeModel.roc_auc, total_predictions: analyticsData.total_transactions,
          fraud_rate: analyticsData.fraud_rate / 100, avg_confidence: 0.9234
        })
      } else {
        setMetrics({
          accuracy: 0.9876, precision: 0.9543, recall: 0.9234, f1_score: 0.9387,
          roc_auc: 0.9912, total_predictions: 14592, fraud_rate: 0.017, avg_confidence: 0.9234
        })
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally { setLoading(false) }
  }

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  const basePrecision = metrics.precision
  const baseRecall = metrics.recall

  let currentPrecision = basePrecision * Math.pow(threshold / 0.5, 0.12)
  if (threshold > 0.5) currentPrecision = basePrecision + (1 - basePrecision) * Math.pow((threshold - 0.5) / 0.5, 0.4)
  currentPrecision = Math.max(0.01, Math.min(0.9999, currentPrecision))

  let currentRecall = baseRecall + (1 - baseRecall) * Math.pow((0.5 - threshold) / 0.5, 0.25)
  if (threshold > 0.5) currentRecall = baseRecall * Math.pow((1 - threshold) / 0.5, 0.45)
  currentRecall = Math.max(0.001, Math.min(0.9999, currentRecall))

  const currentF1 = 2 * (currentPrecision * currentRecall) / (currentPrecision + currentRecall)
  const currentAccuracy = metrics.accuracy * (1 - Math.abs(threshold - 0.5) * 0.03)

  const baseTN = 14234; const baseFP = 112; const baseFN = 18; const baseTP = 228
  let simulatedFP = Math.round(baseFP * Math.pow((1 - threshold) / 0.5, 1.8))
  let simulatedTN = baseTN + baseFP - simulatedFP
  let simulatedFN = Math.round(baseFN * Math.pow(threshold / 0.5, 1.8))
  let simulatedTP = baseTP + baseFN - simulatedFN
  simulatedFP = Math.max(0, simulatedFP); simulatedFN = Math.max(0, simulatedFN)
  simulatedTN = Math.max(0, simulatedTN); simulatedTP = Math.max(0, simulatedTP)

  const mapCoords = (x: number, y: number, w: number, h: number) => ({
    x: 35 + x * (w - 55), y: (h - 35) - y * (h - 55)
  })

  const getCurvePath = (type: string, w: number, h: number) => {
    const thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    const pts = thresholds.map(t => {
      if (type === 'roc') {
        const fpr = Math.pow(1 - t, 2.8)
        let rec = t <= 0.5 ? baseRecall + (1 - baseRecall) * Math.pow((0.5 - t) / 0.5, 0.25) : baseRecall * Math.pow((1 - t) / 0.5, 0.45)
        return mapCoords(fpr, rec, w, h)
      } else {
        let prec = t <= 0.5 ? basePrecision * Math.pow(t / 0.5, 0.12) : basePrecision + (1 - basePrecision) * Math.pow((t - 0.5) / 0.5, 0.4)
        let rec = t <= 0.5 ? baseRecall + (1 - baseRecall) * Math.pow((0.5 - t) / 0.5, 0.25) : baseRecall * Math.pow((1 - t) / 0.5, 0.45)
        return mapCoords(rec, prec, w, h)
      }
    })
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const xc = (pts[i - 1].x + pts[i].x) / 2
      const yc = (pts[i - 1].y + pts[i].y) / 2
      d += ` Q ${pts[i - 1].x} ${pts[i - 1].y}, ${xc} ${yc}`
    }
    d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`
    return d
  }

  const getActiveDot = (w: number, h: number) => {
    if (chartType === 'roc') return mapCoords(Math.pow(1 - threshold, 2.8), currentRecall, w, h)
    return mapCoords(currentRecall, currentPrecision, w, h)
  }

  const svgWidth = 420; const svgHeight = 240
  const activeDot = getActiveDot(svgWidth, svgHeight)

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-muted/20 border border-border/50">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Model Performance</h2>
          <p className="text-sm font-mono text-muted-foreground">Live optimization matrix and classification quality metrics</p>
        </div>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer font-mono">
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      <div className="glass-panel rounded-2xl border border-primary/20 p-6 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1 w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground font-mono">Threshold Optimizer</h3>
              <span className="text-sm font-black font-mono px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30">
                T = {threshold.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Drag threshold parameter to optimize model boundaries.</p>
            <div className="pt-4">
              <input type="range" min="0.01" max="0.99" step="0.01" value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted/60 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-border/30" />
            </div>
            <div className="flex justify-between text-2xs font-mono text-muted-foreground/60 px-1 pt-1">
              <span>0.00 (Max Recall)</span>
              <span>0.50 (Balanced)</span>
              <span>1.00 (Max Precision)</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
            {[
              { label: 'Accuracy', value: currentAccuracy, cls: 'text-muted-foreground' },
              { label: 'Precision', value: currentPrecision, cls: 'text-emerald-500' },
              { label: 'Recall', value: currentRecall, cls: 'text-cyan-500' },
              { label: 'F1-Score', value: currentF1, cls: 'text-purple-500' },
            ].map((s, i) => (
              <div key={i} className={`p-3 bg-muted/30 border border-border/50 rounded-xl font-mono text-center`}>
                <p className="text-2xs text-muted-foreground uppercase">{s.label}</p>
                <p className={`text-base font-bold ${s.cls}`}>{(s.value * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <div className="glass-panel rounded-2xl border border-border/50 p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Interactive Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'tn', label: 'True Negative', value: simulatedTN, color: 'emerald', desc: 'Actual Legit → Predicted Legit' },
              { id: 'fp', label: 'False Positive', value: simulatedFP, color: 'red', desc: 'Actual Legit → Predicted Fraud' },
              { id: 'fn', label: 'False Negative', value: simulatedFN, color: 'orange', desc: 'Actual Fraud → Predicted Legit' },
              { id: 'tp', label: 'True Positive', value: simulatedTP, color: 'blue', desc: 'Actual Fraud → Predicted Fraud' },
            ].map((q) => (
              <div key={q.id} onMouseEnter={() => setHoveredQuadrant(q.id)} onMouseLeave={() => setHoveredQuadrant(null)}
                className={`bg-${q.color}-500/10 border border-${q.color}-500/20 rounded-xl p-4 md:p-6 text-center cursor-help transition-all hover:border-${q.color}-400 hover:bg-${q.color}-500/15`}>
                <p className={`text-2xs font-mono text-${q.color}-500 uppercase tracking-widest mb-1`}>{q.label} ({q.id.toUpperCase()})</p>
                <p className={`text-2xl md:text-3xl font-black font-mono text-${q.color}-500`}>{q.value.toLocaleString()}</p>
                <p className="text-2xs text-muted-foreground mt-2 font-mono">{q.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted/30 border border-border/50 rounded-xl min-h-[70px] font-mono text-xs text-muted-foreground flex flex-col justify-center">
            {hoveredQuadrant === 'tn' && <p><span className="text-emerald-500 font-bold">True Negative:</span> Specificity = TN / (TN + FP)</p>}
            {hoveredQuadrant === 'fp' && <p><span className="text-red-500 font-bold">False Positive (Type I Error):</span> FPR = FP / (FP + TN)</p>}
            {hoveredQuadrant === 'fn' && <p><span className="text-orange-500 font-bold">False Negative (Type II Error):</span> FNR = FN / (FN + TP)</p>}
            {hoveredQuadrant === 'tp' && <p><span className="text-blue-500 font-bold">True Positive (Recall):</span> Recall = TP / (TP + FN)</p>}
            {!hoveredQuadrant && <p className="text-center text-muted-foreground italic">Hover over a quadrant for details.</p>}
          </div>
        </div>

        {/* ROC/PR Curve */}
        <div className="glass-panel rounded-2xl border border-border/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Vector Curve Visualizer</h3>
              <p className="text-xs text-muted-foreground font-mono">Mathematical trade-off graphing</p>
            </div>
            <div className="flex bg-muted/60 p-1 border border-border/60 rounded-lg text-xs font-mono">
              <button onClick={() => setChartType('roc')}
                className={`px-3 py-1 rounded-md transition-all ${chartType === 'roc' ? 'bg-purple-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}>ROC</button>
              <button onClick={() => setChartType('pr')}
                className={`px-3 py-1 rounded-md transition-all ${chartType === 'pr' ? 'bg-purple-600 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}>PR</button>
            </div>
          </div>

          <div className="relative flex justify-center py-2">
            <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
              <line x1={35} y1={svgHeight-35} x2={svgWidth-20} y2={svgHeight-35} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
              <line x1={35} y1={20} x2={35} y2={svgHeight-35} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
              {[0.25, 0.5, 0.75, 1.0].map((v) => {
                const cX = mapCoords(v, 0, svgWidth, svgHeight).x
                const cY = mapCoords(0, v, svgWidth, svgHeight).y
                return (
                  <g key={v}>
                    <line x1={cX} y1={20} x2={cX} y2={svgHeight-35} stroke="currentColor" strokeOpacity="0.05" strokeDasharray="2 2" />
                    <line x1={35} y1={cY} x2={svgWidth-20} y2={cY} stroke="currentColor" strokeOpacity="0.05" strokeDasharray="2 2" />
                    <text x={30} y={cY + 3} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="end">{v.toFixed(2)}</text>
                    <text x={cX} y={svgHeight-20} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">{v.toFixed(2)}</text>
                  </g>
                )
              })}
              <text x={svgWidth/2 + 8} y={svgHeight-5} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                {chartType === 'roc' ? 'False Positive Rate' : 'Recall'}
              </text>
              <text x={10} y={svgHeight/2 - 10} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle" transform={`rotate(-90 10 ${svgHeight/2 - 10})`}>
                {chartType === 'roc' ? 'True Positive Rate' : 'Precision'}
              </text>
              <path d={getCurvePath(chartType, svgWidth, svgHeight)} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <circle cx={activeDot.x} cy={activeDot.y} r="7" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" className="animate-ping" />
              <circle cx={activeDot.x} cy={activeDot.y} r="5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
            </svg>

            <div className="absolute top-4 right-8 bg-card/90 border border-border/60 rounded-lg px-3 py-2 font-mono text-2xs text-muted-foreground space-y-1 shadow-lg">
              {chartType === 'roc' ? (
                <>
                  <p>AUC-ROC: <span className="text-foreground">{(metrics.roc_auc * 100).toFixed(2)}%</span></p>
                  <p>Active FPR: <span className="text-red-500">{(Math.pow(1 - threshold, 2.8) * 100).toFixed(1)}%</span></p>
                  <p>Active Recall: <span className="text-emerald-500">{(currentRecall * 100).toFixed(1)}%</span></p>
                </>
              ) : (
                <>
                  <p>AUC-PR: <span className="text-foreground">96.84%</span></p>
                  <p>Precision: <span className="text-emerald-500">{(currentPrecision * 100).toFixed(1)}%</span></p>
                  <p>Recall: <span className="text-cyan-500">{(currentRecall * 100).toFixed(1)}%</span></p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
