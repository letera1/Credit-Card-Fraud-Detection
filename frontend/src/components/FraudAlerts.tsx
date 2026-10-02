'use client'

import { useMemo, useState } from 'react'
import { BellOff, Check, LoaderCircle, Search, TriangleAlert } from 'lucide-react'
import { Sheet } from '@/components/overlays'
import {
  Badge,
  Button,
  Callout,
  Card,
  CopyButton,
  DecisionBadge,
  DescriptionList,
  EmptyState,
  ErrorState,
  Input,
  PageHeader,
  Pagination,
  RiskBadge,
  Segmented,
  Select,
  Skeleton,
  table,
} from '@/components/ui'
import { getAlerts, getErrorMessage, resolveAlert } from '@/lib/api'
import { ALERTS_CHANGED_EVENT, usePolling } from '@/lib/hooks'
import { cn, formatDateTime, formatRelativeTime, parseAction, RISK_LEVELS, RISK_META } from '@/lib/utils'
import type { Alert, RiskLevel } from '@/types'

const PAGE_SIZE = 15
type StatusFilter = 'active' | 'resolved' | 'all'

function StatusBadge({ status }: { status: Alert['status'] }) {
  return status === 'active' ? (
    <Badge className="bg-primary/10 text-accent ring-primary/20">Active</Badge>
  ) : (
    <Badge className="bg-success/10 text-success-fg ring-success/20">
      <Check className="size-3" aria-hidden />
      Resolved
    </Badge>
  )
}

export default function FraudAlerts() {
  const { data, error, loading, refresh, setData } = usePolling(getAlerts, 10000)
  const [status, setStatus] = useState<StatusFilter>('active')
  const [severity, setSeverity] = useState<'ALL' | RiskLevel>('ALL')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const alerts = useMemo(() => data?.alerts ?? [], [data])
  const selected = alerts.find((alert) => alert.alert_id === selectedId) ?? null
  const activeCount = alerts.filter((alert) => alert.status === 'active').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return alerts.filter(
      (alert) =>
        (status === 'all' || alert.status === status) &&
        (severity === 'ALL' || alert.severity === severity) &&
        (!q || alert.alert_id.toLowerCase().includes(q) || alert.transaction_id.toLowerCase().includes(q)),
    )
  }, [alerts, status, severity, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resolve = async (alert: Alert) => {
    setResolvingId(alert.alert_id)
    setActionError(null)
    try {
      await resolveAlert(alert.alert_id)
      setData(
        (previous) =>
          previous && {
            ...previous,
            active: Math.max(0, previous.active - 1),
            alerts: previous.alerts.map((item) => (item.alert_id === alert.alert_id ? { ...item, status: 'resolved' as const } : item)),
          },
      )
      window.dispatchEvent(new Event(ALERTS_CHANGED_EVENT))
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setResolvingId(null)
    }
  }

  const selectedAction = selected ? parseAction(selected.recommended_action) : null

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" description="Raised when a transaction is classified as fraud or scores 60 or higher." />

      {error && <ErrorState message={error} onRetry={refresh} />}
      {actionError && (
        <Callout tone="danger" title="Couldn't resolve the alert">
          {actionError}
        </Callout>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <Segmented
            label="Filter by status"
            value={status}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
            options={[
              { value: 'active', label: 'Active', count: activeCount },
              { value: 'resolved', label: 'Resolved', count: alerts.length - activeCount },
              { value: 'all', label: 'All', count: alerts.length },
            ]}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" aria-hidden />
              <Input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search alert or transaction ID"
                aria-label="Search alert or transaction ID"
                className="pl-9"
              />
            </div>
            <Select
              aria-label="Filter by severity"
              value={severity}
              onChange={(event) => {
                setSeverity(event.target.value as 'ALL' | RiskLevel)
                setPage(1)
              }}
              className="sm:w-44"
            >
              <option value="ALL">All severities</option>
              {RISK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {RISK_META[level].label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {loading && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : !filtered.length ? (
          <EmptyState
            icon={BellOff}
            title={alerts.length ? 'No matching alerts' : 'No alerts yet'}
            description={
              alerts.length
                ? 'Try another status, severity or search term.'
                : 'Alerts appear here when the model flags a transaction as fraud or scores it 60 or higher.'
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-13">
                <thead>
                  <tr className={table.headRow}>
                    <th scope="col" className={table.th}>Severity</th>
                    <th scope="col" className={table.th}>Alert</th>
                    <th scope="col" className={table.th}>Transaction</th>
                    <th scope="col" className={cn(table.th, 'text-right')}>Risk score</th>
                    <th scope="col" className={table.th}>Flags</th>
                    <th scope="col" className={table.th}>Raised</th>
                    <th scope="col" className={table.th}>Status</th>
                    <th scope="col" className={table.th}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((alert) => (
                    <tr key={alert.alert_id} onClick={() => setSelectedId(alert.alert_id)} className={cn(table.row, 'cursor-pointer')}>
                      <td className={table.td}>
                        <RiskBadge level={alert.severity} />
                      </td>
                      <td className={cn(table.td, 'h-14')}>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedId(alert.alert_id)
                          }}
                          className="focus-ring rounded text-left"
                        >
                          <span className="block font-medium text-foreground hover:text-accent">{alert.alert_id}</span>
                          <span className="block text-xs text-subtle-foreground">{alert.message}</span>
                        </button>
                      </td>
                      <td className={cn(table.td, 'font-mono text-xs text-muted-foreground')}>{alert.transaction_id}</td>
                      <td className={cn(table.td, 'text-right font-medium tabular-nums text-foreground')}>{alert.risk_score}</td>
                      <td className={cn(table.td, 'text-muted-foreground')}>
                        {alert.anomaly_flags.length ? (
                          <span className="flex max-w-60 items-center gap-1" title={alert.anomaly_flags.join(', ')}>
                            <span className="truncate">{alert.anomaly_flags[0]}</span>
                            {alert.anomaly_flags.length > 1 && (
                              <span className="shrink-0 text-subtle-foreground">+{alert.anomaly_flags.length - 1}</span>
                            )}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className={cn(table.td, 'text-muted-foreground')}>
                        <time dateTime={alert.timestamp} title={formatDateTime(alert.timestamp)}>
                          {formatRelativeTime(alert.timestamp)}
                        </time>
                      </td>
                      <td className={table.td}>
                        <StatusBadge status={alert.status} />
                      </td>
                      <td className={cn(table.td, 'text-right')}>
                        {alert.status === 'active' && (
                          <Button
                            size="sm"
                            disabled={resolvingId === alert.alert_id}
                            onClick={(event) => {
                              event.stopPropagation()
                              resolve(alert)
                            }}
                          >
                            {resolvingId === alert.alert_id && <LoaderCircle className="animate-spin" />}
                            Resolve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={currentPage} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </Card>

      <Sheet
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? `Alert ${selected.alert_id}` : ''}
        description={selected?.message}
        footer={
          selected?.status === 'active' ? (
            <>
              <Button onClick={() => setSelectedId(null)}>Close</Button>
              <Button variant="primary" disabled={resolvingId === selected.alert_id} onClick={() => resolve(selected)}>
                {resolvingId === selected.alert_id ? <LoaderCircle className="animate-spin" /> : <Check />}
                Resolve alert
              </Button>
            </>
          ) : undefined
        }
      >
        {selected && selectedAction && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge level={selected.severity} />
              <StatusBadge status={selected.status} />
            </div>

            <section>
              <h3 className="text-13 font-medium text-foreground">Recommended action</h3>
              <div className="mt-2 flex items-start gap-3">
                <DecisionBadge decision={selectedAction.decision} />
                {selectedAction.detail && <p className="text-13 text-muted-foreground">{selectedAction.detail}</p>}
              </div>
            </section>

            {selected.solution && (
              <section>
                <h3 className="text-13 font-medium text-foreground">Suggested response</h3>
                <p className="mt-1 text-13 leading-relaxed text-muted-foreground">{selected.solution}</p>
              </section>
            )}

            <section>
              <h3 className="text-13 font-medium text-foreground">Rule-based flags</h3>
              {selected.anomaly_flags.length ? (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.anomaly_flags.map((flag) => (
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

            <DescriptionList
              className="border-t border-border"
              items={[
                {
                  label: 'Transaction',
                  value: (
                    <span className="inline-flex items-center gap-1">
                      <span className="truncate font-mono text-xs">{selected.transaction_id}</span>
                      <CopyButton value={selected.transaction_id} label="Copy transaction ID" />
                    </span>
                  ),
                },
                { label: 'Risk score', value: <span className="tabular-nums">{selected.risk_score} / 100</span> },
                { label: 'Model confidence', value: <span className="tabular-nums">{selected.confidence.toFixed(1)}%</span> },
                { label: 'Raised', value: formatDateTime(selected.timestamp) },
              ]}
            />
          </div>
        )}
      </Sheet>
    </div>
  )
}
