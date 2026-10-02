import type { Metadata } from 'next'
import BatchProcessing from '@/components/BatchProcessing'

export const metadata: Metadata = { title: 'Batch scoring' }

export default function BatchPage() {
  return <BatchProcessing />
}
