import type { Metadata } from 'next'
import ScoringWorkbench from '@/components/ScoringWorkbench'

export const metadata: Metadata = { title: 'Score transaction' }

export default function AnalyzePage() {
  return <ScoringWorkbench />
}
