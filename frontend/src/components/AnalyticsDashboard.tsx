'use client'

import Link from 'next/link'
import { ArrowLeftRight, ArrowRight, Bell, BellOff, Gauge, Layers, ScanSearch, ShieldAlert } from 'lucide-react'
import FraudDistributionChart from '@/components/FraudDistributionChart'
import {
  buttonStyles,
  Card,
  CardHeader,
  DecisionLabel,
  EmptyState,
  ErrorState,
  PageHeader,
  RiskBadge,
  Skeleton,
  StatCard,
  table,
} from '@/components/ui'
import { getAlerts, getAnalytics, getTransactions } from '@/lib/api'
import { usePolling } from '@/lib/hooks'
import { cn, formatDateTime, formatNumber, formatPercent, formatRelativeTime, parseAction } from '@/lib/utils'

const fetchTransactions = () => getTransactions(500)

export default function AnalyticsDashboard() {
  const analytics = usePolling(getAnalytics, 10000)
  const transactions = usePolling(fetchTransactions, 10000)
  const alerts = usePolling(getAlerts, 10000)

  const data = analytics.data
  const recent = [...(data?.recent_transactions ?? [])].reverse().slice(0, 8)
  const activeAlerts = (alerts.data?.alerts ?? []).filter((alert) => alert.status === 'active').slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Scoring activity since the API started. Updates every 10 seconds."
        actions={
          <>
            <Link href="/batch" className={buttonStyles()}>
              <Layers />
              Batch scoring
            </Link>
            <Link href="/analyze" className={buttonStyles({ variant: 'primary' })}>
              <ScanSearch />
              Score transaction
            </Link>
          </>
        }
      />

      {analytics.error && <ErrorState message={analytics.error} onRetry={analytics.refresh} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data ? (
          <>
            <StatCard
              label="Transactions scored"
              icon={ArrowLeftRight}
              value={formatNumber(data.total_transactions)}
              hint={`${formatNumber(data.high_risk_transactions)} scored high or critical`}
            />
            <StatCard
              label="Flagged as fraud"
              icon={ShieldAlert}
              value={formatNumber(data.fraud_detected)}
              hint={`${data.fraud_rate.toFixed(1)}% of scored transactions`}
            />
            <StatCard label="Average risk score" icon={Gauge} value={data.avg_risk_score.toFixed(1)} hint="On a scale of 0 to 100" />
            <StatCard
              label="Active alerts"
              icon={Bell}
              value={formatNumber(data.alerts_active)}
              hint={data.alerts_active ? 'Waiting for review' : 'Nothing to review'}
            />
          </>
        ) : (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[118px] rounded-xl" />)
        )}
      </div>

      {data?.total_transactions === 0 && (
        <Card>
          <EmptyState
            icon={ScanSearch}
            title="No transactions scored yet"
            description="Score a single transaction or upload a batch file. Results appear here as soon as the API returns them."
          >
            <Link href="/analyze" className={buttonStyles({ variant: 'primary' })}>
              Score transaction
            </Link>
            <Link href="/batch" className={buttonStyles()}>
              Batch scoring
            </Link>
          </EmptyState>
        </Card>
      )}

      {!!data?.total_transactions && (
        <>
          <div className="grid gap-6 xl:grid-cols-3">
            {transactions.data ? (
              <FraudDistributionChart
                className="xl:col-span-2"
                transactions={transactions.data.transactions}
                total={transactions.data.total}
              />
            ) : (
              <Skeleton className="h-56 rounded-xl xl:col-span-2" />
            )}

            <Card className="flex flex-col">
              <CardHeader
                title="Active alerts"
                description="Most recent first"
                action={
                  <Link href="/alerts" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                    View all
                    <ArrowRight />
                  </Link>
                }
              />
              {activeAlerts.length ? (
                <ul className="mt-2 divide-y divide-border px-5 pb-2">
                  {activeAlerts.map((alert) => (
                    <li key={alert.alert_id} className="flex items-center gap-3 py-3">
                      <RiskBadge level={alert.severity} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs text-foreground">{alert.transaction_id}</p>
                        <p className="text-xs text-subtle-foreground">Risk score {alert.risk_score}</p>
                      </div>
                      <time className="shrink-0 text-xs text-subtle-foreground" dateTime={alert.timestamp} title={formatDateTime(alert.timestamp)}>
                        {formatRelativeTime(alert.timestamp)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={BellOff}
                  title="No active alerts"
                  description="Alerts are raised when a transaction is flagged as fraud or scores 60 or higher."
                  className="flex-1 py-10"
                />
              )}
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Recent transactions"
              description={`Latest ${recent.length} scored`}
              action={
                <Link href="/history" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                  View all
                  <ArrowRight />
                </Link>
              }
            />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-13">
                <thead>
                  <tr className={table.headRow}>
                    <th scope="col" className={table.th}>Transaction</th>
                    <th scope="col" className={table.th}>Scored</th>
                    <th scope="col" className={table.th}>Risk level</th>
                    <th scope="col" className={cn(table.th, 'text-right')}>Risk score</th>
                    <th scope="col" className={cn(table.th, 'text-right')}>Probability</th>
                    <th scope="col" className={table.th}>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx) => (
                    <tr key={tx.transaction_id} className={table.row}>
                      <td className={cn(table.td, 'font-mono text-xs text-foreground')}>{tx.transaction_id}</td>
                      <td className={cn(table.td, 'text-muted-foreground')}>
                        <time dateTime={tx.timestamp} title={formatDateTime(tx.timestamp)}>
                          {formatRelativeTime(tx.timestamp)}
                        </time>
                      </td>
                      <td className={table.td}>
                        <RiskBadge level={tx.risk_level} />
                      </td>
                      <td className={cn(table.td, 'text-right font-medium tabular-nums text-foreground')}>{tx.risk_score}</td>
                      <td className={cn(table.td, 'text-right tabular-nums text-muted-foreground')}>
                        {formatPercent(tx.fraud_probability, 2)}
                      </td>
                      <td className={table.td}>
                        <DecisionLabel decision={parseAction(tx.recommended_action).decision} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
