import type { Metadata } from 'next'
import ModelPerformance from '@/components/ModelPerformance'

export const metadata: Metadata = { title: 'Model performance' }

export default function PerformancePage() {
  return <ModelPerformance />
}
