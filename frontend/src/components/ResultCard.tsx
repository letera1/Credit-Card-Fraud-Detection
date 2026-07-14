'use client'

import { PredictionResult } from '@/types'

interface ResultCardProps {
  result: PredictionResult
}

const riskConfig: Record<string, { color: string; border: string; glow: string; label: string; badge: string; bg: string }> = {
  CRITICAL: {
    color: 'text-red-400',
    border: 'border-red-500/50',
    glow: 'shadow-[0_0_50px_rgba(239,68,68,0.25)]',
    label: 'CRITICAL',
    badge: 'bg-red-500/15 border-red-500/30 text-red-400',
    bg: 'bg-red-600/15',
  },
  HIGH: {
    color: 'text-orange-400',
    border: 'border-orange-500/50',
    glow: 'shadow-[0_0_50px_rgba(249,115,22,0.2)]',
    label: 'HIGH',
    badge: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    bg: 'bg-orange-600/12',
  },
  MODERATE: {
    color: 'text-yellow-400',
    border: 'border-yellow-500/40',
    glow: 'shadow-[0_0_40px_rgba(234,179,8,0.15)]',
    label: 'MODERATE',
    badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
    bg: 'bg-yellow-600/10',
  },
  MEDIUM: {
    color: 'text-yellow-400',
    border: 'border-yellow-500/40',
    glow: 'shadow-[0_0_40px_rgba(234,179,8,0.15)]',
    label: 'MODERATE',
    badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
    bg: 'bg-yellow-600/10',
  },
  LOW: {
    color: 'text-green-400',
    border: 'border-green-500/30',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.1)]',
    label: 'LOW',
    badge: 'bg-green-500/15 border-green-500/30 text-green-400',
    bg: 'bg-green-600/8',
  },
}

export default function ResultCard({ result }: ResultCardProps) {
  const isFraud = result.is_fraud
  const riskLevel = result.risk_level || (isFraud ? 'CRITICAL' : 'LOW')
  const normalizedRisk = riskLevel.toUpperCase()
  const risk = riskConfig[normalizedRisk] || riskConfig['LOW']

  const mockShapValues = result.shap_explanation || {
    feature_names: ['V14', 'V4', 'V12', 'V10', 'V17'],
    shap_values: [0.85, 0.72, 0.65, 0.51, 0.44],
    base_value: 0.12
  }

  return (
    <div className={`glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 border-2 ${risk.border} ${risk.glow} flex flex-col h-full`}>
      {isFraud && (
        <>
          <div className={`absolute top-0 right-0 w-64 h-64 ${risk.bg} rounded-full blur-[100px] -z-10`} />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] -z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px' }} />
        </>
      )}
      {!isFraud && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -z-10" />
      )}

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-2 flex items-center">
            Inference TXN ID
            <span className="ml-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          </p>
          <p className="text-xl font-mono text-foreground tracking-tight">{result.transaction_id || "TXN-AUTO-GEN"}</p>
        </div>
        <div className={`px-4 py-2 rounded font-mono text-sm font-bold border border-current bg-current/5 ${risk.color}`}>
          {isFraud ? 'FRAUD' : 'LEGITIMATE'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
        <div className="glass-panel border border-border/40 rounded-xl p-4 text-center">
          <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Model Confidence</p>
          <div className="flex items-end justify-center">
            <span className="text-4xl font-light text-foreground">
              {(result.confidence * 100).toFixed(1)}
            </span>
            <span className="text-xl text-muted-foreground mb-1 ml-1">%</span>
          </div>
        </div>
        <div className="glass-panel border border-border/40 rounded-xl p-4 text-center">
          <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Risk Classification</p>
          <p className={`text-3xl font-bold tracking-tight pt-1 ${risk.color} drop-shadow-[0_0_8px_currentColor]`}>
            {risk.label}
          </p>
          {result.risk_score !== undefined && (
            <p className="text-xs font-mono text-muted-foreground mt-1">Score: {result.risk_score}/100</p>
          )}
        </div>
      </div>

      <div className="glass-panel border border-border/40 rounded-xl p-4 mb-8 flex items-center space-x-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${isFraud ? `${risk.bg} ${risk.border}` : 'bg-green-500/10 border-green-500/30'}`}>
          {isFraud ? (
            <svg className={`w-6 h-6 ${risk.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 014 0 2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 22a9 9 0 100-18 9 9 0 000 18z" /></svg>
          )}
        </div>
        <div>
          <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Recommended Action</p>
          <p className="text-foreground text-sm">
            {result.recommended_action || (isFraud ? 'BLOCK - Manual verification required.' : 'APPROVE - No suspicious patterns.')}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border/40 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            SHAP Explainability
          </p>
          <span className="text-2xs bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono">Top 5</span>
        </div>
        <div className="space-y-3">
          {mockShapValues.feature_names.map((feat: string, idx: number) => {
            const val = mockShapValues.shap_values[idx]
            const isPos = isFraud ? val > 0 : val < 0
            const percentage = Math.min(Math.abs(val) * 100, 100)
            const barColor = isPos ? (isFraud ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]') : 'bg-muted'

            return (
              <div key={idx} className="flex items-center text-xs font-mono">
                <span className="w-8 text-muted-foreground">{feat}</span>
                <div className="flex-1 mx-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-muted-foreground">+{val.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
