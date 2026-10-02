import type { Metadata } from 'next'
import ModelInfo from '@/components/ModelInfo'

export const metadata: Metadata = { title: 'Model details' }

export default function ModelInfoPage() {
  return <ModelInfo />
}
