import type { Metadata } from 'next'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export const metadata: Metadata = { title: 'Overview' }

export default function OverviewPage() {
  return <AnalyticsDashboard />
}
