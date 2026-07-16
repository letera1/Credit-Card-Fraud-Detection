'use client'

import { useEffect, useState, useMemo } from 'react'
import { getTransactions } from '@/lib/api'

interface Transaction {
  transaction_id: string
  timestamp: string
  fraud_probability: number
  is_fraud: boolean
  risk_score: number
  risk_level: string
}

type SortField = 'timestamp' | 'risk_score' | 'fraud_probability' | 'risk_level'
type SortDir = 'asc' | 'desc'

const ITEMS_PER_PAGE = 12

const riskOrder: Record<string, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('timestamp')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [dateRange, setDateRange] = useState<'all' | '1h' | '6h' | '24h' | '7d'>('all')

  useEffect(() => {
    loadTransactions()
    const interval = setInterval(loadTransactions, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadTransactions = async () => {
    try {
      const data = await getTransactions(500)
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => ({
    total: transactions.length,
    low: transactions.filter(t => t.risk_level === 'LOW').length,
    medium: transactions.filter(t => t.risk_level === 'MEDIUM').length,
    high: transactions.filter(t => t.risk_level === 'HIGH').length,
    critical: transactions.filter(t => t.risk_level === 'CRITICAL').length,
    fraudRate: transactions.length > 0
      ? ((transactions.filter(t => t.is_fraud).length / transactions.length) * 100).toFixed(1)
      : '0.0',
    avgScore: transactions.length > 0
      ? (transactions.reduce((sum, t) => sum + t.risk_score, 0) / transactions.length).toFixed(1)
      : '0.0',
  }), [transactions])

  const filteredTransactions = useMemo(() => {
    const now = Date.now()
    const cutoff = dateRange === 'all' ? 0 : {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    }[dateRange]

    return transactions
      .filter(tx => {
        if (filter !== 'all' && tx.risk_level !== filter) return false
        if (searchQuery && !tx.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())) return false
        if (cutoff && (now - new Date(tx.timestamp).getTime()) > cutoff) return false
        return true
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortField === 'timestamp') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        else if (sortField === 'risk_score') cmp = a.risk_score - b.risk_score
        else if (sortField === 'fraud_probability') cmp = a.fraud_probability - b.fraud_probability
        else if (sortField === 'risk_level') cmp = (riskOrder[a.risk_level] ?? 0) - (riskOrder[b.risk_level] ?? 0)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [transactions, filter, searchQuery, sortField, sortDir, dateRange])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE))
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [filter, searchQuery, sortField, sortDir, dateRange])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const exportCSV = () => {
    const headers = ['Time', 'Transaction ID', 'Risk Level', 'Risk Score', 'Probability', 'Status']
    const rows = filteredTransactions.map(tx => [
      new Date(tx.timestamp).toISOString(),
      tx.transaction_id,
      tx.risk_level,
      tx.risk_score.toString(),
      (tx.fraud_probability * 100).toFixed(2) + '%',
      tx.is_fraud ? 'FRAUD' : 'CLEAR',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRiskConfig = (level: string) => {
    const configs: Record<string, { bg: string; text: string; border: string; glow: string; dot: string }> = {
      LOW:      { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]', dot: 'bg-emerald-500' },
      MEDIUM:   { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30', glow: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]', dot: 'bg-yellow-500' },
      HIGH:     { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', glow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]', dot: 'bg-orange-500' },
      CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]', dot: 'bg-red-500' },
    }
    return configs[level] || configs.LOW
  }

  const activeFilters = [
    filter !== 'all' && { key: 'risk', label: filter, clear: () => setFilter('all') },
    searchQuery && { key: 'search', label: `"${searchQuery}"`, clear: () => setSearchQuery('') },
    dateRange !== 'all' && { key: 'date', label: dateRange.toUpperCase(), clear: () => setDateRange('all') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return (
      <svg className="w-3 h-3 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
    return (
      <svg className={`w-3 h-3 text-primary transition-transform ${sortDir === 'asc' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-6 border-border/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold gradient-text">Transaction Logs</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-sm font-mono text-muted-foreground">Monitor and analyze all processed transactions in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-lg font-bold font-mono text-primary">{stats.fraudRate}%</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Fraud Rate</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <p className="text-lg font-bold font-mono text-blue-400">{stats.avgScore}</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, id: 'all', color: 'purple', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
          { label: 'Low Risk', value: stats.low, id: 'LOW', color: 'emerald', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Medium', value: stats.medium, id: 'MEDIUM', color: 'yellow', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
          { label: 'High', value: stats.high, id: 'HIGH', color: 'orange', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
          { label: 'Critical', value: stats.critical, id: 'CRITICAL', color: 'red', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
        ].map(card => {
          const isActive = filter === card.id
          const colorMap: Record<string, { active: string; bar: string }> = {
            purple:  { active: 'border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]', bar: 'bg-primary' },
            emerald: { active: 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]', bar: 'bg-emerald-500' },
            yellow:  { active: 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]', bar: 'bg-yellow-500' },
            orange:  { active: 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]', bar: 'bg-orange-500' },
            red:     { active: 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.25)]', bar: 'bg-red-500' },
          }
          const cm = colorMap[card.color] || colorMap.purple
          const textColors: Record<string, string> = {
            purple: 'text-primary', emerald: 'text-emerald-500', yellow: 'text-yellow-500', orange: 'text-orange-500', red: 'text-red-500',
          }
          return (
            <button
              key={card.id}
              onClick={() => setFilter(card.id)}
              className={`glass-panel rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.03] text-left relative overflow-hidden group ${
                isActive ? cm.active : 'border-border/40 hover:border-border/60'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${isActive ? cm.bar : 'bg-transparent'} transition-all`} />
              <div className="flex items-center justify-between mb-2">
                <p className={`text-[10px] font-mono uppercase tracking-widest ${isActive ? textColors[card.color] : 'text-muted-foreground/60'}`}>
                  {card.label}
                </p>
                <svg className={`w-4 h-4 transition-colors ${isActive ? textColors[card.color] : 'text-muted-foreground/30 group-hover:text-muted-foreground/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
              <p className={`text-2xl font-bold font-mono ${isActive ? textColors[card.color] : 'text-foreground'}`}>
                {card.value}
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Filter Bar ────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl p-4 border-border/40">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transaction ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border/40">
            {(['all', '1h', '6h', '24h', '7d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  dateRange === range
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {range === 'all' ? 'All' : range}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-xl text-xs font-mono font-medium transition-all text-muted-foreground hover:text-foreground hover:border-border/70"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
            <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Filters:</span>
            {activeFilters.map(f => (
              <span key={f.key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
                {f.label}
                <button onClick={f.clear} className="hover:text-primary/70 transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            ))}
            <button
              onClick={() => { setFilter('all'); setSearchQuery(''); setDateRange('all') }}
              className="text-[10px] font-mono text-muted-foreground/50 hover:text-foreground transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="glass-panel rounded-2xl border-border/40 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-primary/20 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-xs font-mono text-muted-foreground/60">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No transactions found</p>
            <p className="text-xs font-mono text-muted-foreground/60">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    {[
                      { label: 'Time', field: 'timestamp' as SortField },
                      { label: 'Transaction ID', field: null },
                      { label: 'Risk Level', field: 'risk_level' as SortField },
                      { label: 'Risk Score', field: 'risk_score' as SortField },
                      { label: 'Probability', field: 'fraud_probability' as SortField },
                      { label: 'Status', field: null },
                    ].map(col => (
                      <th
                        key={col.label}
                        onClick={col.field ? () => handleSort(col.field!) : undefined}
                        className={`text-left py-3.5 px-5 text-[10px] font-mono font-semibold text-muted-foreground/60 uppercase tracking-widest bg-muted/20 ${col.field ? 'cursor-pointer hover:text-muted-foreground select-none' : ''}`}
                      >
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          {col.field && <SortIcon field={col.field} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((tx, idx) => {
                    const rc = getRiskConfig(tx.risk_level)
                    return (
                      <tr
                        key={tx.transaction_id + idx}
                        onClick={() => setSelectedTx(tx)}
                        className="border-t border-border/20 hover:bg-muted/15 transition-all cursor-pointer group"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono text-foreground/80">
                              {new Date(tx.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/40">
                              {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-sm font-mono text-foreground/70 group-hover:text-primary transition-colors">
                            {tx.transaction_id.slice(0, 8)}
                            <span className="text-muted-foreground/30">···</span>
                            {tx.transaction_id.slice(-6)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border ${rc.bg} ${rc.text} ${rc.border} ${rc.glow}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                            {tx.risk_level}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-bold font-mono text-foreground w-8">{tx.risk_score}</span>
                            <div className="w-20 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  tx.risk_score >= 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                  tx.risk_score >= 60 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                  tx.risk_score >= 30 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                  'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                }`}
                                style={{ width: `${tx.risk_score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-sm font-mono text-muted-foreground">
                            {(tx.fraud_probability * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          {tx.is_fraud ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-[11px] font-mono font-semibold text-red-500">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                              FRAUD
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono font-semibold text-emerald-500">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              CLEAR
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ──────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/30 bg-muted/10">
              <p className="text-xs font-mono text-muted-foreground/50">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number
                  if (totalPages <= 5) page = i + 1
                  else if (currentPage <= 3) page = i + 1
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i
                  else page = currentPage - 2 + i
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-all ${
                        currentPage === page
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Detail Modal ──────────────────────────────────── */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setSelectedTx(null)}>
          <div className="glass-panel w-full max-w-lg rounded-2xl border-border/60 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border/40 bg-muted/15 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-mono text-foreground">Transaction Detail</h3>
                <p className="text-xs font-mono text-muted-foreground/60 mt-0.5">{selectedTx.transaction_id}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Timestamp</p>
                  <p className="text-sm font-mono text-foreground">{new Date(selectedTx.timestamp).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Status</p>
                  <p className={`text-sm font-mono font-bold ${selectedTx.is_fraud ? 'text-red-500' : 'text-emerald-500'}`}>
                    {selectedTx.is_fraud ? 'FRAUDULENT' : 'LEGITIMATE'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Risk Score</p>
                  <p className="text-sm font-mono font-bold text-foreground">{selectedTx.risk_score}/100</p>
                </div>
                <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedTx.risk_score >= 80 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                      selectedTx.risk_score >= 60 ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                      selectedTx.risk_score >= 30 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                      'bg-gradient-to-r from-emerald-600 to-emerald-400'
                    }`}
                    style={{ width: `${selectedTx.risk_score}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Risk Level</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border ${getRiskConfig(selectedTx.risk_level).bg} ${getRiskConfig(selectedTx.risk_level).text} ${getRiskConfig(selectedTx.risk_level).border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getRiskConfig(selectedTx.risk_level).dot}`} />
                    {selectedTx.risk_level}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Fraud Probability</p>
                  <p className="text-sm font-mono font-bold text-foreground">{(selectedTx.fraud_probability * 100).toFixed(2)}%</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/20 border border-border/30">
                  <svg className="w-4 h-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xs font-mono text-muted-foreground/60">
                    {selectedTx.is_fraud
                      ? 'This transaction was flagged as fraudulent by the XGBoost v3.0.0 model.'
                      : 'This transaction passed all fraud detection checks.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
