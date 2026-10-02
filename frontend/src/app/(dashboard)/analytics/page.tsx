import type { Metadata } from 'next'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'

export const metadata: Metadata = { title: 'Analytics' }

export default function AnalyticsPage() {
  return <AdvancedAnalytics />
}
