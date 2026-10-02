'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Download, Search } from 'lucide-react'
import { countByRiskLevel } from '@/components/FraudDistributionChart'
import { Sheet } from '@/components/overlays'
import TransactionDetail from '@/components/TransactionDetail'
import {
  Button,
  buttonStyles,
  Card,
  DecisionLabel,
  EmptyState,
  ErrorState,
  Input,
  PageHeader,
  Pagination,
  RiskBadge,
  Segmented,
  Skeleton,
  SortButton,
  table,
  type SortDirection,
} from '@/components/ui'
import { getTransactions } from '@/lib/api'
import { usePolling } from '@/lib/hooks'
import {
  cn,
  downloadFile,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  parseAction,
  RISK_LEVELS,
  RISK_META,
  toCsv,
} from '@/lib/utils'
import type { RiskLevel, TransactionRecord } from '@/types'

const PAGE_SIZE = 15
type SortKey = 'timestamp' | 'risk_score' | 'fraud_probability'

const fetchTransactions = () => getTransactions(500)

export default function TransactionHistory() {
  const { data, error, loading, refresh } = usePolling(fetchTransactions, 10000)
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<'ALL' | RiskLevel>('ALL')
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'timestamp', direction: 'desc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<TransactionRecord | null>(null)

  const transactions = useMemo(() => data?.transactions ?? [], [data])
  const counts = useMemo(() => countByRiskLevel(transactions), [transactions])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sortValue = (tx: TransactionRecord) =>
      sort.key === 'timestamp' ? new Date(tx.timestamp).getTime() : sort.key === 'risk_score' ? tx.risk_score : tx.fraud_probability
    return transactions
      .filter((tx) => (level === 'ALL' || tx.risk_level === level) && (!q || tx.transaction_id.toLowerCase().includes(q)))
      .sort((a, b) => (sortValue(a) - sortValue(b)) * (sort.direction === 'asc' ? 1 : -1))
  }, [transactions, query, level, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc' }))
    setPage(1)
  }
  const ariaSort = (key: SortKey): 'ascending' | 'descending' | 'none' =>
    sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'

  const clearFilters = () => {
    setQuery('')
    setLevel('ALL')
    setPage(1)
  }

  const exportCsv = () => {
    const header = ['transaction_id', 'timestamp', 'risk_level', 'risk_score', 'fraud_probability', 'is_fraud', 'decision', 'anomaly_flags']
    const body = filtered.map((tx) => [
      tx.transaction_id,
      tx.timestamp,
      tx.risk_level,
      tx.risk_score,
      tx.fraud_probability,
      tx.is_fraud,
      parseAction(tx.recommended_action).decision,
      tx.anomaly_flags.join('; '),
    ])
    downloadFile(`transactions-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([header, ...body]), 'text/csv')
  }

  const description =
    data && data.total > transactions.length
      ? `Latest ${formatNumber(transactions.length)} of ${formatNumber(data.total)} transactions scored since the API started.`
      : 'Every transaction scored since the API started, newest first.'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description={description}
        actions={
          <Button onClick={exportCsv} disabled={!filtered.length}>
            <Download />
            Export CSV
          </Button>
        }
      />

      {error && <ErrorState message={error} onRetry={refresh} />}

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search by transaction ID"
              aria-label="Search by transaction ID"
              className="pl-9"
            />
          </div>
          <Segmented
            label="Filter by risk level"
            value={level}
            onChange={(value) => {
              setLevel(value)
              setPage(1)
            }}
            options={[
              { value: 'ALL', label: 'All', count: transactions.length },
              ...RISK_LEVELS.map((riskLevel) => ({ value: riskLevel, label: RISK_META[riskLevel].label, count: counts[riskLevel] })),
            ]}
          />
        </div>

        {loading && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : !transactions.length ? (
          <EmptyState icon={ArrowLeftRight} title="No transactions yet" description="Scored transactions appear here as soon as they are processed.">
            <Link href="/analyze" className={buttonStyles({ variant: 'primary' })}>
              Score transaction
            </Link>
          </EmptyState>
        ) : !filtered.length ? (
          <EmptyState icon={Search} title="No matching transactions" description="Try a different transaction ID or risk level.">
            <Button onClick={clearFilters}>Clear filters</Button>
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-13">
                <thead>
                  <tr className={table.headRow}>
                    <th scope="col" className={table.th}>Transaction</th>
                    <th scope="col" className={table.th} aria-sort={ariaSort('timestamp')}>
                      <SortButton label="Scored" active={sort.key === 'timestamp'} direction={sort.direction} onClick={() => toggleSort('timestamp')} />
                    </th>
                    <th scope="col" className={table.th}>Risk level</th>
                    <th scope="col" className={cn(table.th, 'text-right')} aria-sort={ariaSort('risk_score')}>
                      <SortButton label="Risk score" active={sort.key === 'risk_score'} direction={sort.direction} onClick={() => toggleSort('risk_score')} />
                    </th>
                    <th scope="col" className={cn(table.th, 'text-right')} aria-sort={ariaSort('fraud_probability')}>
                      <SortButton
                        label="Probability"
                        active={sort.key === 'fraud_probability'}
                        direction={sort.direction}
                        onClick={() => toggleSort('fraud_probability')}
                      />
                    </th>
                    <th scope="col" className={table.th}>Decision</th>
                    <th scope="col" className={cn(table.th, 'text-right')}>Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((tx) => (
                    <tr key={tx.transaction_id} onClick={() => setSelected(tx)} className={cn(table.row, 'cursor-pointer')}>
                      <td className={table.td}>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelected(tx)
                          }}
                          className="focus-ring rounded font-mono text-xs text-foreground hover:text-accent"
                        >
                          {tx.transaction_id}
                        </button>
                      </td>
                      <td className={cn(table.td, 'text-muted-foreground')}>
                        <time dateTime={tx.timestamp} title={formatDateTime(tx.timestamp)}>
                          {formatRelativeTime(tx.timestamp)}
                        </time>
                      </td>
                      <td className={table.td}>
                        <RiskBadge level={tx.risk_level} />
                      </td>
                      <td className={cn(table.td, 'text-right font-medium tabular-nums text-foreground')}>{tx.risk_score}</td>
                      <td className={cn(table.td, 'text-right tabular-nums text-muted-foreground')}>{formatPercent(tx.fraud_probability, 2)}</td>
                      <td className={table.td}>
                        <DecisionLabel decision={parseAction(tx.recommended_action).decision} />
                      </td>
                      <td className={cn(table.td, 'text-right tabular-nums text-muted-foreground')}>{tx.anomaly_flags.length || '—'}</td>
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
        onClose={() => setSelected(null)}
        title="Transaction details"
        description={<span className="font-mono text-xs">{selected?.transaction_id}</span>}
      >
        {selected && <TransactionDetail result={selected} input={selected.transaction_data} />}
      </Sheet>
    </div>
  )
}
