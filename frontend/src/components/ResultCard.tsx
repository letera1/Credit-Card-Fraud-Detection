'use client'

import { PredictionResult } from '@/types'

interface ResultCardProps {
  result: PredictionResult
}

export default function ResultCard({ result }: ResultCardProps) {
  const isFraud = result.is_fraud
  
  // Dynamic styling based on fraud detection
  const borderColor = isFraud ? 'border-red-500/50' : 'border-green-500/30'
  const glowShadow = isFraud ? 'shadow-[0_0_50px_rgba(239,68,68,0.25)]' : 'shadow-[0_0_30px_rgba(34,197,94,0.1)]'
  const neonText = isFraud ? 'text-red-400 drop-shadow-[0_0_10px_currentColor]' : 'text-green-400 drop-shadow-[0_0_10px_currentColor]'
  const pulseAnim = isFraud ? 'animate-pulse-border' : ''

  // Mock SHAP values for UI if the API doesn't return them yet
  const mockShapValues = result.shap_explanation || {
    feature_names: ['V4', 'V14', 'V12', 'V10', 'V17'],
    shap_values: [0.85, 0.72, 0.65, 0.51, 0.44],
    base_value: 0.12
  }

  return (
    <div className={`glass-panel rounded-2xl p-8 relative overflow-hidden transition-all duration-500 border-2 ${borderColor} ${glowShadow} ${pulseAnim} flex flex-col h-full`}>
      
      {/* Intense Background Mesh for Fraud */}
      {isFraud && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] -z-10"></div>
          {/* Danger Stripes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] -z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px' }}></div>
        </>
      )}
      {!isFraud && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] -z-10"></div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center">
            Inference TXN ID
            <span className="ml-2 w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          </p>
          <p className="text-xl font-mono text-white tracking-tight">{result.transaction_id || "TXN-AUTO-GEN"}</p>
        </div>
        
        <div className={`px-4 py-2 rounded font-mono text-sm font-bold tracking-widest border border-current bg-current/10 ${neonText}`}>
          {isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE'}
        </div>
      </div>

      {/* Probability Ring & Score Row */}
      <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
        <div className="glass-panel border border-white/5 rounded-xl p-4 text-center group">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Model Confidence</p>
          <div className="flex items-end justify-center">
            <span className="text-4xl font-light tracking-tighter text-white mr-1">
              {(result.confidence * 100).toFixed(1)}
            </span>
            <span className="text-xl font-bold tracking-widest text-slate-500 mb-1">%</span>
          </div>
        </div>

        <div className="glass-panel border border-white/5 rounded-xl p-4 text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Threat Level</p>
          <p className={`text-3xl font-bold font-mono tracking-tight pt-1 ${isFraud ? 'text-red-400 drop-shadow-[0_0_8px_currentColor]' : 'text-slate-200'}`}>
            {result.risk_level || (isFraud ? 'CRITICAL' : 'LOW')}
          </p>
        </div>
      </div>

      {/* Action Recommendation */}
      <div className="glass-panel border border-white/5 rounded-xl p-4 mb-8 flex items-center space-x-4 relative z-10">
        <div className={`w-12 h-12 rounded flex items-center justify-center border bg-current/10 ${isFraud ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-green-500/20 border-green-500/50 text-green-400'}`}>
          {isFraud ? (
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          )}
        </div>
        <div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Recommended Action</p>
          <p className="text-white text-sm break-words pr-2">
            {result.recommended_action || (isFraud ? "BLOCK - Manual verification required immediately." : "APPROVE - No suspicious patterns detected.")}
          </p>
        </div>
      </div>

      {/* SHAP Feature Importance Visualization (Mock/Real) */}
      <div className="mt-auto pt-4 border-t border-white/10 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center">
            <svg className="w-3 h-3 mr-1.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            SHAP Explainability Vectors
          </p>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono">Top 5</span>
        </div>
        
        <div className="space-y-3">
          {mockShapValues.feature_names.map((feat: string, idx: number) => {
            const val = mockShapValues.shap_values[idx]
            const isPos = isFraud ? val > 0 : val < 0
            const percentage = Math.min(Math.abs(val) * 100, 100)
            const barColor = isPos ? (isFraud ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]') : 'bg-slate-600'
            const textColor = isPos ? (isFraud ? 'text-red-400' : 'text-green-400') : 'text-slate-400'

            return (
              <div key={idx} className="flex items-center text-xs font-mono">
                <span className="w-8 text-slate-400">{feat}</span>
                <div className="flex-1 mx-3 h-1.5 bg-black/40 rounded-full overflow-hidden relative border border-white/5">
                  <div 
                    className={`absolute top-0 bottom-0 ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%`, left: isPos ? '0%' : 'auto', right: isPos ? 'auto' : '0%' }}
                  />
                </div>
                <span className={`w-8 text-right ${textColor}`}>+{val.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      </div>
      
    </div>
  )
}
