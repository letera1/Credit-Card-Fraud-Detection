import type { Metadata } from 'next'
import FraudAlerts from '@/components/FraudAlerts'

export const metadata: Metadata = { title: 'Alerts' }

export default function AlertsPage() {
  return <FraudAlerts />
}
