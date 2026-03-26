'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { formatPercentage } from '@/lib/utils'

interface Transaction {
  transaction_id: string
  timestamp: string
  is_fraud: boolean
  fraud_probability: number
  risk_score: number
  risk_level: string
  recommended_action: string
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
    const interval = setInterval(fetchTransactions, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/transactions?limit=10')
      setTransactions(response.data.transactions.reverse())
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20'
      case 'HIGH':
        return 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'MEDIUM':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20'
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Transaction History</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-lg font-semibold text-foreground mb-2">No Transactions Yet</p>
        <p className="text-muted-foreground">Start analyzing transactions to see history</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Transaction History</h3>
            <p className="text-sm text-muted-foreground mt-1">Recent fraud detection results</p>
          </div>
          <button
            onClick={fetchTransactions}
            className="px-3 py-1.5 text-sm rounded-lg bg-secondary hover:bg-accent transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.transaction_id}
              className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {txn.transaction_id}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getRiskColor(txn.risk_level)}`}>
                      {txn.risk_level}
                    </span>
                    {txn.is_fraud && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                        🚨 FRAUD
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Risk Score</p>
                      <p className="font-semibold text-foreground">{txn.risk_score}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Probability</p>
                      <p className="font-semibold text-foreground">
                        {formatPercentage(txn.fraud_probability)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-semibold text-foreground">
                        {new Date(txn.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
