'use client'

import { useState } from 'react'
import PredictionForm from '@/components/PredictionForm'
import ResultCard from '@/components/ResultCard'
import { PageHeader } from '@/components/ui'
import type { PredictionResult } from '@/types'

export default function ScoringWorkbench() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Score transaction"
        description="Run one transaction through the serving model and see what drove its score."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <PredictionForm
          loading={loading}
          setLoading={setLoading}
          onResult={(next) => {
            setResult(next)
            setError(null)
          }}
          onError={setError}
        />
        <ResultCard result={result} error={error} loading={loading} />
      </div>
    </div>
  )
}
