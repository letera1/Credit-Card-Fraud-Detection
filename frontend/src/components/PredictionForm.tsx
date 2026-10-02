'use client'

import { useState, type FormEvent } from 'react'
import { Braces, LoaderCircle, ScanSearch } from 'lucide-react'
import { Button, Card, CardHeader, Kbd } from '@/components/ui'
import { getErrorMessage, predictTransaction } from '@/lib/api'
import { useModifierKey } from '@/lib/hooks'
import { SAMPLES, validateTransaction, type Sample } from '@/lib/samples'
import { cn, RISK_META } from '@/lib/utils'
import type { PredictionResult } from '@/types'

interface PredictionFormProps {
  loading: boolean
  setLoading: (loading: boolean) => void
  onResult: (result: PredictionResult) => void
  onError: (message: string) => void
}

const pretty = (value: unknown) => JSON.stringify(value, null, 2)

export default function PredictionForm({ loading, setLoading, onResult, onError }: PredictionFormProps) {
  const [payload, setPayload] = useState(() => pretty(SAMPLES[0].data))
  const [selectedSample, setSelectedSample] = useState<string | null>(SAMPLES[0].id)
  const [validationError, setValidationError] = useState<string | null>(null)
  const modifier = useModifierKey()

  const loadSample = (sample: Sample) => {
    setPayload(pretty(sample.data))
    setSelectedSample(sample.id)
    setValidationError(null)
  }

  const parsePayload = (): unknown => {
    try {
      return JSON.parse(payload)
    } catch (error) {
      setValidationError(`Invalid JSON: ${(error as Error).message}`)
      return undefined
    }
  }

  const formatPayload = () => {
    const parsed = parsePayload()
    if (parsed === undefined) return
    setPayload(pretty(parsed))
    setValidationError(null)
  }

  const submit = async (event?: FormEvent) => {
    event?.preventDefault()
    if (loading) return
    const parsed = parsePayload()
    if (parsed === undefined) return
    const validation = validateTransaction(parsed)
    if (!validation.ok) {
      setValidationError(validation.error)
      return
    }
    setValidationError(null)
    setLoading(true)
    try {
      onResult(await predictTransaction(validation.data))
    } catch (error) {
      onError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader title="Transaction" description="Start from a sample or paste a transaction as JSON." />
      <form onSubmit={submit} className="flex flex-1 flex-col">
        <div className="space-y-5 p-5">
          <fieldset>
            <legend className="mb-2 text-13 font-medium text-foreground">Samples</legend>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLES.map((sample) => {
                const active = selectedSample === sample.id
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => loadSample(sample)}
                    aria-pressed={active}
                    className={cn(
                      'focus-ring flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-13 font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary/5 text-foreground ring-1 ring-inset ring-primary'
                        : 'border-border-strong bg-surface text-muted-foreground hover:bg-hover hover:text-foreground',
                    )}
                  >
                    <span className={cn('size-2 shrink-0 rounded-full', RISK_META[sample.level].solid)} aria-hidden />
                    {sample.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor="transaction-payload" className="text-13 font-medium text-foreground">
                Payload
              </label>
              <Button variant="ghost" size="sm" onClick={formatPayload}>
                <Braces />
                Format
              </Button>
            </div>
            <textarea
              id="transaction-payload"
              value={payload}
              onChange={(event) => {
                setPayload(event.target.value)
                setSelectedSample(null)
              }}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit()
              }}
              spellCheck={false}
              aria-invalid={!!validationError}
              aria-describedby="payload-help"
              className={cn(
                'h-80 w-full resize-y rounded-lg border bg-background px-3 py-2.5 font-mono text-xs leading-5 text-foreground shadow-xs focus:outline-none focus:ring-4',
                validationError
                  ? 'border-danger focus:border-danger focus:ring-danger/15'
                  : 'border-border-strong focus:border-ring focus:ring-ring/15',
              )}
            />
            <p id="payload-help" className={cn('mt-2 text-xs', validationError ? 'text-danger-fg' : 'text-subtle-foreground')}>
              {validationError ?? 'Needs Time, V1–V28 and Scaled_Amount. The amount must already be standardized.'}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <span className="hidden items-center gap-1 text-xs text-subtle-foreground sm:inline-flex">
            <Kbd>{modifier}</Kbd>
            <Kbd>Enter</Kbd>
            <span className="ml-1">to score</span>
          </span>
          <Button type="submit" variant="primary" disabled={loading} className="ml-auto">
            {loading ? <LoaderCircle className="animate-spin" /> : <ScanSearch />}
            {loading ? 'Scoring…' : 'Score transaction'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
