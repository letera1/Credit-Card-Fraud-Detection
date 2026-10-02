'use client'

import { Fragment } from 'react'
import { Card, CardHeader, CopyButton, DecisionBadge, DescriptionList, ErrorState, PageHeader, RiskBadge, Skeleton, table } from '@/components/ui'
import { getHealth, getModelInfo } from '@/lib/api'
import { usePolling } from '@/lib/hooks'
import { cn, formatDateTime, RISK_META } from '@/lib/utils'
import type { Decision, RiskLevel } from '@/types'

const RETRAIN_COMMAND = 'python train_advanced_model.py'

// Mirrors the scoring rules in src/api/app.py.
const RISK_RULES: { level: RiskLevel; decisions: Decision[]; note?: string; alert: string }[] = [
  { level: 'LOW', decisions: ['APPROVE'], alert: 'No' },
  { level: 'MEDIUM', decisions: ['APPROVE', 'REVIEW'], note: 'Review when probability is above 50%', alert: 'When probability is above 50%' },
  { level: 'HIGH', decisions: ['REVIEW'], alert: 'Yes' },
  { level: 'CRITICAL', decisions: ['BLOCK'], alert: 'Yes' },
]

const FLAG_RULES = [
  { flag: 'Unusually high transaction amount', rule: 'Scaled_Amount > 2.0' },
  { flag: 'Abnormal PCA feature values', rule: 'abs(V1) > 2.5 or abs(V2) > 2.5' },
  { flag: 'Late-night transaction', rule: 'Time > 140,000 seconds' },
]

const GROUP_LABELS: Record<string, string> = {
  time_features: 'Time',
  amount_features: 'Amount',
  statistical_features: 'Statistical',
  interaction_features: 'Interaction',
  anomaly_features: 'Anomaly',
}

function FeatureChips({ features }: { features: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {features.map((feature) => (
        <span key={feature} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {feature}
        </span>
      ))}
    </div>
  )
}

export default function ModelInfo() {
  const info = usePolling(getModelInfo, 0)
  const health = usePolling(getHealth, 30000)
  const data = info.data

  const engineered = Object.entries(data?.feature_engineering ?? {})
  const engineeredSet = new Set(engineered.flatMap(([, features]) => features))
  const rawFeatures = (data?.feature_names ?? []).filter((feature) => !engineeredSet.has(feature))

  return (
    <div className="space-y-6">
      <PageHeader title="Model details" description="What serves predictions, how scores become decisions, and which features the model reads." />

      {info.error && <ErrorState message={info.error} onRetry={info.refresh} />}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader title="Serving model" description="Loaded by the API at startup" />
          <div className="px-5 pb-2 pt-3">
            {data ? (
              <DescriptionList
                items={[
                  { label: 'Model', value: data.serving_model ?? 'Not loaded' },
                  { label: 'API version', value: data.version },
                  { label: 'Decision threshold', value: `Fraud above ${(data.decision_threshold * 100).toFixed(0)}% probability` },
                  {
                    label: 'Explanations',
                    value: health.data ? (health.data.shap_available ? 'SHAP TreeExplainer' : 'Unavailable') : '—',
                  },
                  {
                    label: 'Ensemble artifacts',
                    value: data.ensemble_members.length ? `${data.ensemble_members.join(', ')} (reporting only)` : 'Not loaded',
                  },
                  { label: 'Input features', value: <span className="tabular-nums">{data.feature_names.length || '—'}</span> },
                  { label: 'Last trained', value: formatDateTime(data.training_date) },
                ]}
              />
            ) : (
              <div className="space-y-3 py-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-6" />
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Retraining" description="Training runs offline, outside the API." />
          <div className="space-y-4 p-5 text-13 text-muted-foreground">
            <p>Generate new artifacts, then restart the API so it loads them.</p>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background py-1 pl-3 pr-1">
              <code className="truncate font-mono text-xs text-foreground">
                <span className="select-none text-subtle-foreground">$ </span>
                {RETRAIN_COMMAND}
              </code>
              <CopyButton value={RETRAIN_COMMAND} label="Copy command" />
            </div>
            <p className="text-xs text-subtle-foreground">Writes the model files in models/ and the evaluation report in reports/.</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Scoring rules" description="Risk score = fraud probability × 100. Alerts are raised for fraud or a score of 60 or higher." />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-13">
            <thead>
              <tr className={table.headRow}>
                <th scope="col" className={table.th}>Risk level</th>
                <th scope="col" className={table.th}>Score</th>
                <th scope="col" className={table.th}>Decision</th>
                <th scope="col" className={table.th}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {RISK_RULES.map((rule) => (
                <tr key={rule.level} className={table.row}>
                  <td className={table.td}>
                    <RiskBadge level={rule.level} />
                  </td>
                  <td className={cn(table.td, 'tabular-nums text-foreground')}>{RISK_META[rule.level].range}</td>
                  <td className={table.td}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {rule.decisions.map((decision, index) => (
                        <Fragment key={decision}>
                          {index > 0 && <span className="text-subtle-foreground">or</span>}
                          <DecisionBadge decision={decision} />
                        </Fragment>
                      ))}
                      {rule.note && <span className="text-xs text-subtle-foreground">{rule.note}</span>}
                    </div>
                  </td>
                  <td className={cn(table.td, 'text-muted-foreground')}>{rule.alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Rule-based flags" description="Shown alongside the score for context. They don't change the model's output." />
        <ul className="mt-2 divide-y divide-border px-5 pb-2">
          {FLAG_RULES.map((item) => (
            <li key={item.flag} className="flex flex-col gap-1 py-3 text-13 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-foreground">{item.flag}</span>
              <code className="font-mono text-xs text-muted-foreground">{item.rule}</code>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Features"
          description={data ? `${data.feature_names.length} model inputs: ${rawFeatures.length} from the request and ${engineeredSet.size} engineered by the API` : 'Model inputs'}
        />
        <div className="space-y-5 p-5">
          {data ? (
            <>
              <div>
                <h3 className="mb-2 text-13 font-medium text-foreground">Request fields</h3>
                <FeatureChips features={rawFeatures} />
              </div>
              {engineered.map(([group, features]) => (
                <div key={group}>
                  <h3 className="mb-2 text-13 font-medium text-foreground">{GROUP_LABELS[group] ?? group}</h3>
                  <FeatureChips features={features} />
                </div>
              ))}
            </>
          ) : (
            <Skeleton className="h-24" />
          )}
        </div>
      </Card>
    </div>
  )
}
