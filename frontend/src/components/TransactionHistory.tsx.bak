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
    const interval = setInterval(loadTransactions, 5000)
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
      'LOW': 'bg-green-500/10 text-green-400 border-green-500/30',
      'MEDIUM': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'HIGH': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      'CRITICAL': 'bg-red-500/10 text-red-400 border-red-500/30'
    }
    return badges[level as keyof typeof badges] || badges.LOW
  }

  const getRiskIcon = (level: string) => {
    if (level === 'CRITICAL') return '🔴'
    if (level === 'HIGH') return '🟠'
    if (level === 'MEDIUM') return '🟡'
    return '🟢'
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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div 
          onClick={() => setFilter('all')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'all' ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/5'}`}
        >
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Total</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        
        <div 
          onClick={() => setFilter('LOW')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'LOW' ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-white/5'}`}
        >
          <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">🟢</span> Low Risk
          </p>
          <p className="text-3xl font-bold text-green-400">{stats.low}</p>
        </div>

        <div 
          onClick={() => setFilter('MEDIUM')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'MEDIUM' ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-white/5'}`}
        >
          <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">🟡</span> Medium
          </p>
          <p className="text-3xl font-bold text-yellow-400">{stats.medium}</p>
        </div>

        <div 
          onClick={() => setFilter('HIGH')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'HIGH' ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-white/5'}`}
        >
          <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">🟠</span> High Risk
          </p>
          <p className="text-3xl font-bold text-orange-400">{stats.high}</p>
        </div>

        <div 
          onClick={() => setFilter('CRITICAL')}
          className={`glass-panel rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${filter === 'CRITICAL' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/5'}`}
        >
          <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2 flex items-center">
            <span className="mr-2">🔴</span> Critical
          </p>
          <p className="text-3xl font-bold text-red-400">{stats.critical}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="glass-panel rounded-xl p-4 flex items-center space-x-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by transaction ID..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <button className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-purple-400 transition-colors">
          Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-muted-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/5">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Time
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Transaction ID
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Risk Level
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Risk Score
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Probability
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 text-sm text-slate-300 font-mono">
                      {new Date(tx.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm font-mono text-white group-hover:text-purple-400 transition-colors">
                      {tx.transaction_id.slice(-16)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono border ${getRiskBadge(tx.risk_level)}`}>
                        <span>{getRiskIcon(tx.risk_level)}</span>
                        <span>{tx.risk_level}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-white">{tx.risk_score}</span>
                        <div className="w-20 h-2 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              tx.risk_score >= 80 ? 'bg-red-500' :
                              tx.risk_score >= 60 ? 'bg-orange-500' :
                              tx.risk_score >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${tx.risk_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-300 font-mono">
                      {(tx.fraud_probability * 100).toFixed(2)}%
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium ${
                        tx.is_fraud
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-green-500/10 text-green-400 border border-green-500/30'
                      }`}>
                        {tx.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
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
