'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChartColumn } from 'lucide-react'
import { BarList, ColumnChart, type BarItem, type Column } from '@/components/charts'
import { buttonStyles, Card, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton } from '@/components/ui'
import { getTransactions } from '@/lib/api'
import { usePolling } from '@/lib/hooks'
import { DECISION_META, formatNumber, formatPercent, parseAction, RISK_LEVELS, RISK_META, riskLevelFor } from '@/lib/utils'
import type { Decision, TransactionRecord } from '@/types'

const fetchTransactions = () => getTransactions(500)

const MINUTE = 60_000
const BUCKETS = [
  { ms: MINUTE, label: 'minute' },
  { ms: 5 * MINUTE, label: '5 minutes' },
  { ms: 15 * MINUTE, label: '15 minutes' },
  { ms: 60 * MINUTE, label: 'hour' },
  { ms: 6 * 60 * MINUTE, label: '6 hours' },
  { ms: 24 * 60 * MINUTE, label: 'day' },
]
const MAX_COLUMNS = 24
const MIN_COLUMNS = 12

function buildActivity(transactions: TransactionRecord[]) {
  const times = transactions.map((tx) => new Date(tx.timestamp).getTime()).filter(Number.isFinite)
  if (!times.length) return { columns: [] as Column[], bucketLabel: 'minute' }
  const first = Math.min(...times)
  const last = Math.max(...times)
  const bucket = BUCKETS.find((b) => (last - first) / b.ms < MAX_COLUMNS) ?? BUCKETS[BUCKETS.length - 1]
  const lastStart = Math.floor(last / bucket.ms) * bucket.ms
  // Always show a window of at least MIN_COLUMNS buckets ending at the latest activity.
  const start = Math.min(Math.floor(first / bucket.ms) * bucket.ms, lastStart - (MIN_COLUMNS - 1) * bucket.ms)
  const count = Math.floor((lastStart - start) / bucket.ms) + 1
  const totals = new Array<number>(count).fill(0)
  const flagged = new Array<number>(count).fill(0)

  transactions.forEach((tx) => {
    const time = new Date(tx.timestamp).getTime()
    if (!Number.isFinite(time)) return
    const index = Math.floor((time - start) / bucket.ms)
    totals[index] += 1
    if (tx.is_fraud) flagged[index] += 1
  })

  const daily = bucket.ms >= 24 * 60 * MINUTE
  const columns: Column[] = totals.map((value, index) => {
    const date = new Date(start + index * bucket.ms)
    const label = daily
      ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    return { key: String(index), label, value, highlight: flagged[index], title: `${label}: ${value} scored, ${flagged[index]} flagged` }
  })
  return { columns, bucketLabel: bucket.label }
}

export default function AdvancedAnalytics() {
  const { data, error, loading, refresh } = usePolling(fetchTransactions, 10000)
  const transactions = useMemo(() => data?.transactions ?? [], [data])

  const charts = useMemo(() => {
    const total = transactions.length || 1
    const share = (n: number) => `${formatNumber(n)} · ${formatPercent(n / total, 0)}`

    const riskItems: BarItem[] = RISK_LEVELS.map((level) => {
      const value = transactions.filter((tx) => tx.risk_level === level).length
      return { key: level, label: RISK_META[level].label, value, display: share(value), barClassName: RISK_META[level].solid }
    })

    const bins = new Array<number>(10).fill(0)
    transactions.forEach((tx) => {
      bins[Math.min(9, Math.floor(tx.fraud_probability * 10))] += 1
    })
    const probability: Column[] = bins.map((value, i) => ({
      key: String(i),
      label: String(i * 10),
      value,
      title: `${i * 10}–${i * 10 + 10}%: ${value} transactions`,
      barClassName: RISK_META[riskLevelFor(i * 10)].solid,
    }))

    const decisions: Record<Decision, number> = { APPROVE: 0, REVIEW: 0, BLOCK: 0 }
    transactions.forEach((tx) => {
      decisions[parseAction(tx.recommended_action).decision] += 1
    })
    const decisionItems: BarItem[] = (Object.keys(decisions) as Decision[]).map((decision) => ({
      key: decision,
      label: DECISION_META[decision].label,
      value: decisions[decision],
      display: share(decisions[decision]),
      barClassName: DECISION_META[decision].solid,
    }))

    const flagCounts = new Map<string, number>()
    let unflagged = 0
    transactions.forEach((tx) => {
      if (!tx.anomaly_flags.length) unflagged += 1
      tx.anomaly_flags.forEach((flag) => flagCounts.set(flag, (flagCounts.get(flag) ?? 0) + 1))
    })
    const flagItems: BarItem[] = [
      ...[...flagCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([flag, value]) => ({ key: flag, label: flag, value, display: share(value), barClassName: 'bg-warning' })),
      { key: 'none', label: 'No flags', value: unflagged, display: share(unflagged), barClassName: 'bg-border-strong' },
    ]

    const featureStats = new Map<string, { total: number; count: number }>()
    let explained = 0
    transactions.forEach((tx) => {
      const features = tx.shap_explanation?.top_features
      if (!features?.length) return
      explained += 1
      features.forEach((feature) => {
        const stats = featureStats.get(feature.feature) ?? { total: 0, count: 0 }
        stats.total += Math.abs(feature.shap_value)
        stats.count += 1
        featureStats.set(feature.feature, stats)
      })
    })
    const featureItems: BarItem[] = [...featureStats.entries()]
      .map(([feature, stats]) => ({ feature, mean: stats.total / Math.max(1, explained), count: stats.count }))
      .sort((a, b) => b.mean - a.mean)
      .slice(0, 10)
      .map(({ feature, mean, count }) => ({
        key: feature,
        label: <span className="font-mono text-xs">{feature}</span>,
        value: mean,
        display: `${mean.toFixed(3)} · in top 5 for ${formatNumber(count)} of ${formatNumber(explained)}`,
      }))

    return { activity: buildActivity(transactions), riskItems, probability, decisionItems, flagItems, featureItems }
  }, [transactions])

  const description =
    data && data.total > transactions.length
      ? `Computed from the latest ${formatNumber(transactions.length)} of ${formatNumber(data.total)} scored transactions.`
      : 'Computed from every transaction scored since the API started. Updates every 10 seconds.'

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description={description} />

      {error && <ErrorState message={error} onRetry={refresh} />}

      {loading && !data ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      ) : !transactions.length ? (
        <Card>
          <EmptyState
            icon={ChartColumn}
            title="Nothing to analyze yet"
            description="Charts are computed from scored transactions. Score a few transactions or upload a batch to see distributions."
          >
            <Link href="/batch" className={buttonStyles({ variant: 'primary' })}>
              Batch scoring
            </Link>
            <Link href="/analyze" className={buttonStyles()}>
              Score transaction
            </Link>
          </EmptyState>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader
              title="Scoring activity"
              description={`Transactions scored per ${charts.activity.bucketLabel}`}
              action={
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-sm bg-primary" aria-hidden />
                    Scored
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-sm bg-danger" aria-hidden />
                    Flagged as fraud
                  </span>
                </div>
              }
            />
            <div className="p-5">
              <ColumnChart columns={charts.activity.columns} labelEvery={Math.max(1, Math.ceil(charts.activity.columns.length / 8))} />
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Risk levels" description="Share of transactions in each risk band" />
              <div className="p-5">
                <BarList items={charts.riskItems} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Fraud probability" description="Number of transactions in each 10-point probability band" />
              <div className="p-5">
                <ColumnChart columns={charts.probability} height={140} />
                <p className="mt-1 text-center text-xs text-subtle-foreground">Fraud probability (%)</p>
              </div>
            </Card>
            <Card>
              <CardHeader title="Decisions" description="Recommended action returned for each transaction" />
              <div className="p-5">
                <BarList items={charts.decisionItems} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Rule-based flags" description="A transaction can raise more than one flag" />
              <div className="p-5">
                <BarList items={charts.flagItems} />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Most influential features"
              description="Mean absolute SHAP value per transaction, from each transaction's top 5 contributing features"
            />
            <div className="p-5">
              {charts.featureItems.length ? (
                <BarList items={charts.featureItems} />
              ) : (
                <p className="text-13 text-subtle-foreground">No SHAP explanations were returned for these transactions.</p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
