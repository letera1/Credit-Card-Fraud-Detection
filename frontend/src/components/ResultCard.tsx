'use client'

import { ScanSearch, ShieldAlert, ShieldCheck, ShieldX, TriangleAlert } from 'lucide-react'
import { ShapChart } from '@/components/charts'
import RiskScoreCard from '@/components/RiskScoreCard'
import { Callout, Card, CardHeader, CopyButton, DescriptionList, EmptyState, RiskBadge, Skeleton } from '@/components/ui'
import { cn, DECISION_META, formatDateTime, formatPercent, parseAction } from '@/lib/utils'
import type { PredictionResult } from '@/types'

const DECISION_ICONS = { APPROVE: ShieldCheck, REVIEW: ShieldAlert, BLOCK: ShieldX }

export function PredictionDetails({ result }: { result: PredictionResult }) {
  const { decision, detail } = parseAction(result.recommended_action)
  const meta = DECISION_META[decision]
  const Icon = DECISION_ICONS[decision]
  const shapFeatures = result.shap_explanation?.top_features ?? []

  const metrics = [
    { label: 'Risk score', value: String(result.risk_score), suffix: '/100' },
    { label: 'Fraud probability', value: formatPercent(result.fraud_probability, 2) },
    { label: 'Confidence', value: formatPercent(result.confidence) },
    { label: 'Threshold', value: result.threshold.toFixed(2) },
  ]

  return (
    <div className="space-y-6">
      <div className={cn('flex items-start gap-3 rounded-lg px-4 py-3.5 ring-1 ring-inset', meta.bg, meta.ring)}>
        <Icon className={cn('mt-0.5 size-5 shrink-0', meta.text)} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-semibold', meta.text)}>{meta.label}</p>
          {detail && <p className="mt-0.5 text-13 text-muted-foreground">{detail}</p>}
        </div>
        <RiskBadge level={result.risk_level} />
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-surface px-4 py-3">
            <dt className="text-xs text-muted-foreground">{metric.label}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
              {metric.value}
              {metric.suffix && <span className="ml-0.5 text-xs font-normal text-subtle-foreground">{metric.suffix}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <section>
        <h3 className="mb-3 text-13 font-medium text-foreground">Risk score</h3>
        <RiskScoreCard score={result.risk_score} />
      </section>

      <section>
        <h3 className="text-13 font-medium text-foreground">Rule-based flags</h3>
        {result.anomaly_flags.length ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {result.anomaly_flags.map((flag) => (
              <li
                key={flag}
                className="inline-flex items-center gap-1.5 rounded-md bg-warning/10 px-2 py-1 text-xs font-medium text-warning-fg ring-1 ring-inset ring-warning/25"
              >
                <TriangleAlert className="size-3.5" aria-hidden />
                {flag}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-13 text-subtle-foreground">No rule-based flags were raised.</p>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-13 font-medium text-foreground">Top contributing features</h3>
          <span className="text-xs text-subtle-foreground">SHAP values, log-odds</span>
        </div>
        {shapFeatures.length ? (
          <>
            <p className="mt-1 text-xs text-subtle-foreground">Red pushes the score toward fraud, green toward legitimate.</p>
            <ShapChart features={shapFeatures} className="mt-4" />
          </>
        ) : (
          <p className="mt-1 text-13 text-subtle-foreground">No explanation is available for this prediction.</p>
        )}
      </section>

      <DescriptionList
        className="border-t border-border"
        items={[
          {
            label: 'Transaction ID',
            value: (
              <span className="inline-flex items-center gap-1">
                <span className="truncate font-mono text-xs">{result.transaction_id}</span>
                <CopyButton value={result.transaction_id} label="Copy transaction ID" />
              </span>
            ),
          },
          { label: 'Scored at', value: formatDateTime(result.timestamp) },
          { label: 'Model version', value: result.model_version },
        ]}
      />
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="h-[74px] rounded-lg" />
      <Skeleton className="h-10" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    </div>
  )
}

export default function ResultCard({
  result,
  error,
  loading,
}: {
  result: PredictionResult | null
  error: string | null
  loading: boolean
}) {
  return (
    <Card aria-busy={loading}>
      <CardHeader title="Result" description={result ? 'Scored by the serving model' : 'The model output appears here'} />
      <div className="p-5" aria-live="polite">
        {error && (
          <Callout tone="danger" title="Scoring failed" className="mb-5">
            {error}
          </Callout>
        )}
        {result ? (
          <div className={cn('transition-opacity', loading && 'opacity-60')}>
            <PredictionDetails result={result} />
          </div>
        ) : loading ? (
          <ResultSkeleton />
        ) : (
          !error && (
            <EmptyState
              icon={ScanSearch}
              title="No result yet"
              description="Pick a sample or paste a transaction, then select Score transaction."
              className="py-24"
            />
          )
        )}
      </div>
    </Card>
  )
}
