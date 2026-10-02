import type { Metadata } from 'next'
import TransactionHistory from '@/components/TransactionHistory'

export const metadata: Metadata = { title: 'Transactions' }

export default function HistoryPage() {
  return <TransactionHistory />
}
