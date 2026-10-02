import { ChevronDown } from 'lucide-react'
import { PredictionDetails } from '@/components/ResultCard'
import { FEATURE_KEYS, type PredictionResult, type TransactionInput } from '@/types'

export default function TransactionDetail({
  result,
  input,
}: {
  result: PredictionResult
  input?: Partial<TransactionInput> | null
}) {
  const entries = input
    ? FEATURE_KEYS.flatMap((key) => (typeof input[key] === 'number' ? [[key, input[key] as number] as const] : []))
    : []

  return (
    <div className="space-y-6">
      <PredictionDetails result={result} />
      {entries.length > 0 && (
        <details className="group rounded-lg border border-border">
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between rounded-lg px-4 py-3 text-13 font-medium text-foreground [&::-webkit-details-marker]:hidden">
            Input features ({entries.length})
            <ChevronDown className="size-4 text-subtle-foreground transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <dl className="grid grid-cols-2 gap-x-6 border-t border-border px-4 py-3 sm:grid-cols-3">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-2 py-1 text-xs">
                <dt className="font-mono text-muted-foreground">{key}</dt>
                <dd className="font-mono tabular-nums text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  )
}
