'use client'

import { useState } from 'react'
import PredictionForm from '@/components/PredictionForm'
import ResultCard from '@/components/ResultCard'
import { PredictionResult } from '@/types'

export default function AnalyzePage() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="animate-in slide-in-from-bottom-4 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inference Stream Pipeline</h1>
          <p className="text-sm text-muted-foreground">Submit transaction data for real-time fraud evaluation.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <div className="h-full">
          <PredictionForm
            onResult={setResult}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        <div className="h-full flex flex-col">
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="glass-panel rounded-2xl border-border/50 flex-1 flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center animate-spin-slow">
                  <svg className="w-10 h-10 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <p className="text-sm font-mono font-semibold text-foreground mb-2 tracking-widest">AWAITING INGESTION</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Submit transaction data via the form on the left to see the AI-powered analysis and fraud detection results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
