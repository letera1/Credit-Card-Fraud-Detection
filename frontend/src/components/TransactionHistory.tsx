'use client'

import { useEffect, useState } from 'react'
import { getTransactions } from '@/lib/api'

interface Transaction {
  transaction_id: string
  timestamp: string
  fraud_probability: number
  is_fraud: boolean
  risk_score: number
  risk_level: string
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadTransactions()
    const interval = setInterval(loadTransactions, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadTransactions = async () => {
    try {
      const data = await getTransactions(50)
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (level: string) => {
    const badges = {
      'LOW': 'bg-green-500/10 text-green-500 border-green-500/30',
      'MEDIUM': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
      'HIGH': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      'CRITICAL': 'bg-red-500/10 text-red-500 border-red-500/30'
    }
    return badges[level as keyof typeof badges] || badges.LOW
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.risk_level === filter
    const matchesSearch = tx.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: transactions.length,
    low: transactions.filter(t => t.risk_level === 'LOW').length,
    medium: transactions.filter(t => t.risk_level === 'MEDIUM').length,
    high: transactions.filter(t => t.risk_level === 'HIGH').length,
    critical: transactions.filter(t => t.risk_level === 'CRITICAL').length
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Total"
          value={stats.total}
          filter={filter}
          color="purple"
          setFilter={setFilter}
          id="all"
        />
        <StatCard
          label="Low Risk"
          value={stats.low}
          filter={filter}
          color="green"
          setFilter={setFilter}
          id="LOW"
        />
        <StatCard
          label="Medium"
          value={stats.medium}
          filter={filter}
          color="yellow"
          setFilter={setFilter}
          id="MEDIUM"
        />
        <StatCard
          label="High"
          value={stats.high}
          filter={filter}
          color="orange"
          setFilter={setFilter}
          id="HIGH"
        />
        <StatCard
          label="Critical"
          value={stats.critical}
          filter={filter}
          color="red"
          setFilter={setFilter}
          id="CRITICAL"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by transaction ID..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
          />
        </div>
        <button className="px-4 py-2 bg-muted/40 hover:bg-muted/60 border border-border/60 rounded-lg text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">
          Export CSV
        </button>
      </div>

      <div className="glass-panel rounded-xl border-border/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-foreground font-medium">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Time', 'Transaction ID', 'Risk Level', 'Risk Score', 'Probability', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 md:px-6 text-xs font-mono text-muted-foreground uppercase tracking-widest bg-muted/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-t border-border/30 hover:bg-muted/20 transition-colors group">
                    <td className="py-3 px-4 md:px-6 text-sm font-mono text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 md:px-6 text-sm font-mono text-foreground group-hover:text-primary transition-colors">
                      {tx.transaction_id.slice(-16)}
                    </td>
                    <td className="py-3 px-4 md:px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono border ${getRiskBadge(tx.risk_level)}`}>
                        {tx.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{tx.risk_score}</span>
                        <div className="w-16 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${tx.risk_score >= 80 ? 'bg-red-500' : tx.risk_score >= 60 ? 'bg-orange-500' : tx.risk_score >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${tx.risk_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 md:px-6 text-sm text-muted-foreground font-mono">
                      {(tx.fraud_probability * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 md:px-6">
                      <span className={
                        tx.is_fraud
                          ? 'bg-red-500/10 text-red-500 border border-red-500/25 px-2.5 py-1 rounded-md text-xs font-medium'
                          : 'bg-green-500/10 text-green-600 border border-green-500/25 px-2.5 py-1 rounded-md text-xs font-medium'
                      }>
                        {tx.is_fraud ? 'FRAUD' : 'CLEAR'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, filter, setFilter, id, color }: {
  label: string; value: number; filter: string; setFilter: (f: string) => void; id: string; color: string;
}) {
  const colors: Record<string, { border: string; shadow: string }> = {
    red: { border: 'border-red-500/50', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]' },
    orange: { border: 'border-orange-500/50', shadow: 'shadow-[0_0_15px_rgba(251,146,60,0.25)]' },
    yellow: { border: 'border-yellow-500/50', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
    green: { border: 'border-green-500/50', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]' },
    purple: { border: 'border-purple-500/50', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]' },
  }
  const isActive = filter === id
  const sel = colors[color] || colors.purple

  return (
    <div
      onClick={() => setFilter(id)}
      className={`glass-panel rounded-xl p-3 md:p-4 cursor-pointer transition-all hover:scale-105 ${
        isActive ? `${sel.border} ${sel.shadow}` : 'border-border/50'
      }`}
    >
      <p className={`text-2xs font-mono uppercase tracking-widest mb-1 ${isActive ? `text-${color}-500` : 'text-muted-foreground'}`}>{label}</p>
      <p className={`text-xl md:text-2xl font-bold ${isActive ? `text-${color}-500` : 'text-foreground'}`}>{value}</p>
    </div>
  )
}
